'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export function useRequireAdmin() {
  const router = useRouter();
  const { user, isLoading, loadProfile } = useAuthStore();

  useEffect(() => {
    const token = window.localStorage.getItem('taw10_access_token');
    if (!token) {
      router.replace('/portal-taw10-x92-admin');
      return;
    }

    loadProfile().then((profile) => {
      if (!profile || !['SUPER_ADMIN', 'ADMIN'].includes(profile.role)) {
        router.replace('/portal-taw10-x92-admin');
      }
    });
  }, [loadProfile, router]);

  return { user, isLoading };
}
