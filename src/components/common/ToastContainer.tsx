import React from 'react';
import { useAppStore } from '../../store';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />,
        }[toast.type];

        const borderColors = {
          success: 'border-emerald-200 dark:border-emerald-800/60',
          warning: 'border-amber-200 dark:border-amber-800/60',
          error: 'border-rose-200 dark:border-rose-800/60',
          info: 'border-sky-200 dark:border-sky-800/60',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#1E2621] border ${borderColors} shadow-lg shadow-black/5 animate-in slide-in-from-bottom-5 duration-200`}
            role="status"
          >
            {icons}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-[#68736C] dark:text-[#95A59A] mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#68736C] hover:text-[#1F2722] dark:hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
