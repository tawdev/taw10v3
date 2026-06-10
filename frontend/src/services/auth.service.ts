import { AdminProfile, LoginResponse } from '@/lib/api';
import { http } from './http';

export const authService = {
  async login(email: string, password: string) {
    const { data } = await http.post<LoginResponse>('/auth/login', { email, password });
    return data;
  },
  async profile() {
    const { data } = await http.get<AdminProfile>('/auth/profile');
    return data;
  },
  async logout() {
    await http.post('/auth/logout');
  },
};
