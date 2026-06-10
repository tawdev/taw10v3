import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('h-10 w-full rounded-lg border border-[#d8d1c3] bg-white px-3.5 text-sm shadow-sm outline-none transition-all duration-200 focus:border-[#a68942] focus:ring-2 focus:ring-[#a68942]/15 text-[#1f2a24] placeholder:text-[#a29b8f]', className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('min-h-28 w-full rounded-lg border border-[#d8d1c3] bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition-all duration-200 focus:border-[#a68942] focus:ring-2 focus:ring-[#a68942]/15 text-[#1f2a24] placeholder:text-[#a29b8f]', className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn('h-10 w-full rounded-lg border border-[#d8d1c3] bg-white px-3.5 text-sm shadow-sm outline-none transition-all duration-200 focus:border-[#a68942] focus:ring-2 focus:ring-[#a68942]/15 text-[#1f2a24] cursor-pointer', className)} {...props} />;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6b6255]">
      {label}
      {children}
    </label>
  );
}
