import React, { useState } from 'react';
import {
  CalendarDays,
  Printer,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { Course } from '@/features/courses/types/course.types';

interface TimetableWeeklyPageProps {
  registeredCourses: Course[];
  currentSemester: string;
}

export const TimetableWeeklyPage: React.FC<TimetableWeeklyPageProps> = ({
  registeredCourses,
  currentSemester,
}) => {
  const [currentWeek, setCurrentWeek] = useState(1);

  // Generate 20 weeks option
  const weeks = Array.from({ length: 20 }, (_, i) => i + 1);

  const daysOfWeek = [
    { num: 2, label: 'Thứ Hai', short: 'T2', isToday: true },
    { num: 3, label: 'Thứ Ba', short: 'T3', isToday: false },
    { num: 4, label: 'Thứ Tư', short: 'T4', isToday: false },
    { num: 5, label: 'Thứ Năm', short: 'T5', isToday: false },
    { num: 6, label: 'Thứ Sáu', short: 'T6', isToday: false },
    { num: 7, label: 'Thứ Bảy', short: 'T7', isToday: false },
    { num: 8, label: 'Chủ Nhật', short: 'CN', isToday: false },
  ];

  const periods = [
    { num: 1, time: '07:00 - 07:45', shift: 'Sáng' },
    { num: 2, time: '07:50 - 08:35', shift: 'Sáng' },
    { num: 3, time: '08:40 - 09:25', shift: 'Sáng' },
    { num: 4, time: '09:35 - 10:20', shift: 'Sáng' },
    { num: 5, time: '10:25 - 11:10', shift: 'Sáng' },
    { num: 6, time: '11:15 - 12:00', shift: 'Sáng' },
    { num: 7, time: '13:00 - 13:45', shift: 'Chiều' },
    { num: 8, time: '13:50 - 14:35', shift: 'Chiều' },
    { num: 9, time: '14:40 - 15:25', shift: 'Chiều' },
    { num: 10, time: '15:35 - 16:20', shift: 'Chiều' },
    { num: 11, time: '16:25 - 17:10', shift: 'Chiều' },
    { num: 12, time: '17:15 - 18:00', shift: 'Chiều' },
  ];

  // Colors list for distinct clean subject blocks
  const colorThemes = [
    { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', badge: 'bg-blue-600 text-white' },
    { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-900', badge: 'bg-indigo-600 text-white' },
    { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-900', badge: 'bg-emerald-600 text-white' },
    { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900', badge: 'bg-amber-600 text-white' },
    { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-900', badge: 'bg-purple-600 text-white' },
    { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-900', badge: 'bg-sky-600 text-white' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Thời Khóa Biểu Sinh Viên</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentSemester} • Lịch học theo tuần chi tiết theo thời gian thực.
          </p>
        </div>

        {/* Controls: Week Selector & Export Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek === 1}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800">
              Tuần {currentWeek < 10 ? `0${currentWeek}` : currentWeek} (05/08 - 11/08/2026)
            </span>
            <button
              onClick={() => setCurrentWeek(Math.min(20, currentWeek + 1))}
              disabled={currentWeek === 20}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer no-print"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>In / Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* Timetable Weekly Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                <th className="py-3 px-3 w-32 border-r border-slate-200 text-center uppercase tracking-wider text-[11px] text-slate-500">
                  Tiết / Giờ
                </th>
                {daysOfWeek.map((day) => (
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
                          Hôm nay
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {periods.map((period) => {
                const isShiftStart = period.num === 1 || period.num === 7;

                return (
                  <tr key={period.num} className="hover:bg-slate-50/30 transition-colors">
                    {/* Period Column */}
                    <td className="py-2.5 px-3 border-r border-slate-200 bg-slate-50/50 text-center">
                      <span className="font-bold text-slate-900 block">Tiết {period.num}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{period.time}</span>
                    </td>

                    {/* Days Columns */}
                    {daysOfWeek.map((day) => {
                      // Find if any registered course takes place in this day and period
                      const matchingCourseIndex = registeredCourses.findIndex((c) =>
                        c.schedules.some((s) => s.dayOfWeek === day.num && s.periodNumbers.includes(period.num))
                      );

                      if (matchingCourseIndex !== -1) {
                        const course = registeredCourses[matchingCourseIndex];
                        const schedule = course.schedules.find((s) => s.dayOfWeek === day.num);
                        const isFirstPeriodOfBlock = schedule?.periodNumbers[0] === period.num;
                        const blockLength = schedule?.periodNumbers.length || 1;
                        const theme = colorThemes[matchingCourseIndex % colorThemes.length];

                        // Only render on the first period of the block using rowSpan
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
                                    <span>{schedule?.room}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 font-medium truncate">
                                    <User className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                    <span className="truncate">{course.lecturer}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          );
                        } else {
                          // Skip rendering cell because it's merged by rowSpan above
                          return null;
                        }
                      }

                      return (
                        <td
                          key={day.num}
                          className={`p-2 border-r border-slate-200 last:border-r-0 text-center ${
                            day.isToday ? 'bg-blue-50/20' : ''
                          }`}
                        >
                          <span className="text-slate-200 font-light text-[10px] select-none">—</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
