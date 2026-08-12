import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Printer,
  RefreshCw,
  User,
} from 'lucide-react';
import { Course, ClassSchedule } from '@/features/courses/types/course.types';
import { timetableApi } from '@/features/timetable/api/timetableApi';
import { getApiErrorMessage } from '@/shared/api/apiError';

interface TimetableWeeklyPageProps {
  studentId: string;
  currentSemester: string;
}

interface TimetableCell {
  course: Course;
  courseIndex: number;
  schedule: ClassSchedule;
}

const DAYS_OF_WEEK = [
  { num: 2, label: 'Thu Hai', short: 'T2', isToday: true },
  { num: 3, label: 'Thu Ba', short: 'T3', isToday: false },
  { num: 4, label: 'Thu Tu', short: 'T4', isToday: false },
  { num: 5, label: 'Thu Nam', short: 'T5', isToday: false },
  { num: 6, label: 'Thu Sau', short: 'T6', isToday: false },
  { num: 7, label: 'Thu Bay', short: 'T7', isToday: false },
  { num: 8, label: 'Chu Nhat', short: 'CN', isToday: false },
];

const PERIODS = [
  { num: 1, time: '07:00 - 07:45' },
  { num: 2, time: '07:50 - 08:35' },
  { num: 3, time: '08:40 - 09:25' },
  { num: 4, time: '09:35 - 10:20' },
  { num: 5, time: '10:25 - 11:10' },
  { num: 6, time: '11:15 - 12:00' },
  { num: 7, time: '13:00 - 13:45' },
  { num: 8, time: '13:50 - 14:35' },
  { num: 9, time: '14:40 - 15:25' },
  { num: 10, time: '15:35 - 16:20' },
  { num: 11, time: '16:25 - 17:10' },
  { num: 12, time: '17:15 - 18:00' },
];

const COLOR_THEMES = [
  { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', badge: 'bg-blue-600 text-white' },
  { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-900', badge: 'bg-indigo-600 text-white' },
  { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-900', badge: 'bg-emerald-600 text-white' },
  { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900', badge: 'bg-amber-600 text-white' },
  { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-900', badge: 'bg-purple-600 text-white' },
  { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-900', badge: 'bg-sky-600 text-white' },
];

export const TimetableWeeklyPage: React.FC<TimetableWeeklyPageProps> = ({
  studentId,
  currentSemester,
}) => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [timetableCourses, setTimetableCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const weeks = useMemo(() => Array.from({ length: 20 }, (_, index) => index + 1), []);

  const loadTimetable = useCallback(async () => {
    if (!studentId) {
      setTimetableCourses([]);
      setErrorMessage('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const loadedCourses = await timetableApi.getTimetable(studentId);
setTimetableCourses(loadedCourses);
    } catch (error) {
      setTimetableCourses([]);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!studentId) {
        setTimetableCourses([]);
        setErrorMessage('');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const loadedCourses = await timetableApi.getTimetable(studentId);
        if (isMounted) {
          setTimetableCourses(loadedCourses);
        }
      } catch (error) {
        if (isMounted) {
          setTimetableCourses([]);
          setErrorMessage(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  const handlePrint = () => {
    window.print();
  };

  const findTimetableCell = (dayNumber: number, periodNumber: number): TimetableCell | null => {
    for (let courseIndex = 0; courseIndex < timetableCourses.length; courseIndex += 1) {
      const course = timetableCourses[courseIndex];
      const schedule = course.schedules.find(
        (item) => item.dayOfWeek === dayNumber && item.periodNumbers.includes(periodNumber)
      );

      if (schedule) {
        return { course, courseIndex, schedule };
      }
    }

    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Thời khóa biểu sinh viên</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentSemester} - lịch học theo tuần, lấy từ các môn đã đăng ký.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentWeek(Math.max(weeks[0], currentWeek - 1))}
              disabled={currentWeek === weeks[0]}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
              aria-label="Tuần trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800">
              Tuan {currentWeek < 10 ? `0${currentWeek}` : currentWeek} (05/08 - 11/08/2026)
            </span>
            <button
onClick={() => setCurrentWeek(Math.min(weeks[weeks.length - 1], currentWeek + 1))}
              disabled={currentWeek === weeks[weeks.length - 1]}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
              aria-label="Tuan sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={loadTimetable}
            disabled={isLoading}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60 no-print"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Tai lai</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer no-print"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>In / Xuat PDF</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-8 flex items-center justify-center gap-3 text-sm font-semibold text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          Đang tải thời khóa biểu...
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-2xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-red-700">Không tải được thời khóa biểu</h2>
              <p className="text-xs text-slate-600 mt-1">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={loadTimetable}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer no-print"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      )}

      {!isLoading && !errorMessage && timetableCourses.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
          <h2 className="text-sm font-bold text-slate-800">Chưa có lịch học</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sinh viên này chưa có môn đăng ký đang hiệu lực trong học kỳ hiện tại.
          </p>
        </div>
      )}

      {!isLoading && !errorMessage && (
<div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                  <th className="py-3 px-3 w-32 border-r border-slate-200 text-center uppercase tracking-wider text-[11px] text-slate-500">
                    Tiet / Gio
                  </th>
                  {DAYS_OF_WEEK.map((day) => (
                    <th
                      key={day.num}
                      className={`py-3 px-3 text-center border-r border-slate-200 last:border-r-0 ${
                        day.isToday ? 'bg-blue-50/80 text-blue-800' : 'text-slate-800'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-bold text-sm">{day.label}</span>
                        {day.isToday && (
                          <span className="mt-0.5 px-2 py-0.2 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                            Hom nay
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {PERIODS.map((period) => (
                  <tr key={period.num} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-2.5 px-3 border-r border-slate-200 bg-slate-50/50 text-center">
                      <span className="font-bold text-slate-900 block">Tiet {period.num}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{period.time}</span>
                    </td>

                    {DAYS_OF_WEEK.map((day) => {
                      const cell = findTimetableCell(day.num, period.num);

                      if (cell) {
                        const { course, courseIndex, schedule } = cell;
                        const isFirstPeriodOfBlock = schedule.periodNumbers[0] === period.num;
                        const blockLength = schedule.periodNumbers.length || 1;
                        const theme = COLOR_THEMES[courseIndex % COLOR_THEMES.length];

                        if (isFirstPeriodOfBlock) {
                          return (
                            <td
                              key={day.num}
                              rowSpan={blockLength}
                              className={`p-2 border-r border-slate-200 last:border-r-0 align-top ${day.isToday ? 'bg-blue-50/20' : ''}`}
                            >
                              <div
className={`h-full p-3 rounded-xl border ${theme.bg} ${theme.border} ${theme.text} shadow-xs flex flex-col justify-between space-y-2`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded ${theme.badge}`}>
                                      {course.code}
                                    </span>
                                    <span className="text-[10px] font-bold opacity-75">{course.credits} TC</span>
                                  </div>
                                  <h4 className="font-bold text-xs leading-snug line-clamp-2">{course.name}</h4>
                                </div>

                                <div className="space-y-1 text-[11px] opacity-90 border-t border-black/10 pt-1.5">
                                  <div className="flex items-center gap-1.5 font-bold">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                    <span>{schedule.room}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 font-medium truncate">
                                    <User className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                    <span className="truncate">{course.lecturer}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          );
                        }

                        return null;
                      }

                      return (
                        <td
                          key={day.num}
                          className={`p-2 border-r border-slate-200 last:border-r-0 text-center ${
                            day.isToday ? 'bg-blue-50/20' : ''
                          }`}
                        >
                          <span className="text-slate-200 font-light text-[10px] select-none">-</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
