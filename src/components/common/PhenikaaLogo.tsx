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

  // Colors extracted from official Phenikaa University logo image
  const navyColor = variant === 'light' ? '#FFFFFF' : '#1C376D';
  const orangeColor = '#F25A24';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Phenikaa Official Swirl Emblem SVG */}
      <div className={`${sizeClasses.icon} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Top Orange Arch */}
          <path
            d="M 32 25 C 40 10, 60 10, 68 25 C 60 16, 40 16, 32 25 Z"
            fill={orangeColor}
          />

          {/* Left Navy Crescent (Outer bottom curve, tail at bottom right) */}
          <path
            d="M 30 27 C 10 45, 15 85, 50 85 C 60 85, 68 82, 75 75 C 68 70, 60 65, 55 58 C 45 75, 25 60, 30 27 Z"
            fill={navyColor}
          />

          {/* Right Navy Leaf (Top right curve, tail at top right) */}
          <path
            d="M 58 54 C 64 61, 72 66, 80 70 C 85 55, 82 35, 70 27 C 75 40, 70 50, 58 54 Z"
            fill={navyColor}
          />
        </svg>
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
            PHENIKAA
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
            UNIVERSITY
          </span>
        </div>
      )}
    </div>
  );
};
