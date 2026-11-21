import { BellRing, CalendarCheck2, CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastVariant = 'booking' | 'accepted' | 'info';

export interface ToastNotification {
  id: string;
  variant: ToastVariant;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setTimeout(() => {
      onDismiss(toast.id);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [toast.id, onDismiss, isPaused]);

  const renderIcon = () => {
    if (toast.variant === 'accepted') {
      return (
        <div className="w-9 h-9 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-xs">
          <BellRing className="w-4 h-4" aria-hidden="true" />
        </div>
      );
    }

    if (toast.variant === 'booking') {
      return (
        <div className="w-9 h-9 rounded-xl bg-[#0F2547] text-[#2DD4BF] flex items-center justify-center shrink-0 shadow-xs">
          <CalendarCheck2 className="w-4 h-4" aria-hidden="true" />
        </div>
      );
    }

    return (
      <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E] flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
      </div>
    );
  };

  return (
    <div
      role="status"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`animate-toast-in pointer-events-auto bg-white/95 backdrop-blur-md border rounded-2xl p-3.5 sm:p-4 shadow-[0_14px_34px_-10px_rgba(15,37,71,0.22)] flex items-start gap-3 ${
        toast.variant === 'accepted'
          ? 'border-teal-200/90'
          : 'border-slate-200/90'
      }`}
    >
      {renderIcon()}

      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-bold text-[#0F172A] leading-snug">
          {toast.title}
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          {toast.message}
        </p>

        {toast.actionLabel && toast.onAction && (
          <button
            type="button"
            onClick={() => {
              toast.onAction?.();
              onDismiss(toast.id);
            }}
            className="mt-1 inline-flex items-center text-xs font-semibold text-[#0F766E] hover:text-[#0F2547] underline underline-offset-4 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
          >
            {toast.actionLabel}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="سكّر التنبيه"
        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="تنبيهات المنصة"
      className="pointer-events-none fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-5 sm:bottom-5 z-[60] sm:w-[380px] flex flex-col gap-2.5"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
