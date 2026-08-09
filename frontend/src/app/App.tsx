import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { Header } from '@/shared/components/layout/Header';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { CourseListPage } from '@/features/courses/pages/CourseListPage';
import { CourseDetailModal } from '@/features/courses/components/CourseDetailModal';
import { RegisterConfirmModal } from '@/features/registration/components/RegisterConfirmModal';
import { RegisteredCoursesPage } from '@/features/registration/pages/RegisteredCoursesPage';
import { TimetableWeeklyPage } from '@/features/timetable/pages/TimetableWeeklyPage';
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { profileApi } from '@/features/profile/api/profileApi';
import { courseApi } from '@/features/courses/api/courseApi';
import { registrationApi } from '@/features/registration/api/registrationApi';
import { DesignSystemModal } from '@/dev/DesignSystemModal';

import { Course } from '@/features/courses/types/course.types';
import { RegistrationSummary } from '@/features/registration/types/registration.types';
import { UniversityNotification } from '@/features/notifications/types/notification.types';
import { Student } from '@/features/profile/types/profile.types';
import { NavigationTab } from '@/shared/types/navigation.types';
import { ToastMessage } from '@/shared/types/ui.types';
import { APP_TITLE } from '@/shared/constants/app';
import { getApiErrorMessage } from '@/shared/api/apiError';
import {
  SEMESTERS,
  NOTIFICATIONS_MOCK,
} from '@/mocks/mockData';

const AUTH_STUDENT_ID_STORAGE_KEY = 'courseRegistration.studentId';

function getStoredStudentId(): string | null {
  return localStorage.getItem(AUTH_STUDENT_ID_STORAGE_KEY)
    ?? sessionStorage.getItem(AUTH_STUDENT_ID_STORAGE_KEY);
}

function clearStoredStudentId() {
  localStorage.removeItem(AUTH_STUDENT_ID_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STUDENT_ID_STORAGE_KEY);
}

function storeStudentId(studentId: string, rememberMe: boolean) {
  clearStoredStudentId();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(AUTH_STUDENT_ID_STORAGE_KEY, studentId);
}

