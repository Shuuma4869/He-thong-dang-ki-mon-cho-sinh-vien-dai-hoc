import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  TrendingUp,
  User,
} from 'lucide-react';
import { PhenikaaLogo } from '@/shared/components/branding/PhenikaaLogo';
import { authApi } from '@/features/auth/api/authApi';
import { Student } from '@/features/profile/types/profile.types';
import { getApiErrorMessage } from '@/shared/api/apiError';

interface LoginPageProps {
  onLoginSuccess: (student: Student, rememberMe: boolean) => void;
}

const featureCards = [
  {
    title: 'Đăng ký học phần',
    subtitle: 'Dễ dàng và nhanh chóng',
    icon: BookOpenCheck,
  },
  {
    title: 'Quản lý thời khóa biểu',
    subtitle: 'Xem và sắp xếp lịch học',
    icon: CalendarDays,
  },
  {
    title: 'Theo dõi tiến độ học tập',
    subtitle: 'Nắm bắt kết quả học tập',
    icon: TrendingUp,
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [studentId, setStudentId] = useState('23010690');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const normalizedStudentId = studentId.trim();

    if (!normalizedStudentId) {
      setErrorMessage('Vui lòng nhập Mã sinh viên');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập Mật khẩu');
      return;
    }

    setIsLoading(true);

    try {
      const student = await authApi.login({
        studentId: normalizedStudentId,
        password,
      });

      onLoginSuccess(student, rememberMe);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#F6FAFF] lg:grid lg:grid-cols-[52%_48%]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#061C63] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(37,99,235,0.72),transparent_34%),radial-gradient(circle_at_68%_8%,rgba(30,64,175,0.56),transparent_28%),linear-gradient(160deg,#061342_0%,#052A87_54%,#1F6FD7_100%)]" />
        <div className="absolute left-[-84px] top-[50%] h-52 w-52 rounded-full bg-blue-400/18" />
        <div className="absolute right-16 top-16 h-36 w-36 rounded-full border border-blue-200/20" />
        <div className="absolute right-28 top-8 h-5 w-5 rounded-full border border-blue-100/45" />
        <div
          className="absolute right-24 top-20 h-20 w-28 opacity-55"
          style={{
backgroundImage: 'radial-gradient(circle, rgba(219,234,254,0.78) 1.6px, transparent 1.8px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="absolute right-16 top-[34%] h-28 w-28 opacity-70"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(219,234,254,0.75) 1.8px, transparent 2px)',
            backgroundSize: '22px 22px',
          }}
        />

        <div className="relative z-10 flex h-full flex-col">
          <PhenikaaLogo variant="light" size="xl" />

          <div className="mt-20 max-w-xl xl:mt-24">
            <div className="inline-flex items-center gap-2 rounded-xl border border-blue-300/30 bg-blue-500/80 px-4 py-2 text-sm font-bold text-blue-50 shadow-lg shadow-blue-950/20">
              <ShieldCheck className="h-4 w-4" />
              <span>Cổng Thông Tin Sinh Viên Chính Thức</span>
            </div>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.12] text-white xl:text-6xl">
              Hệ thống Đăng ký Môn học
            </h1>

            <p className="mt-5 max-w-lg text-xl leading-8 text-blue-50/95">
              Nền tảng hỗ trợ sinh viên đăng ký học phần nhanh chóng, chính xác và thuận tiện.
            </p>
          </div>

          <div className="relative mt-auto min-h-[335px]">
            <img
              src="/assets/images/login-workspace-illustration.svg"
              alt="Minh họa bàn học với laptop đăng ký môn học"
              className="absolute bottom-[-28px] left-[-62px] w-[calc(100%+118px)] max-w-none xl:bottom-[-18px]"
            />

            <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/40 bg-white/95 p-4 text-slate-900 shadow-2xl shadow-blue-950/25 backdrop-blur">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`flex min-w-0 flex-col items-center gap-2 px-4 py-2 text-center ${
                      index > 0 ? 'border-l border-slate-200' : ''
                    }`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900">{feature.title}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">{feature.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
<section className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#F8FBFF] px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
        <div className="absolute right-[-86px] top-[-86px] h-56 w-56 rounded-full bg-blue-100/80" />
        <div className="absolute right-[-22px] top-[-30px] h-28 w-28 rounded-full bg-white/80" />
        <div className="absolute bottom-[-92px] right-[-62px] h-48 w-48 rounded-full bg-blue-100/70" />
        <div
          className="absolute bottom-24 right-16 hidden h-24 w-24 opacity-50 sm:block"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.42) 1.8px, transparent 2px)',
            backgroundSize: '22px 22px',
          }}
        />

        <div className="relative z-10 mb-6 lg:hidden">
          <PhenikaaLogo size="lg" />
        </div>

        <div className="relative z-10 my-auto mx-auto w-full max-w-[540px]">
          <div className="rounded-[28px] border border-white bg-white/95 px-6 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:px-10 sm:py-11 xl:px-12">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 shadow-sm">
                <PhenikaaLogo size="xl" variant="icon" />
              </div>
              <p className="mt-5 text-sm font-extrabold uppercase text-blue-600">
                Đại học Phenikaa
              </p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-950">
                Hệ thống Đăng ký Môn học
              </h2>
              <p className="mt-3 text-sm font-medium text-slate-500">
                Đăng nhập bằng tài khoản sinh viên được cấp bởi Nhà trường
              </p>
            </div>

            {errorMessage && (
              <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-9 space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">
                  Mã sinh viên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Ví dụ: 23010690"
                    required
                    className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-4 text-base font-semibold text-slate-900 shadow-inner shadow-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
</div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                    className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-14 text-base font-semibold text-slate-900 shadow-inner shadow-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex cursor-pointer select-none items-center gap-2 font-bold text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>

                <div className="relative flex flex-col items-end">
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForgotMsg(true);
                      setTimeout(() => setShowForgotMsg(false), 5000);
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                  {showForgotMsg && (
                    <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-xl bg-slate-900 p-3 text-xs text-white shadow-xl animate-in fade-in slide-in-from-top-2">
                      Vui lòng liên hệ Phòng Đào tạo (Email: daotao@phenikaa-uni.edu.vn - Hotline: 024.6291.8118) để khôi phục mật khẩu.
                    </div>
)}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 text-base font-extrabold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng nhập</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-center">
              <p className="text-sm text-slate-500">
                <strong className="font-extrabold text-slate-800">Tài khoản demo:</strong> Mã SV:{' '}
                <code className="rounded bg-blue-50 px-1.5 py-0.5 font-mono font-bold text-blue-700">23010690</code>
                {' '}/ Mật khẩu: bất kỳ
              </p>
            </div>

            <div className="pt-8 text-center">
              <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 font-mono text-xs font-bold text-slate-400">
                Version v1.0
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <p>© Đại học Phenikaa. Tất cả quyền được bảo lưu.</p>
        </div>
      </section>
    </div>
  );
};
