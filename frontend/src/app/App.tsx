import React, { useEffect, useState, useMemo } from 'react';
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
import { DesignSystemModal } from '@/dev/DesignSystemModal';

import { Course } from '@/features/courses/types/course.types';
import { UniversityNotification } from '@/features/notifications/types/notification.types';
import { Student } from '@/features/profile/types/profile.types';
import { NavigationTab } from '@/shared/types/navigation.types';
import { ToastMessage } from '@/shared/types/ui.types';
import { APP_TITLE } from '@/shared/constants/app';
import {
  INITIAL_STUDENT,
  SEMESTERS,
  COURSES_MOCK,
  INITIAL_REGISTERED_IDS,
  NOTIFICATIONS_MOCK,
} from '@/mocks/mockData';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState<Student>(INITIAL_STUDENT);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Semester State
  const [currentSemester, setCurrentSemester] = useState<string>(SEMESTERS[0]);

  // Data State
  const [courses, setCourses] = useState<Course[]>(COURSES_MOCK);
  const [registeredIds, setRegisteredIds] = useState<string[]>(INITIAL_REGISTERED_IDS);
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

  // Login handler
  const handleLoginSuccess = (studentIdInput: string) => {
    setStudent((prev) => ({
      ...prev,
      id: studentIdInput || prev.id,
    }));
    setIsAuthenticated(true);
    addToast('success', 'Đăng nhập thành công', `Chào mừng ${student.name} quay trở lại Phenikaa Portal!`);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    addToast('info', 'Đã đăng xuất', 'Bạn đã đăng xuất khỏi hệ thống an toàn.');
  };

  // Registered courses objects list
  const registeredCoursesList = useMemo(() => {
    return courses.filter((c) => registeredIds.includes(c.id));
  }, [courses, registeredIds]);

  const currentTotalCredits = useMemo(() => {
    return registeredCoursesList.reduce((sum, c) => sum + c.credits, 0);
  }, [registeredCoursesList]);

  // Course Registration Handler
  const handleConfirmRegisterSuccess = (registeredCourse: Course) => {
    // Check if already registered
    if (registeredIds.includes(registeredCourse.id)) {
      addToast('warning', 'Đã đăng ký', `Bạn đã đăng ký học phần ${registeredCourse.name} rồi!`);
      return;
    }

    // Add to registered list
    setRegisteredIds((prev) => [...prev, registeredCourse.id]);

    // Increment enrolled capacity count
    setCourses((prevCourses) =>
      prevCourses.map((c) =>
        c.id === registeredCourse.id ? { ...c, enrolled: c.enrolled + 1 } : c
      )
    );

    addToast(
      'success',
      'Đăng ký môn học thành công!',
      `Đã thêm học phần ${registeredCourse.code} - ${registeredCourse.name} (${registeredCourse.credits} TC) vào danh sách.`
    );
  };

  // Course Cancel Handler
  const handleCancelRegistration = (courseId: string) => {
    const targetCourse = courses.find((c) => c.id === courseId);

    setRegisteredIds((prev) => prev.filter((id) => id !== courseId));

    // Decrement enrolled count
    setCourses((prevCourses) =>
      prevCourses.map((c) =>
        c.id === courseId ? { ...c, enrolled: Math.max(0, c.enrolled - 1) } : c
      )
    );

    if (targetCourse) {
      addToast(
        'info',
        'Đã hủy đăng ký',
        `Đã xóa học phần ${targetCourse.code} - ${targetCourse.name} khỏi danh sách học kỳ này.`
      );
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
              courses={courses}
              registeredCourseIds={registeredIds}
              onOpenCourseDetail={setSelectedCourseForDetail}
              onRequestRegister={setSelectedCourseForRegister}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {activeTab === 'registered' && (
            <RegisteredCoursesPage
              registeredCourses={registeredCoursesList}
              onCancelRegistration={handleCancelRegistration}
              onNavigate={setActiveTab}
              currentSemester={currentSemester}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableWeeklyPage
              registeredCourses={registeredCoursesList}
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
