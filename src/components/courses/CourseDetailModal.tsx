import React from 'react';
import {
  X,
  BookOpen,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Award,
} from 'lucide-react';
import { Course } from '../../types';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  isRegistered: boolean;
  onRequestRegister: (course: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  isRegistered,
  onRequestRegister,
}) => {
  if (!course) return null;

  const remaining = course.capacity - course.enrolled;
  const isFull = remaining <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {course.code}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{course.name}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Tín chỉ</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{course.credits} TC</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Sĩ số tối đa</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{course.capacity} sinh viên</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Đã đăng ký</span>
              <p className="text-lg font-bold text-blue-600 mt-0.5">{course.enrolled} SV</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Còn trống</span>
              <p className={`text-lg font-bold mt-0.5 ${isFull ? 'text-red-600' : 'text-emerald-600'}`}>
                {remaining} chỗ
              </p>
            </div>
          </div>

          {/* Lecturer & Faculty Info */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold">
              <User className="w-4 h-4 text-blue-600" />
              <span>Giảng viên Phụ trách:</span>
              <span className="text-blue-700">{course.lecturer}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Award className="w-4 h-4 text-slate-400" />
              <span>Khoa quản lý: <strong>{course.faculty}</strong></span>
              <span className="mx-1">•</span>
              <span>Lớp/Nhóm: <strong>{course.classGroup}</strong></span>
            </div>
          </div>

          {/* Schedule Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Thời Gian & Địa Điểm Học</span>
            </h3>

            <div className="space-y-2">
              {course.schedules.map((sched, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg">
                      Thứ {sched.dayOfWeek}
                    </span>
                    <span className="font-semibold text-slate-900">{sched.periods}</span>
                    <span className="text-xs text-slate-500">({sched.shift})</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{sched.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisite Course */}
          {course.prerequisite && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Môn học tiên quyết:</strong> {course.prerequisite}
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Sinh viên cần đạt học phần tiên quyết này trước khi đăng ký chính thức.
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {course.description && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Mô Tả Nội Dung Học Phần</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {course.description}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>

          {isRegistered ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-100 text-blue-800 rounded-xl border border-blue-200">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Đã đăng ký học phần này</span>
            </span>
          ) : (
            <button
              onClick={() => {
                onClose();
                onRequestRegister(course);
              }}
              disabled={isFull}
              className={`px-5 py-2.5 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer ${
                isFull
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
              }`}
            >
              {isFull ? 'Lớp đã đủ sĩ số' : 'Xác nhận Đăng ký Môn này'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
