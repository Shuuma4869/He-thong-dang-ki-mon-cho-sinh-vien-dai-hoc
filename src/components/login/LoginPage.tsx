import React, { useState } from 'react';
import { Check, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { PhenikaaLogo } from '../common/PhenikaaLogo';

interface LoginPageProps {
  onLoginSuccess: (studentId: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [studentId, setStudentId] = useState('21010045');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!studentId.trim()) {
      setErrorMessage('Vui lòng nhập Mã sinh viên');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập Mật khẩu');
      return;
    }

    setIsLoading(true);

    // Simulate authentic authentication delay
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(studentId);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* LEFT PANEL - 55% */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-slate-900">
        {/* Architectural Campus Hero Background */}
        <img
          src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1920&q=80"
          alt="Phenikaa University Campus"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Soft dark gradient overlay around 25% */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-slate-900/30" />

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 lg:p-16 text-white">
          {/* Top Logo */}
          <div>
            <PhenikaaLogo variant="light" size="lg" />
          </div>

          {/* Center Headline & Subtitle */}
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-xs text-xs font-semibold text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Cổng Thông Tin Sinh Viên Chính Thức</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
              Hệ thống Đăng ký Môn học
            </h1>

            <p className="text-base text-slate-200 leading-relaxed font-normal opacity-90">
              Nền tảng hỗ trợ sinh viên đăng ký học phần nhanh chóng, chính xác và thuận tiện.
            </p>
          </div>

          {/* Bottom Features Bullet List */}
          <div className="pt-8 border-t border-white/15">
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                </div>
                <span className="text-sm font-medium text-slate-100">Đăng ký học phần</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                </div>
                <span className="text-sm font-medium text-slate-100">Quản lý thời khóa biểu</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                </div>
                <span className="text-sm font-medium text-slate-100">Theo dõi tiến độ học tập</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - 45% */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-[#F8FAFC]">
        {/* Mobile Header Logo */}
        <div className="lg:hidden mb-6">
          <PhenikaaLogo size="md" />
        </div>

        {/* Centered Login Card Container */}
        <div className="my-auto w-full max-w-md mx-auto">
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Header branding */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-3">
                <PhenikaaLogo size="lg" variant="icon" />
              </div>
              <p className="text-xs font-bold tracking-widest text-blue-600 uppercase">
                ĐẠI HỌC PHENIKAA
              </p>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Hệ thống Đăng ký Môn học
              </h2>
              <p className="text-xs text-slate-500">
                Đăng nhập bằng tài khoản sinh viên được cấp bởi Nhà trường
              </p>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Field 1: Mã sinh viên */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Mã sinh viên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Ví dụ: 21010045"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Field 2: Mật khẩu */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox & Forgot Link */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>

                <div className="flex flex-col items-end relative">
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForgotMsg(true);
                      setTimeout(() => setShowForgotMsg(false), 5000);
                    }}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </a>
                  {showForgotMsg && (
                    <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-10 animate-in fade-in slide-in-from-top-2">
                      Vui lòng liên hệ Phòng Đào tạo (Email: daotao@phenikaa-uni.edu.vn - Hotline: 024.6291.8118) để khôi phục mật khẩu.
                    </div>
                  )}
                </div>
              </div>

              {/* Primary Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng nhập</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Account Quick Hint for Demo evaluation */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <p className="text-[11px] text-slate-500">
                <strong className="text-slate-700 font-semibold">Tài khoản demo:</strong> Mã SV: <code className="text-blue-700 font-mono bg-blue-50 px-1 py-0.5 rounded">21010045</code> / Mật khẩu: bất kỳ
              </p>
            </div>

            {/* Version */}
            <div className="text-center pt-2">
              <span className="text-[11px] font-mono font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                Version v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>© Đại học Phenikaa. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  );
};
