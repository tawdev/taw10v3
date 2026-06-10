'use client';

import { create } from 'zustand';
import { AdminProfile } from '@/lib/api';
import { authService } from '@/services/auth.service';

type AuthState = {
  user: AdminProfile | null;
  isLoading: boolean;
  setUser: (user: AdminProfile | null) => void;
  loadProfile: () => Promise<AdminProfile | null>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  loadProfile: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.profile();
      set({ user, isLoading: false });
      return user;
    } catch {
      set({ user: null, isLoading: false });
      return null;
    }
  },
  logout: async () => {
    await authService.logout().catch(() => undefined);
    window.localStorage.removeItem('taw10_access_token');
    document.cookie = 'taw10_access_token=; path=/; max-age=0; SameSite=Lax';
    set({ user: null });
  },
}));
