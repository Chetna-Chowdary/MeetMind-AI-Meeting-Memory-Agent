import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Brain } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'memory';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (title: string, message?: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'success', duration: number = 4000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const newToast: Toast = { id, title, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Floating Toasts Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let icon = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
          let borderClass = 'border-slate-200/90 bg-white/95';

          if (toast.type === 'error') {
            icon = <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
            borderClass = 'border-rose-200 bg-white/95';
          } else if (toast.type === 'memory') {
            icon = <Brain className="w-4 h-4 text-indigo-600 shrink-0" />;
            borderClass = 'border-indigo-200/90 bg-white/95 shadow-indigo-500/10';
          } else if (toast.type === 'info') {
            icon = <Info className="w-4 h-4 text-sky-500 shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-xl border ${borderClass} shadow-lg backdrop-blur-md flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900 leading-tight">
                  {toast.title}
                </div>
                {toast.message && (
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {toast.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
