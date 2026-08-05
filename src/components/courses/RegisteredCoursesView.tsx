import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  MapPin,
  Trash2,
  AlertCircle,
  FileSpreadsheet,
  Info,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Course, NavigationTab } from '../../types';

interface RegisteredCoursesViewProps {
  registeredCourses: Course[];
  onCancelRegistration: (courseId: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  currentSemester: string;
}

export const RegisteredCoursesView: React.FC<RegisteredCoursesViewProps> = ({
  registeredCourses,
  onCancelRegistration,
  onNavigate,
  currentSemester,
}) => {
  const [selectedCourseToCancel, setSelectedCourseToCancel] = useState<Course | null>(null);

  const totalCredits = registeredCourses.reduce((sum, c) => sum + c.credits, 0);
  // Estimated tuition rate: ~520,000 VND / credit for Phenikaa University IT majors
  const estimatedTuition = totalCredits * 520000;

  const handleConfirmCancel = () => {
    if (selectedCourseToCancel) {
      onCancelRegistration(selectedCourseToCancel.id);
      setSelectedCourseToCancel(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Danh Sách Học Phần Đã Đăng Ký</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentSemester} • Quản lý danh sách các học phần đã được hệ thống ghi nhận thành công.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('timetable')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Xem Thời Khóa Biểu</span>
          </button>

          <button
            onClick={() => onNavigate('courses')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            + Đăng ký thêm môn
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-28">Mã Môn</th>
                <th className="py-3.5 px-4 min-w-[200px]">Tên Môn Học</th>
                <th className="py-3.5 px-4 w-32">Nhóm/Lớp HP</th>
                <th className="py-3.5 px-4 text-center w-20">Tín Chỉ</th>
                <th className="py-3.5 px-4 min-w-[160px]">Giảng Viên</th>
                <th className="py-3.5 px-4 min-w-[180px]">Lịch Học</th>
                <th className="py-3.5 px-4 w-32">Phòng Học</th>
                <th className="py-3.5 px-4 text-center w-32">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right w-28">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {registeredCourses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-3">
                      <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-800 text-sm">Chưa có môn học nào được đăng ký</p>
                      <p className="text-xs text-slate-500">
                        Hãy chuyển sang trang Đăng ký Môn học để chọn các học phần cho học kỳ này.
                      </p>
                      <button
                        onClick={() => onNavigate('courses')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        Đăng ký môn học ngay
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                registeredCourses.map((course) => {
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
                    <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-blue-700 font-mono">
                        {course.code}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-900">
                        {course.name}
                        <span className="text-[10px] text-slate-500 block font-normal mt-0.5">
                          {course.faculty}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-medium text-slate-700">
                        {course.classGroup}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-800 font-bold rounded border border-blue-100">
                          {course.credits} TC
                        </span>
                      </td>

                      <td className="py-4 px-4 font-medium text-slate-800">
                        {course.lecturer}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-semibold">
                            {daysMap[schedule?.dayOfWeek || 2]}:
                          </span>
                          <span>{schedule?.periods}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{schedule?.room}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Thành công</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedCourseToCancel(course)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Hủy đăng ký học phần này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hủy</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Statistics */}
        {registeredCourses.length > 0 && (
          <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium text-slate-700">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                Tổng số môn đã chọn: <strong className="text-slate-900 text-sm font-bold">{registeredCourses.length} học phần</strong>
              </div>
              <div>
                Tổng số tín chỉ: <strong className="text-blue-700 text-sm font-bold">{totalCredits} Tín chỉ</strong>
              </div>
            </div>

            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-right">
              <span className="text-[11px] text-slate-500">Học phí dự kiến học kỳ:</span>
              <p className="text-sm font-extrabold text-emerald-600">
                {estimatedTuition.toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {selectedCourseToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Xác Nhận Hủy Đăng Ký</h3>
                <p className="text-xs text-slate-500">Thao tác này sẽ xóa học phần khỏi danh sách của bạn</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{selectedCourseToCancel.name}</p>
              <p className="text-slate-600">Mã môn: <span className="font-mono text-blue-700">{selectedCourseToCancel.code}</span> • {selectedCourseToCancel.credits} Tín chỉ</p>
              <p className="text-slate-500">Giảng viên: {selectedCourseToCancel.lecturer}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn hủy đăng ký học phần này không? Bạn có thể đăng ký lại nếu lớp còn chỗ trống trước khi kết thúc thời hạn.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedCourseToCancel(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Giữ lại môn
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
