import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => {
  let baseClass = 'animate-pulse bg-slate-200/80 rounded-md';

  if (variant === 'card') {
    baseClass = 'animate-pulse bg-slate-100 rounded-2xl border border-slate-200/60 p-5';
  } else if (variant === 'circle') {
    baseClass = 'animate-pulse bg-slate-200/80 rounded-full';
  }

  return <div className={`${baseClass} ${className}`} />;
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 animate-pulse shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 bg-slate-200 rounded w-1/3" />
          <div className="h-2.5 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-4/5" />
      </div>
    </div>
  );
};
