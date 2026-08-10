import React, { useState } from 'react';
import {
  UserCircle,
  Mail,
  Phone,
  GraduationCap,
  Award,
  Lock,
  CheckCircle2,
  Calendar,
  Shield,
  Building2,
  FileCheck,
} from 'lucide-react';
import { Student } from '@/features/profile/types/profile.types';
import { UserAvatar } from '@/shared/components/ui/UserAvatar';

interface ProfilePageProps {
  student: Student;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ student }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const missingText = 'Chưa đồng bộ';
  const displayText = (value?: string) => (value?.trim() ? value : missingText);
  const cpaText = typeof student.cpa === 'number' ? student.cpa.toFixed(2) : missingText;
  const creditsProgressText =
    typeof student.creditsPassed === 'number' && typeof student.totalCreditsRequired === 'number'
      ? `${student.creditsPassed} / ${student.totalCreditsRequired}`
      : missingText;
  const creditsPercentText =
    typeof student.creditsPassed === 'number'
    && typeof student.totalCreditsRequired === 'number'
    && student.totalCreditsRequired > 0
      ? `Dat ${Math.round((student.creditsPassed / student.totalCreditsRequired) * 100)}% chuong trinh`
      : 'Chưa có dữ liệu tiến độ học tập';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!oldPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu mới không trùng khớp!');
      return;
    }

    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Hồ Sơ Sinh Viên</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu thông tin cá nhân, thông tin học tập và quản lý tài khoản Phenikaa Portal.
          </p>
        </div>

        <button
          onClick={() => setShowPasswordModal(true)}
className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Lock className="w-4 h-4" />
          <span>Đổi mật khẩu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: ID Card Badge */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 text-center">
          <div className="relative inline-block mx-auto">
            <UserAvatar
              src={student.avatarUrl}
              alt={student.name}
              size="xl"
              className="ring-4 ring-blue-600/20 shadow-md mx-auto"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 ring-2 ring-white rounded-full flex items-center justify-center text-white" title="Đang hoạt động">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{student.name}</h2>
            <p className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block mt-1">
              Mã SV: {student.id}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2 text-left">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Lớp sinh hoạt:</span>
              <strong className="text-slate-800">{student.className}</strong>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Niên khóa:</span>
              <strong className="text-slate-800">{displayText(student.cohort)}</strong>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Hệ đào tạo:</span>
              <strong className="text-slate-800">Chính quy</strong>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Trạng thái:</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Đang học
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Detail Information Cards & Academic Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal & Academic Specs Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
<h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Thông Tin Chi Tiết Học Tập</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Khoa phụ trách</span>
                <p className="font-bold text-slate-900">{displayText(student.faculty)}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Chuyên ngành</span>
                <p className="font-bold text-slate-900">{student.major}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Email sinh viên</span>
                <p className="font-bold text-blue-700 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {displayText(student.email)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Số điện thoại</span>
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {displayText(student.phone)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Ngày sinh</span>
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {displayText(student.dob)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Giới tính</span>
                <p className="font-bold text-slate-900">{displayText(student.gender)}</p>
              </div>
            </div>
          </div>

          {/* Academic Metrics Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Tiến Độ Tích Lũy Đào Tạo</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
<div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-1">
                <span className="text-[11px] font-bold uppercase text-blue-700">Gioi Han Tin Chi</span>
                <p className="text-2xl font-extrabold text-blue-900">{student.maxCredits}</p>
                <span className="text-[10px] text-blue-600 font-semibold block">Tín chỉ tối đa mỗi học kỳ</span>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-1">
                <span className="text-[11px] font-bold uppercase text-indigo-700">CPA Tich Luy</span>
                <p className="text-2xl font-extrabold text-indigo-900">{cpaText}</p>
                <span className="text-[10px] text-indigo-600 font-semibold block">Chưa có dữ liệu điểm tích lũy</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                <span className="text-[11px] font-bold uppercase text-emerald-700">Tín Chỉ Đã Đạt</span>
                <p className="text-2xl font-extrabold text-emerald-900">
                  {creditsProgressText}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold block">{creditsPercentText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-3">
              <Lock className="w-5 h-5 text-blue-600" />
              <h3 className="text-base">Đổi Mật Khẩu Tài Khoản</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              {passwordError && (
                <div className="p-2.5 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-semibold text-center mb-2">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center gap-2 mb-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Thành công!
                </div>
              )}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập ít nhất 8 ký tự"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};