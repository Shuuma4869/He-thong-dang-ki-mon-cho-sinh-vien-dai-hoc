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

  // Fallback to a high-quality realistic student portrait from Unsplash
  // This avoids cartoon/fake UI concept illustrations and feels like a real enterprise app.
  const fallbackImg = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256";

  return (
    <img
      src={fallbackImg}
      alt={alt}
      className={`${sizeClasses} rounded-full object-cover shadow-sm ${className}`}
    />
  );
};

