import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'sm' | 'md' | 'icon';
};

export function Button({ className, variant = 'default', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
        variant === 'default' && 'bg-[#1f2a24] text-white hover:bg-[#2b3a32] shadow-sm hover:shadow active:bg-[#1a241f]',
        variant === 'outline' && 'border border-[#d8d1c3] bg-white text-[#1f2a24] hover:border-[#a68942] hover:bg-[#fcfaf7] shadow-sm',
        variant === 'ghost' && 'text-[#4f5b54] hover:bg-[#f3efe7] hover:text-[#1f2a24]',
        variant === 'secondary' && 'bg-[#efe9dd] text-[#1f2a24] hover:bg-[#e2d7c2] active:bg-[#d5caaf]',
        variant === 'destructive' && 'bg-[#ba1a1a] text-white hover:bg-[#a61515] active:bg-[#8f1212] shadow-sm',
        size === 'sm' && 'h-9 px-3.5 text-xs',
        size === 'md' && 'h-10 px-5',
        size === 'icon' && 'h-9 w-9 p-0 shrink-0',
        className,
      )}
      {...props}
    />
  );
}