export default function App() {
  // Authentication State
  const [isInitializing, setIsInitializing] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const isAuthenticated = student !== null;

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Semester State
  const [currentSemester, setCurrentSemester] = useState<string>(SEMESTERS[0]);

  // Data State
  const [courses, setCourses] = useState<Course[]>([]);
  const [registrationSummary, setRegistrationSummary] = useState<RegistrationSummary | null>(null);
  const [isRegistrationLoading, setIsRegistrationLoading] = useState(false);
  const [registrationErrorMessage, setRegistrationErrorMessage] = useState('');
  const [notifications, setNotifications] = useState<UniversityNotification[]>(NOTIFICATIONS_MOCK);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar Collapse State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modal States
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null);
  const [selectedCourseForRegister, setSelectedCourseForRegister] = useState<Course | null>(null);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto dismiss toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadRegistrations = useCallback(async () => {
    if (!student?.id) {
      setRegistrationSummary(null);
      setRegistrationErrorMessage('');
      return;
    }

    setIsRegistrationLoading(true);
    setRegistrationErrorMessage('');

    try {
      const loadedRegistration = await registrationApi.getRegistrations(student.id);
      setRegistrationSummary(loadedRegistration);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setRegistrationSummary(null);
      setRegistrationErrorMessage(message);
      throw error;
    } finally {
      setIsRegistrationLoading(false);
    }
  }, [student?.id]);

  const refreshCoursesAfterRegistrationChange = async () => {
    try {
      const loadedCourses = await courseApi.getCourses();
      setCourses(loadedCourses);
    } catch {
      addToast(
        'warning',
        'Chua dong bo si so',
        'Thao tac dang ky da thanh cong, nhung danh sach mon hoc can duoc tai lai sau.'
      );
    }
  };

  useEffect(() => {
    let isMounted = true;
    const storedStudentId = getStoredStudentId();

    if (!storedStudentId) {
      setIsInitializing(false);
      return;
    }

    profileApi
      .getStudentById(storedStudentId)
      .then((storedStudent) => {
        if (isMounted) {
          setStudent(storedStudent);
        }
      })
      .catch(() => {
        clearStoredStudentId();
        if (isMounted) {
          setStudent(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsInitializing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!student?.id) {
      setRegistrationSummary(null);
      setRegistrationErrorMessage('');
      return;
    }

    void loadRegistrations().catch(() => undefined);
  }, [student?.id, loadRegistrations]);

  // Login handler
  const handleLoginSuccess = (loggedInStudent: Student, rememberMe: boolean) => {
    setStudent(loggedInStudent);
    storeStudentId(loggedInStudent.id, rememberMe);
    setActiveTab('dashboard');
    addToast('success', 'Đăng nhập thành công', `Chào mừng ${loggedInStudent.name} quay trở lại Phenikaa Portal!`);
  };

  // Logout handler
  const handleLogout = () => {
    clearStoredStudentId();
    setStudent(null);
    setRegistrationSummary(null);
    setRegistrationErrorMessage('');
    setCourses([]);
    setActiveTab('dashboard');
    addToast('info', 'Đã đăng xuất', 'Bạn đã đăng xuất khỏi hệ thống an toàn.');
  };

  // Registered courses objects list
  const registeredCoursesList = useMemo(() => {
    return registrationSummary?.courses ?? [];
  }, [registrationSummary]);

  const registeredIds = useMemo(() => {
    return registeredCoursesList.map((course) => course.id);
  }, [registeredCoursesList]);

  const currentTotalCredits = useMemo(() => {
    return registrationSummary?.totalCredits ?? 0;
  }, [registrationSummary]);

  // Course Registration Handler
  const handleConfirmRegisterSuccess = async (registeredCourse: Course) => {
    if (!student) {
      const message = 'Can dang nhap truoc khi dang ky hoc phan.';
      addToast('error', 'Dang ky that bai', message);
      throw new Error(message);
    }

    try {
      const updatedRegistration = await registrationApi.registerCourse(student.id, registeredCourse.id);
      setRegistrationSummary(updatedRegistration);
      await refreshCoursesAfterRegistrationChange();

      addToast(
        'success',
        'Đăng ký môn học thành công!',
        `Đã thêm học phần ${registeredCourse.code} - ${registeredCourse.name} (${registeredCourse.credits} TC) vào danh sách.`
      );
    } catch (error) {
      const message = getApiErrorMessage(error);
      addToast('error', 'Dang ky that bai', message);
      throw error;
    }
  };

  // Course Cancel Handler
  const handleCancelRegistration = async (courseId: string) => {
    if (!student) {
      const message = 'Can dang nhap truoc khi huy dang ky hoc phan.';
      addToast('error', 'Huy dang ky that bai', message);
      throw new Error(message);
    }

    const targetCourse = registeredCoursesList.find((c) => c.id === courseId);

    try {
      const updatedRegistration = await registrationApi.cancelCourse(student.id, courseId);
      setRegistrationSummary(updatedRegistration);
      await refreshCoursesAfterRegistrationChange();

      addToast(
        'info',
        'Đã hủy đăng ký',
        targetCourse
          ? `Đã xóa học phần ${targetCourse.code} - ${targetCourse.name} khỏi danh sách học kỳ này.`
          : 'Đã xóa học phần khỏi danh sách học kỳ này.'
      );
    } catch (error) {
      const message = getApiErrorMessage(error);
      addToast('error', 'Huy dang ky that bai', message);
      throw error;
    }
  };

  // Mark notification read
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('success', 'Đã cập nhật', 'Đã đánh dấu tất cả thông báo là đã đọc.');
  };

  const handleCoursesLoaded = useCallback((loadedCourses: Course[]) => {
    setCourses(loadedCourses);
  }, []);

  if (isInitializing) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-semibold text-slate-700 shadow-sm">
          Đang khôi phục phiên đăng nhập...
        </div>
      </main>
    );
  }

  // If not authenticated, render Login Page
  if (!isAuthenticated) {
    return (
      <main>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </main>
    );
  }

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-800">
      {/* Toast Alert System */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={handleLogout}
        registeredCount={registeredIds.length}
        unreadNotifCount={unreadNotifCount}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main App Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header Navbar */}
        <Header
          student={student}
          currentSemester={currentSemester}
          onSelectSemester={setCurrentSemester}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogout={handleLogout}
          onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q.trim() && activeTab !== 'courses') {
              setActiveTab('courses');
            }
          }}
          courses={courses}
          registeredCourseIds={registeredIds}
          onOpenCourseDetail={setSelectedCourseForDetail}
        />

        {/* View Router Workspace */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardPage
              student={student}
              registeredCourses={registeredCoursesList}
              notifications={notifications}
              onNavigate={setActiveTab}
              currentSemester={currentSemester}
            />
          )}

          {activeTab === 'courses' && (
            <CourseListPage
              registeredCourseIds={registeredIds}
              onOpenCourseDetail={setSelectedCourseForDetail}
              onRequestRegister={setSelectedCourseForRegister}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onCoursesLoaded={handleCoursesLoaded}
            />
          )}

          {activeTab === 'registered' && (
            <RegisteredCoursesPage
              registeredCourses={registeredCoursesList}
              totalCredits={currentTotalCredits}
              isLoading={isRegistrationLoading}
              errorMessage={registrationErrorMessage}
              onRefresh={loadRegistrations}
              onCancelRegistration={handleCancelRegistration}
              onNavigate={setActiveTab}
              currentSemester={currentSemester}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableWeeklyPage
              studentId={student.id}
              currentSemester={currentSemester}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsPage
              notifications={notifications}
              onMarkRead={handleMarkNotificationRead}
              onMarkAllRead={handleMarkAllNotificationsRead}
            />
          )}

          {activeTab === 'profile' && <ProfilePage student={student} />}
        </main>
      </div>

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourseForDetail}
        onClose={() => setSelectedCourseForDetail(null)}
        isRegistered={
          selectedCourseForDetail
            ? registeredIds.includes(selectedCourseForDetail.id)
            : false
        }
        onRequestRegister={(course) => setSelectedCourseForRegister(course)}
      />

      {/* Register Confirmation Modal */}
      <RegisterConfirmModal
        course={selectedCourseForRegister}
        currentTotalCredits={currentTotalCredits}
        registeredCourses={registeredCoursesList}
        onClose={() => setSelectedCourseForRegister(null)}
        onConfirmSuccess={handleConfirmRegisterSuccess}
      />

      {/* Figma Design System Tokens Inspector Modal */}
      <DesignSystemModal
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
      />
    </div>
  );
}
