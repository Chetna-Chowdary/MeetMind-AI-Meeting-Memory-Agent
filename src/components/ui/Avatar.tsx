import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'offline' | 'busy';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  status
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses: Record<'sm' | 'md' | 'lg' | 'xl', { container: string; text: string; dot: string }> = {
    sm: { container: 'w-6 h-6 rounded-lg', text: 'text-[10px]', dot: 'w-1.5 h-1.5' },
    md: { container: 'w-8 h-8 rounded-xl', text: 'text-xs', dot: 'w-2 h-2' },
    lg: { container: 'w-11 h-11 rounded-2xl', text: 'text-sm font-bold', dot: 'w-2.5 h-2.5' },
    xl: { container: 'w-14 h-14 rounded-2xl', text: 'text-base font-bold', dot: 'w-3 h-3' }
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-block shrink-0 select-none ${className}`}>
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          onError={() => setHasError(true)}
          className={`${sizeClasses[size].container} object-cover border border-slate-200/90 shadow-2xs`}
        />
      ) : (
        <div
          className={`${sizeClasses[size].container} bg-indigo-50 border border-indigo-200/80 text-indigo-700 flex items-center justify-center font-semibold tracking-tight shadow-2xs`}
        >
          <span className={sizeClasses[size].text}>{getInitials(name)}</span>
        </div>
      )}

      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white ring-1 ring-slate-200/50 ${
            sizeClasses[size].dot
          } ${
            status === 'online' ? 'bg-emerald-500' : status === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
          }`}
        />
      )}
    </div>
  );
};
