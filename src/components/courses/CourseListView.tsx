import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Info,
  Clock,
  MapPin,
  XCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { Course, CourseFilterState } from '../../types';
import { FACULTIES } from '../../data/mockData';

interface CourseListViewProps {
  courses: Course[];
  registeredCourseIds: string[];
  onOpenCourseDetail: (course: Course) => void;
  onRequestRegister: (course: Course) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CourseListView: React.FC<CourseListViewProps> = ({
  courses,
  registeredCourseIds,
  onOpenCourseDetail,
  onRequestRegister,
  searchQuery,
  onSearchChange,
}) => {
  const [filters, setFilters] = useState<CourseFilterState>({
    searchQuery: searchQuery,
    faculty: 'Tất cả Khoa',
    dayOfWeek: 'Tất cả các ngày',
    status: 'Tất cả trạng thái',
    minCredits: 'Tất cả tín chỉ',
  });

  // Sync external search query
  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, [searchQuery]);

  // Compute registered schedules to check schedule conflict dynamically
  const registeredCoursesList = useMemo(() => {
    return courses.filter((c) => registeredCourseIds.includes(c.id));
  }, [courses, registeredCourseIds]);

  const registeredScheduleSlots = useMemo(() => {
    const slots: { day: number; periods: number[] }[] = [];
    registeredCoursesList.forEach((c) => {
      c.schedules.forEach((s) => {
        slots.push({ day: s.dayOfWeek, periods: s.periodNumbers });
      });
    });
    return slots;
  }, [registeredCoursesList]);

  // Check if a course conflicts in schedule
  const checkHasScheduleConflict = (course: Course): boolean => {
    if (registeredCourseIds.includes(course.id)) return false;

    for (const schedule of course.schedules) {
      for (const slot of registeredScheduleSlots) {
        if (slot.day === schedule.dayOfWeek) {
          const hasOverlap = schedule.periodNumbers.some((p) => slot.periods.includes(p));
          if (hasOverlap) return true;
        }
      }
    }
    return false;
  };

