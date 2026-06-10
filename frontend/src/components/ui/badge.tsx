import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'muted';
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider select-none border shadow-sm/5',
        variant === 'default' && 'bg-[#e6e9ed] text-[#2c3748] border-[#ced4da]',
        variant === 'success' && 'bg-[#d1ebd7] text-[#0f5c29] border-[#b0e0bc]',
        variant === 'warning' && 'bg-[#fef0d2] text-[#784d00] border-[#fde1a6]',
        variant === 'danger' && 'bg-[#fcdad5] text-[#931111] border-[#f9b8ae]',
        variant === 'muted' && 'bg-[#ece6db] text-[#564e43] border-[#ded5c6]',
        className,
      )}
      {...props}
    />
  );
}
