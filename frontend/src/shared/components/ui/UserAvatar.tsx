import React, { useState } from 'react';

interface UserAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
  alt?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  className = '',
  size = 'md',
  src,
  alt = 'Avatar',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  }[size];

  const [imgError, setImgError] = useState(false);

  // If a valid src is provided (not an SVG data URI or empty) and hasn't errored
  if (src && !imgError && !src.startsWith('data:image/svg+xml')) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setImgError(true)}
        className={`${sizeClasses} rounded-full object-cover shadow-sm ${className}`}
      />
    );
  }

  const fallbackImg = '/assets/avatars/default-student-avatar.svg';

  return (
    <img
      src={fallbackImg}
      alt={alt}
      className={`${sizeClasses} rounded-full object-cover shadow-sm ${className}`}
    />
  );
};
