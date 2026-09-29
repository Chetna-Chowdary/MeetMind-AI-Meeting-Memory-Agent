import React from 'react';

export type BadgeVariant = 'default' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = ''
}) => {
  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    default: {
      container: 'bg-slate-100 text-slate-700 border-slate-200/80',
      dot: 'bg-slate-400'
    },
    indigo: {
      container: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      dot: 'bg-indigo-500'
    },
    emerald: {
      container: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500'
    },
    amber: {
      container: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500'
    },
    rose: {
      container: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500'
    },
    slate: {
      container: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400'
    },
    outline: {
      container: 'bg-transparent text-slate-600 border-slate-200',
      dot: 'bg-slate-400'
    }
  };

  const sizeStyles = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5 font-medium' 
    : 'text-xs px-2.5 py-1 font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-mono tracking-tight select-none ${variantStyles[variant].container} ${sizeStyles} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${variantStyles[variant].dot}`} />
      )}
      <span>{children}</span>
    </span>
  );
};
