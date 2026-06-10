'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Contact,
  CreditCard,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  Sparkles,
  UserRoundCog,
  Users,
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRequireAdmin } from '@/hooks/useRequireAdmin';
import { useAuthStore } from '@/store/auth-store';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ToastViewport } from '@/components/ui/toast';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/pricing', label: 'Pricing Plans', icon: CreditCard },
  { href: '/dashboard/services', label: 'Services', icon: Sparkles },
  { href: '/dashboard/orders', label: 'Orders', icon: ClipboardList },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/documents', label: 'Documents', icon: FileText },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Contact },
  { href: '/dashboard/blog', label: 'Blog', icon: BookOpen },
  { href: '/dashboard/team', label: 'Team', icon: UserRoundCog },
  { href: '/dashboard/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/administrators', label: 'Administrators', icon: Shield, superOnly: true },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useRequireAdmin();
  const logout = useAuthStore((state) => state.logout);
  const { language, setLanguageOnly } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function switchLanguage(lang: 'FR' | 'AR' | 'EN') {
    // Only persist state/cookie — no URL redirect needed in dashboard
    setLanguageOnly(lang);
  }

  async function handleLogout() {
    await logout();
    router.replace('/portal-taw10-x92-admin');
  }

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-[#f7f4ee] p-6">
        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          <Skeleton className="h-[calc(100vh-3rem)]" />
          <div className="grid gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  const sidebar = (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex border-r border-[#e2dbcf] bg-[#1f2a24] text-white transition-all lg:sticky lg:top-0',
        collapsed ? 'w-[84px]' : 'w-[280px]',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}
    >
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#dab055] font-black text-[#1f2a24]">T10</div>
            {!collapsed ? <span className="text-sm font-bold uppercase tracking-[0.16em]">TAW10 Admin</span> : null}
          </Link>
          <Button type="button" variant="ghost" size="icon" className="hidden text-white hover:bg-white/10 lg:inline-flex" onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.filter((item) => !item.superOnly || user?.role === 'SUPER_ADMIN').map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold text-white/78 transition hover:bg-white/10 hover:text-white',
                  active && 'bg-[#dab055] text-[#1f2a24] hover:bg-[#dab055] hover:text-[#1f2a24]',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-white/78 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed ? <span>Logout</span> : null}
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#1f2a24]">
      <div className="lg:grid lg:grid-cols-[auto_1fr]">
        {sidebar}
        {mobileOpen ? <button type="button" className="fixed inset-0 z-30 bg-black/35 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu" /> : null}
        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#e2dbcf] bg-white/90 px-4 backdrop-blur md:px-6">
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-sm font-semibold text-[#667085]">TAW10 Platform</p>
                <p className="text-xs text-[#8a8172]">{user?.email ?? 'Secured admin session'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-[#e2dbcf] bg-white px-3 py-1.5 text-xs font-bold text-[#4f5b54] sm:flex">
                <BarChart3 className="h-4 w-4 text-[#a68942]" />
                {user?.role ?? 'ADMIN'}
              </div>
              {/* Language Switcher */}
              <div className="flex items-center gap-0.5 rounded-full border border-[#e2dbcf] bg-white p-0.5" role="group" aria-label="Language selection">
                {(['FR', 'AR', 'EN'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => switchLanguage(lang)}
                    aria-pressed={language === lang}
                    aria-label={`Switch to ${lang === 'FR' ? 'French' : lang === 'AR' ? 'Arabic' : 'English'}`}
                    className={cn(
                      'h-7 w-9 rounded-full text-[10px] font-black tracking-widest transition-all duration-200',
                      language === lang
                        ? 'bg-[#dab055] text-white shadow-sm'
                        : 'text-[#8a8172] hover:text-[#1f2a24]',
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>
          <main className="p-4 md:p-6 xl:p-8">{children}</main>
        </div>
      </div>
      <ToastViewport />
    </div>
  );
}
