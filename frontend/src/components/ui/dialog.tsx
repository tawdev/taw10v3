'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

type DialogProps = {
  open: boolean;
  title: ReactNode | string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
};

export function Dialog({ open, title, children, onClose, className }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm px-4 transition-all duration-300">
      <div className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-[#e2dbcf] bg-white shadow-2xl transition-all scale-100 ${className || 'max-w-2xl'}`}>
        <div className="flex items-center justify-between border-b border-[#eee8dd] px-6 py-5">
          <h2 className="text-xl font-bold text-[#1f2a24] font-headline">{title}</h2>
          <Button type="button" variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-[#f3efe7]" onClick={onClose} aria-label="Close dialog">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
