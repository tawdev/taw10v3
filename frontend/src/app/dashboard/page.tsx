'use client';

import { DashboardHome } from '@/components/dashboard/DashboardHome';
import { useAuthStore } from '@/store/auth-store';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.email?.split('@')[0]?.toUpperCase() ?? 'ADMIN';

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Bienvenue, <span className="text-[#dab055]">{firstName}</span> 🔥
        </h1>
        <p className="mt-1 text-sm text-white/50">Voici un aperçu des performances de votre plateforme aujourd'hui.</p>
      </div>
      <DashboardHome />
    </>
  );
}
