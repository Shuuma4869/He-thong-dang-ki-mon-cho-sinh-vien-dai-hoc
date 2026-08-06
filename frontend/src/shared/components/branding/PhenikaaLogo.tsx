import React from 'react';

interface PhenikaaLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PhenikaaLogo: React.FC<PhenikaaLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8', text: 'text-sm', subText: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-base', subText: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', text: 'text-xl', subText: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl', subText: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className={`${sizeClasses.icon} shrink-0 flex items-center justify-center`}>
        <img
          src="/assets/logos/course-registration-logo.svg"
          alt="Logo hệ thống đăng ký môn học"
          className="w-full h-full"
        />
      </div>

      {variant !== 'icon' && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-black tracking-wider uppercase leading-none ${
              variant === 'light' ? 'text-white' : 'text-[#1C376D]'
            } ${sizeClasses.text}`}
            style={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 900,
              letterSpacing: '0.05em',
            }}
          >
            COURSE REG
          </span>
          <span
            className={`font-bold uppercase tracking-[0.25em] ${
              variant === 'light' ? 'text-blue-100' : 'text-[#1C376D]'
            } ${sizeClasses.subText} mt-0.5 opacity-90`}
            style={{
              fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
              fontWeight: 700,
            }}
          >
            Đại học Phenikaa
          </span>
        </div>
      )}
    </div>
  );
};
