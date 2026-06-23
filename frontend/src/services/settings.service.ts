import { PlatformSettings } from '@/types/admin';
import { http } from './http';

export const settingsService = {
  get: () => http.get<PlatformSettings>('/settings').then((res) => res.data),
  update: (payload: PlatformSettings) => http.put<PlatformSettings>('/admin/settings', payload).then((res) => res.data),
};
