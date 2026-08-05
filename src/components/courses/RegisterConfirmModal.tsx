import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  BookOpen,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Course } from '../../types';

interface RegisterConfirmModalProps {
  course: Course | null;
  currentTotalCredits: number;
  registeredCourses: Course[];
  onClose: () => void;
  onConfirmSuccess: (course: Course) => void;
}

export const RegisterConfirmModal: React.FC<RegisterConfirmModalProps> = ({
  course,
  currentTotalCredits,
  registeredCourses,
  onClose,
  onConfirmSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!course) return null;

  const newTotalCredits = currentTotalCredits + course.credits;
  const maxLimit = 24;
  const isExceedLimit = newTotalCredits > maxLimit;

  // Schedule conflict check
  let conflictingCourseName = '';
  const hasConflict = registeredCourses.some((regCourse) => {
    return regCourse.schedules.some((regSched) => {
      return course.schedules.some((newSched) => {
        if (regSched.dayOfWeek === newSched.dayOfWeek) {
          const overlap = newSched.periodNumbers.some((p) => regSched.periodNumbers.includes(p));
          if (overlap) {
            conflictingCourseName = regCourse.name;
            return true;
          }
        }
        return false;
      });
    });
  });

  const isFull = course.enrolled >= course.capacity;

  const handleConfirm = () => {
    setErrorMessage(null);

    // Validate rules
    if (isFull) {
      setErrorMessage('Không thể đăng ký: Môn học đã đủ sĩ số tối đa!');
      return;
    }

    if (hasConflict) {
      setErrorMessage(
        `Không thể đăng ký: Lịch học bị trùng với môn "${conflictingCourseName}" đã đăng ký!`
      );
      return;
    }

    if (isExceedLimit) {
      setErrorMessage(
        `Không thể đăng ký: Tổng số tín chỉ sau khi đăng ký (${newTotalCredits} TC) vượt quá hạn mức tối đa (${maxLimit} TC)!`
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate network latency for academic server processing
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmSuccess(course);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Xác Nhận Đăng Ký Học Phần</h2>
              <p className="text-xs text-slate-500">Kiểm tra thông tin học phần trước khi lưu vào hệ thống</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Error Banner if any */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-900 animate-in shake duration-100">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-red-950 block">Đăng ký thất bại</strong>
                <p className="mt-0.5 text-red-800 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Schedule Conflict Warning */}
          {hasConflict && !errorMessage && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-950">Cảnh báo trùng lịch học</strong>
                <p className="mt-0.5 text-amber-800">
                  Lịch học của môn này bị trùng thời gian với môn <strong className="underline">{conflictingCourseName}</strong> trong thời khóa biểu của bạn.
                </p>
              </div>
            </div>
          )}

          {/* Exceed Credits Warning */}
          {isExceedLimit && !errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-900">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-red-950">Vượt quá tín chỉ cho phép</strong>
                <p className="mt-0.5 text-red-800">
                  Tổng số tín chỉ ({newTotalCredits} TC) sẽ vượt quá mức tối đa {maxLimit} TC cho học kỳ này.
                </p>
              </div>
            </div>
          )}

          {/* Course Summary Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {course.code}
              </span>
              <span className="text-xs font-bold text-slate-800 bg-slate-200/80 px-2.5 py-0.5 rounded">
                {course.credits} Tín chỉ
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{course.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Giảng viên: {course.lecturer}</p>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Thứ {course.schedules[0]?.dayOfWeek}: {course.schedules[0]?.periods}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {course.schedules[0]?.room}
              </span>
            </div>
          </div>

          {/* Credits Summary Bar */}
          <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 flex items-center justify-between text-xs font-medium text-slate-800">
            <span>Tín chỉ hiện tại: <strong>{currentTotalCredits} TC</strong></span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span>Sau đăng ký: <strong className={isExceedLimit ? 'text-red-600 font-bold' : 'text-blue-700 font-bold'}>{newTotalCredits} / {maxLimit} TC</strong></span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Hủy
          </button>

          <button
            onClick={handleConfirm}
            disabled={isSubmitting || isFull}
            className={`px-5 py-2.5 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              hasConflict || isExceedLimit || isFull
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
            } disabled:opacity-50`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác nhận đăng ký</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
