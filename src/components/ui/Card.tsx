import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs transition-all ${
        hoverable ? 'hover:border-slate-300 hover:shadow-xs cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5 truncate font-normal">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`px-5 py-3 sm:px-6 sm:py-3.5 bg-slate-50/70 border-t border-slate-100 rounded-b-2xl flex items-center justify-between text-xs ${className}`}>
      {children}
    </div>
  );
};
