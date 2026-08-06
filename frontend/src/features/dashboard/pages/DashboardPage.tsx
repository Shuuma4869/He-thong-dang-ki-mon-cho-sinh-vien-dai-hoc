import React from 'react';
import {
  BookCheck,
  Award,
  CalendarCheck2,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  User,
  GraduationCap,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Course } from '@/features/courses/types/course.types';
import { UniversityNotification } from '@/features/notifications/types/notification.types';
import { Student } from '@/features/profile/types/profile.types';
import { NavigationTab } from '@/shared/types/navigation.types';

interface DashboardPageProps {
  student: Student;
  registeredCourses: Course[];
  notifications: UniversityNotification[];
  onNavigate: (tab: NavigationTab) => void;
  currentSemester: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  student,
  registeredCourses,
  notifications,
  onNavigate,
  currentSemester,
}) => {
  const totalCredits = registeredCourses.reduce((sum, c) => sum + c.credits, 0);
  const maxCredits = 24;
  const minCredits = 12;

  // Find today's classes (Assume today is Monday / Thứ 2 for realistic demo)
  const todaysClasses = registeredCourses.filter((course) =>
    course.schedules.some((s) => s.dayOfWeek === 2)
  );

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white shadow-md relative overflow-hidden">
        <img
          src="/assets/images/dashboard-banner.svg"
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20 pointer-events-none"
        />
        {/* Subtle decorative geometric overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-medium text-blue-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentSemester}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Xin chào, {student.name}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm font-medium opacity-90 max-w-2xl">
              Lớp <strong className="text-white">{student.className}</strong> • Ngành <strong className="text-white">{student.major}</strong> • {student.faculty}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('courses')}
              className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Đăng ký Môn học ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tín Chỉ Đã Đăng Ký</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <BookCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900">{totalCredits}</span>
              <span className="text-xs text-slate-500 font-medium">/ {maxCredits} Tín chỉ tối đa</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  totalCredits >= minCredits ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, (totalCredits / maxCredits) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
              <span>Số TC tối thiểu: {minCredits} TC</span>
              <span className={totalCredits >= minCredits ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                {totalCredits >= minCredits ? 'Đạt yêu cầu' : 'Chưa đạt'}
              </span>
            </p>
          </div>
        </div>

        {/* Card 2: Registered Courses Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Số Môn Đã Đăng Ký</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900">{registeredCourses.length}</span>
            <span className="text-xs text-slate-500 font-medium ml-1">học phần</span>
            <p className="text-[11px] text-slate-500 mt-2">
              Lớp học phần đã xác nhận trên hệ thống
            </p>
          </div>
        </div>

        {/* Card 3: Academic CPA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm CPA Tích Lũy</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{student.cpa}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Xếp loại: Giỏi
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Tích lũy: {student.creditsPassed}/{student.totalCreditsRequired} Tín chỉ
            </p>
          </div>
        </div>

        {/* Card 4: New Notifications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thông Báo Mới</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900">{unreadNotifs.length}</span>
            <span className="text-xs text-slate-500 font-medium ml-1">chưa đọc</span>
            <button
              onClick={() => onNavigate('notifications')}
              className="text-[11px] font-semibold text-blue-600 hover:underline mt-2 block cursor-pointer"
            >
              Xem tất cả thông báo →
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Section: Left 2/3 (Today's Schedule & Quick Actions) - Right 1/3 (Important Milestones & Student Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Classes Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Lịch Học Hôm Nay (Thứ Hai)</h2>
              </div>
              <button
                onClick={() => onNavigate('timetable')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Xem thời khóa biểu tuần →
              </button>
            </div>

            {todaysClasses.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">Hôm nay sinh viên không có lịch học. Hãy dùng thời gian ôn tập bài!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysClasses.map((course) => {
                  const schedule = course.schedules.find((s) => s.dayOfWeek === 2);
                  return (
                    <div
                      key={course.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded">
                            {course.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{course.name}</span>
                        </div>
                        <p className="text-xs text-slate-600 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.lecturer}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs shrink-0">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>{schedule?.periods}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{schedule?.room}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Thao Tác Nhanh</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigate('courses')}
                className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm text-slate-700 transition-all text-left space-y-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                  <BookCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Đăng ký Môn</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Tra cứu & đăng ký HP</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('timetable')}
                className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm text-slate-700 transition-all text-left space-y-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Thời khóa biểu</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Xem lịch theo tuần</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('registered')}
                className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm text-slate-700 transition-all text-left space-y-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Đã đăng ký</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Quản lý các môn học</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('profile')}
                className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm text-slate-700 transition-all text-left space-y-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Hồ sơ cá nhân</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Thông tin sinh viên</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col */}
        <div className="space-y-6">
          {/* Academic Milestone Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Mốc Thời Gian Đăng Ký</h2>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mở hệ thống đăng ký học phần</span>
                </div>
                <p className="text-[11px] text-emerald-700">08:00 - Ngày 05/08/2026</p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-800">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Hạn cuối điều chỉnh học phần</span>
                </div>
                <p className="text-[11px] text-blue-700">17:00 - Ngày 15/08/2026</p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Hạn hoàn thành nộp học phí</span>
                </div>
                <p className="text-[11px] text-amber-700">17:00 - Ngày 25/08/2026</p>
              </div>
            </div>
          </div>

          {/* Recent Announcements List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Thông Báo Từ Trường</h2>
              <button
                onClick={() => onNavigate('notifications')}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Tất cả
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-600 rounded">
                      {notif.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{notif.createdAt}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer">
                    {notif.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{notif.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
