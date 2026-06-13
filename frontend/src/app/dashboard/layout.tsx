import { ReactNode } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ThemeProvider } from '@/context/ThemeContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardShell>{children}</DashboardShell>
    </ThemeProvider>
  );
}

