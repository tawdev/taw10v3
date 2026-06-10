import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return <table className={cn('w-full min-w-[760px] text-left text-sm border-collapse', className)} {...props} />;
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('bg-[#faf8f4] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6b6255] border-b border-[#eee8dd]', className)} {...props} />;
}

export function Td({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('border-b border-[#f3efe7] px-6 py-4 text-[#1f2a24] align-middle font-medium', className)} {...props} />;
}
