import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Palette,
  CheckCircle2,
  Calendar,
  BookOpen,
  X,
  Clock,
  MapPin,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { Course } from '@/features/courses/types/course.types';
import { UniversityNotification } from '@/features/notifications/types/notification.types';
import { Student } from '@/features/profile/types/profile.types';
import { NavigationTab } from '@/shared/types/navigation.types';
import { SEMESTERS } from '@/mocks/mockData';
import { UserAvatar } from '@/shared/components/ui/UserAvatar';

interface HeaderProps {
  student: Student;
  currentSemester: string;
  onSelectSemester: (semester: string) => void;
  notifications: UniversityNotification[];
  onMarkNotificationRead: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  onLogout: () => void;
  onOpenDesignSystem: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  courses?: Course[];
  registeredCourseIds?: string[];
  onOpenCourseDetail?: (course: Course) => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  currentSemester,
  onSelectSemester,
  notifications,
  onMarkNotificationRead,
  onNavigate,
  onLogout,
  onOpenDesignSystem,
  searchQuery,
  onSearchChange,
  courses = [],
  registeredCourseIds = [],
  onOpenCourseDetail,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSemesterMenu, setShowSemesterMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Filter matching course suggestions dynamically
  const matchingCourses = React.useMemo(() => {
    if (!searchQuery.trim() || !courses.length) return [];
    const q = searchQuery.toLowerCase().trim();
    return courses.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.lecturer.toLowerCase().includes(q) ||
        c.faculty.toLowerCase().includes(q)
    ).slice(0, 6); // Top 6 matching items for smooth dropdown
  }, [searchQuery, courses]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCourseSuggestion = (course: Course) => {
    setIsSearchFocused(false);
    if (onOpenCourseDetail) {
      onOpenCourseDetail(course);
    } else {
      onNavigate('courses');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between shadow-2xs">
      {/* Left Area: Global Search with Live Autocomplete Suggestions */}
      <div className="flex items-center gap-4 flex-1 max-w-lg relative" ref={searchRef}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm môn học, mã HP, giảng viên..."
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsSearchFocused(true);
            }}
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />

          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                setIsSearchFocused(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Autocomplete Dropdown List */}
        {isSearchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-12 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Gợi Ý Môn Học ({matchingCourses.length})</span>
              <span className="text-[10px] text-blue-600 font-normal">Nhấn chọn để xem chi tiết</span>
            </div>

            {matchingCourses.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Không tìm thấy môn học nào khớp với "<strong>{searchQuery}</strong>"
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {matchingCourses.map((course) => {
                  const isRegistered = registeredCourseIds.includes(course.id);
                  const isFull = course.enrolled >= course.capacity;

                  return (
                    <div
                      key={course.id}
                      onClick={() => handleSelectCourseSuggestion(course)}
                      className="p-3 hover:bg-blue-50/60 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 font-mono text-[10px] font-bold bg-blue-100 text-blue-800 rounded">
                            {course.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                            {course.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate flex items-center gap-2">
                          <span>{course.lecturer}</span>
                          <span>•</span>
                          <span>{course.faculty}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded">
                          {course.credits} TC
                        </span>
                        {isRegistered ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                            Đã đăng ký
                          </span>
                        ) : isFull ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">
                            Đã đầy
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full">
                            Còn chỗ
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => {
                setIsSearchFocused(false);
                onNavigate('courses');
              }}
              className="w-full p-3 bg-slate-50 hover:bg-blue-50 text-center text-xs font-bold text-blue-700 border-t border-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Xem tất cả kết quả trong danh sách học phần</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Right Area: Controls & Profile */}
      <div className="flex items-center gap-3">
        {/* Figma Design System Inspector Toggle */}
        <button
          onClick={onOpenDesignSystem}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          title="Xem Hệ thống Thiết kế Figma (Design System Tokens & Components)"
        >
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          <span>Figma System</span>
        </button>

        {/* Semester Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSemesterMenu(!showSemesterMenu)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs lg:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="max-w-[160px] lg:max-w-none truncate">{currentSemester}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showSemesterMenu && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowSemesterMenu(false)}
            >
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Chọn Học Kỳ
              </div>
              {SEMESTERS.map((sem) => (
                <button
                  key={sem}
                  onClick={() => {
                    onSelectSemester(sem);
                    setShowSemesterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                    sem === currentSemester ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{sem}</span>
                  {sem === currentSemester && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Thông báo"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowNotifications(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">Thông báo</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    onNavigate('notifications');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  Xem tất cả
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">Không có thông báo mới</div>
                ) : (
                  notifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        onNavigate('notifications');
                        setShowNotifications(false);
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                        !notif.isRead ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          !notif.isRead ? 'bg-blue-600' : 'bg-transparent'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-900 line-clamp-1">{notif.title}</p>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{notif.summary}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{notif.createdAt}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* Student Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group"
          >
            <UserAvatar
              src={student.avatarUrl}
              alt={student.name}
              size="sm"
              className="ring-2 ring-blue-600/20"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                {student.name}
              </span>
              <span className="text-[10px] text-slate-500">Mã SV: {student.id}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
          </button>

          {showProfileMenu && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">{student.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{student.email}</p>
                <div className="mt-2 inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded border border-blue-200">
                  {student.className} - {student.faculty}
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigate('profile');
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Hồ sơ cá nhân</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('registered');
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Môn học đã đăng ký</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                className="w-full px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