  // Filtered course list
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search text filter
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchCode = course.code.toLowerCase().includes(q);
        const matchName = course.name.toLowerCase().includes(q);
        const matchLecturer = course.lecturer.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchLecturer) return false;
      }

      // Faculty filter
      if (filters.faculty !== 'Tất cả Khoa' && course.faculty !== filters.faculty) {
        return false;
      }

      // Day filter
      if (filters.dayOfWeek !== 'Tất cả các ngày') {
        const dayNum = parseInt(filters.dayOfWeek.replace('Thứ ', ''));
        const matchesDay = course.schedules.some((s) => s.dayOfWeek === dayNum);
        if (!matchesDay) return false;
      }

      // Status filter
      const isRegistered = registeredCourseIds.includes(course.id);
      const isFull = course.enrolled >= course.capacity;
      const isConflict = checkHasScheduleConflict(course);

      if (filters.status === 'Còn chỗ' && (isFull || isRegistered || isConflict)) return false;
      if (filters.status === 'Đã đầy' && !isFull) return false;
      if (filters.status === 'Đã đăng ký' && !isRegistered) return false;
      if (filters.status === 'Trùng lịch' && !isConflict) return false;

      // Min credits filter
      if (filters.minCredits !== 'Tất cả tín chỉ') {
        const creds = parseInt(filters.minCredits.replace(' TC', ''));
        if (course.credits !== creds) return false;
      }

      return true;
    });
  }, [courses, filters, registeredCourseIds, registeredScheduleSlots]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      faculty: 'Tất cả Khoa',
      dayOfWeek: 'Tất cả các ngày',
      status: 'Tất cả trạng thái',
      minCredits: 'Tất cả tín chỉ',
    });
    onSearchChange('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Danh Sách Học Phần Mở Đăng Ký</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu học phần, xem số chỗ trống, lịch học và thực hiện đăng ký môn học trực tuyến.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs font-semibold">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            Hiển thị: <strong>{filteredCourses.length}</strong> / {courses.length} môn học
          </span>
        </div>
      </div>

      {/* Advanced Search & Multi-field Filter Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Bộ Lọc Nâng Cao</span>
          </div>

          {(filters.searchQuery ||
            filters.faculty !== 'Tất cả Khoa' ||
            filters.dayOfWeek !== 'Tất cả các ngày' ||
            filters.status !== 'Tất cả trạng thái' ||
            filters.minCredits !== 'Tất cả tín chỉ') && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Field */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Mã/Tên môn/Giảng viên..."
                value={filters.searchQuery}
                onChange={(e) => {
                  setFilters({ ...filters, searchQuery: e.target.value });
                  onSearchChange(e.target.value);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Faculty Select */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">Khoa / Viện</label>
            <select
              value={filters.faculty}
              onChange={(e) => setFilters({ ...filters, faculty: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
            >
              {FACULTIES.map((fac) => (
                <option key={fac} value={fac}>
                  {fac}
                </option>
              ))}
            </select>
          </div>

          {/* Day of Week Filter */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">Ngày học</label>
            <select
              value={filters.dayOfWeek}
              onChange={(e) => setFilters({ ...filters, dayOfWeek: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
            >
              <option value="Tất cả các ngày">Tất cả các ngày</option>
              <option value="Thứ 2">Thứ 2</option>
              <option value="Thứ 3">Thứ 3</option>
              <option value="Thứ 4">Thứ 4</option>
              <option value="Thứ 5">Thứ 5</option>
              <option value="Thứ 6">Thứ 6</option>
              <option value="Thứ 7">Thứ 7</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">Trạng thái đăng ký</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
            >
              <option value="Tất cả trạng thái">Tất cả trạng thái</option>
              <option value="Còn chỗ">Còn chỗ</option>
              <option value="Đã đầy">Đã đầy</option>
              <option value="Đã đăng ký">Đã đăng ký</option>
              <option value="Trùng lịch">Trùng lịch</option>
            </select>
          </div>

          {/* Credits Filter */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">Số tín chỉ</label>
            <select
              value={filters.minCredits}
              onChange={(e) => setFilters({ ...filters, minCredits: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
            >
              <option value="Tất cả tín chỉ">Tất cả tín chỉ</option>
              <option value="2 TC">2 Tín chỉ</option>
              <option value="3 TC">3 Tín chỉ</option>
              <option value="4 TC">4 Tín chỉ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-28">Mã Môn</th>
                <th className="py-3.5 px-4 min-w-[200px]">Tên Môn Học</th>
                <th className="py-3.5 px-4 min-w-[160px]">Giảng Viên</th>
                <th className="py-3.5 px-4 text-center w-20">Tín Chỉ</th>
                <th className="py-3.5 px-4 min-w-[180px]">Lịch Học</th>
                <th className="py-3.5 px-4 w-32">Phòng Học</th>
                <th className="py-3.5 px-4 w-28">Sĩ Số</th>
                <th className="py-3.5 px-4 w-32 text-center">Trạng Thái</th>
                <th className="py-3.5 px-4 w-36 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Search className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-700 text-sm">Không tìm thấy môn học phù hợp</p>
                      <p className="text-xs text-slate-500">
                        Vui lòng kiểm tra lại từ khóa hoặc thử lại với bộ lọc khác.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        Đặt lại tìm kiếm
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => {
                  const isRegistered = registeredCourseIds.includes(course.id);
                  const isFull = course.enrolled >= course.capacity;
                  const hasConflict = checkHasScheduleConflict(course);
                  const schedule = course.schedules[0];

                  const daysMap: Record<number, string> = {
                    2: 'Thứ 2',
                    3: 'Thứ 3',
                    4: 'Thứ 4',
                    5: 'Thứ 5',
                    6: 'Thứ 6',
                    7: 'Thứ 7',
                  };

                  return (
                    <tr
                      key={course.id}
                      className={`hover:bg-blue-50/30 transition-colors ${
                        isRegistered ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      {/* Mã môn */}
                      <td className="py-4 px-4 font-bold text-blue-700 font-mono">
                        {course.code}
                      </td>

                      {/* Tên môn */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => onOpenCourseDetail(course)}
                          className="font-bold text-slate-900 hover:text-blue-600 text-left transition-colors cursor-pointer block"
                        >
                          {course.name}
                        </button>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {course.classGroup} • {course.faculty}
                        </span>
                      </td>

                      {/* Giảng viên */}
                      <td className="py-4 px-4 font-medium text-slate-800">
                        {course.lecturer}
                      </td>

                      {/* Tín chỉ */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded">
                          {course.credits} TC
                        </span>
                      </td>

                      {/* Lịch học */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-semibold">
                            {daysMap[schedule?.dayOfWeek || 2]}:
                          </span>
                          <span>{schedule?.periods}</span>
                        </div>
                      </td>

                      {/* Phòng */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{schedule?.room}</span>
                        </div>
                      </td>

                      {/* Sĩ số */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span
                            className={`font-bold ${
                              isFull ? 'text-red-600' : 'text-slate-900'
                            }`}
                          >
                            {course.enrolled} / {course.capacity}
                          </span>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isFull ? 'bg-red-500' : 'bg-blue-600'
                              }`}
                              style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Trạng thái Badge */}
                      <td className="py-4 px-4 text-center">
                        {isRegistered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Đã đăng ký</span>
                          </span>
                        ) : isFull ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-red-100 text-red-800 rounded-full border border-red-200">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Lớp đã đầy</span>
                          </span>
                        ) : hasConflict ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Trùng lịch</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Còn chỗ</span>
                          </span>
                        )}
                      </td>

                      {/* Thao tác Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenCourseDetail(course)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết môn học"
                          >
                            <Info className="w-4 h-4" />
                          </button>

                          {isRegistered ? (
                            <button
                              disabled
                              className="px-3 py-1.5 bg-slate-100 text-slate-400 font-semibold rounded-lg text-xs cursor-not-allowed border border-slate-200"
                            >
                              Đã ký
                            </button>
                          ) : (
                            <button
                              onClick={() => onRequestRegister(course)}
                              disabled={isFull}
                              className={`px-3.5 py-1.5 font-bold rounded-lg text-xs transition-all shadow-xs cursor-pointer ${
                                isFull
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                  : hasConflict
                                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                              }`}
                            >
                              {hasConflict ? 'Xem trùng' : 'Đăng ký'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
