import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return <table className={cn('w-full min-w-[760px] text-left text-sm border-collapse', className)} {...props} />;
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('bg-white/5 px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#dab055] border-b border-white/10', className)} {...props} />;
}

export function Td({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('border-b border-white/5 px-6 py-4 text-white/80 align-middle font-medium', className)} {...props} />;
}
