import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BookCheck,
  CalendarCheck2,
  Clock,
  GraduationCap,
  Loader2,
  MapPin,
  RefreshCw,
  Sparkles,
  User,
} from 'lucide-react';
import { Course, ClassSchedule } from '@/features/courses/types/course.types';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { UniversityNotification } from '@/features/notifications/types/notification.types';
import { Student } from '@/features/profile/types/profile.types';
import { NavigationTab } from '@/shared/types/navigation.types';

interface DashboardPageProps {
  student: Student;
  registeredCourses: Course[];
  totalCredits: number;
  isRegistrationLoading: boolean;
  registrationErrorMessage: string;
  onRefreshRegistrations: () => Promise<void>;
  notifications: UniversityNotification[];
  onNavigate: (tab: NavigationTab) => void;
  currentSemester: string;
}

interface SchedulePreview {
  course: Course;
  schedule: ClassSchedule;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  student,
  registeredCourses,
  totalCredits,
  isRegistrationLoading,
  registrationErrorMessage,
  onRefreshRegistrations,
  notifications,
  onNavigate,
  currentSemester,
}) => {
  const {
    openCourses,
    timetableCourses,
    isLoading: isDashboardLoading,
    errorMessage: dashboardErrorMessage,
    refresh: refreshDashboardData,
  } = useDashboardData(student.id);

  const maxCredits = student.maxCredits;
  const creditPercent = getCreditPercent(totalCredits, maxCredits);
  const unreadNotifs = notifications.filter((notification) => !notification.isRead);
  const schedulePreview = getSchedulePreview(timetableCourses);
  const isLoading = isDashboardLoading || isRegistrationLoading;
  const errorMessage = dashboardErrorMessage || registrationErrorMessage;

  const handleRetry = async () => {
    await Promise.all([
      refreshDashboardData(),
      onRefreshRegistrations().catch(() => undefined),
    ]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white shadow-md relative overflow-hidden">
        <img
          src="/assets/images/dashboard-banner.svg"
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20 pointer-events-none"
        />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />

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
              Lớp <strong className="text-white">{student.className}</strong> - Ngành{' '}
              <strong className="text-white">{student.major}</strong>
            </p>
          </div>

          <button
            onClick={() => onNavigate('courses')}
            className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Đăng ký môn học</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-8 flex items-center justify-center gap-3 text-sm font-semibold text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          Đang tải dữ liệu tổng quan...
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-2xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-red-700">Không tải được dữ liệu tổng quan</h2>
              <p className="text-xs text-slate-600 mt-1">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      )}

      {!isLoading && !errorMessage && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Tín chỉ đã đăng ký"
              icon={<BookCheck className="w-5 h-5" />}
              tone="blue"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900">{totalCredits}</span>
                <span className="text-xs text-slate-500 font-medium">/ {maxCredits} tin chi toi da</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${creditPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Dựa trên đăng ký hiện tại và hồ sơ sinh viên.</p>
            </MetricCard>

            <MetricCard
              label="Số môn đã đăng ký"
              icon={<CalendarCheck2 className="w-5 h-5" />}
              tone="emerald"
            >
              <span className="text-2xl font-bold text-slate-900">{registeredCourses.length}</span>
              <span className="text-xs text-slate-500 font-medium ml-1">học phần</span>
              <p className="text-[11px] text-slate-500 mt-2">Danh sách học phần sinh viên đang đăng ký.</p>
            </MetricCard>

            <MetricCard
              label="Môn đang mở"
              icon={<GraduationCap className="w-5 h-5" />}
              tone="indigo"
            >
              <span className="text-2xl font-bold text-slate-900">{openCourses.length}</span>
              <span className="text-xs text-slate-500 font-medium ml-1">học phần</span>
              <p className="text-[11px] text-slate-500 mt-2">Số học phần đang mở trong dữ liệu hiện tại.</p>
            </MetricCard>

            <MetricCard
              label="Thông báo"
              icon={<Bell className="w-5 h-5" />}
              tone="amber"
            >
              <span className="text-2xl font-bold text-slate-900">{unreadNotifs.length}</span>
              <span className="text-xs text-slate-500 font-medium ml-1">chưa đọc</span>
              <button
                onClick={() => onNavigate('notifications')}
                className="text-[11px] font-semibold text-blue-600 hover:underline mt-2 block cursor-pointer"
              >
                Xem thông báo
              </button>
            </MetricCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <h2 className="text-base font-bold text-slate-900">Lich hoc cua ban</h2>
                  </div>
                  <button
                    onClick={() => onNavigate('timetable')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Xem thời khóa biểu
                  </button>
                </div>

                {schedulePreview.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500">
                      Bạn chưa có lịch học từ các môn đăng ký đang hiệu lực.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {schedulePreview.map(({ course, schedule }) => (
                      <div
                        key={`${course.id}-${schedule.dayOfWeek}-${schedule.startTime ?? schedule.periods}`}
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

                        <div className="flex flex-wrap items-center gap-3 text-xs shrink-0">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>{schedule.dayLabel ?? `Thu ${schedule.dayOfWeek}`}, {schedule.periods}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{schedule.room}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900">Thao tác nhanh</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <QuickAction label="Đăng ký môn" description="Tra cứu học phần" icon={<BookCheck className="w-4 h-4" />} onClick={() => onNavigate('courses')} />
                  <QuickAction label="Thời khóa biểu" description="Xem lịch tuần" icon={<CalendarCheck2 className="w-4 h-4" />} onClick={() => onNavigate('timetable')} />
                  <QuickAction label="Đã đăng ký" description="Quản lý học phần" icon={<GraduationCap className="w-4 h-4" />} onClick={() => onNavigate('registered')} />
                  <QuickAction label="Hồ sơ" description="Thông tin sinh viên" icon={<User className="w-4 h-4" />} onClick={() => onNavigate('profile')} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h2 className="text-base font-bold text-slate-900">Tổng quan đăng ký</h2>
                {registeredCourses.length === 0 ? (
                  <div className="p-5 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500">Bạn chưa đăng ký môn học nào.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {registeredCourses.slice(0, 4).map((course) => (
                      <div key={course.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{course.code}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{course.name}</p>
                        </div>
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                          {course.credits} TC
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Thông báo</h2>
                    <p className="text-[11px] text-slate-500 mt-1">Thông báo chỉ lưu trong phiên giao diện.</p>
                  </div>
                  <button
                    onClick={() => onNavigate('notifications')}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Tat ca
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-600 rounded">
                          {notification.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{notification.createdAt}</span>
                      </div>
                      <h3 className="text-xs font-semibold text-slate-900 line-clamp-1">
                        {notification.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{notification.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function MetricCard({
  label,
  icon,
  tone,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  tone: 'blue' | 'emerald' | 'indigo' | 'amber';
  children: React.ReactNode;
}) {
  const toneClasses = {
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-600',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${toneClasses[tone]}`}>
          {icon}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function QuickAction({
  label,
  description,
  icon,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm text-slate-700 transition-all text-left space-y-3 cursor-pointer group"
    >
      <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{label}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>
      </div>
    </button>
  );
}

function getCreditPercent(totalCredits: number, maxCredits: number): number {
  if (maxCredits <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, (totalCredits / maxCredits) * 100));
}

function getSchedulePreview(courses: Course[]): SchedulePreview[] {
  return courses
    .flatMap((course) => course.schedules.map((schedule) => ({ course, schedule })))
    .sort((left, right) => {
      if (left.schedule.dayOfWeek !== right.schedule.dayOfWeek) {
        return left.schedule.dayOfWeek - right.schedule.dayOfWeek;
      }

      return (left.schedule.startTime ?? '').localeCompare(right.schedule.startTime ?? '');
    })
    .slice(0, 4);
}
