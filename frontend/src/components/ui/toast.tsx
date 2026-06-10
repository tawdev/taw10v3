'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/store/toast-store';

export function ToastViewport() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[60] grid w-[min(420px,calc(100vw-2rem))] gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'rounded-lg border bg-white p-4 shadow-xl',
            toast.variant === 'success' && 'border-[#b7dfc1]',
            toast.variant === 'destructive' && 'border-[#f0b4ad]',
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-[#1f2a24]">{toast.title}</p>
              {toast.description ? <p className="mt-1 text-sm text-[#667085]">{toast.description}</p> : null}
            </div>
            <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss toast">
              <X className="h-4 w-4 text-[#667085]" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
