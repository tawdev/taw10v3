import { TeamMember } from '@/types/admin';
import { http } from './http';

export type TeamMemberPayload = Omit<TeamMember, 'id' | 'createdAt'>;

export const teamService = {
  publicList: () => http.get<TeamMember[]>('/team').then((res) => res.data),
  list: () => http.get<TeamMember[]>('/admin/team').then((res) => res.data),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return http.post<{ imageUrl: string }>('/admin/team/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data);
  },
  create: (payload: TeamMemberPayload) => http.post<TeamMember>('/admin/team', payload).then((res) => res.data),
  update: (id: string, payload: Partial<TeamMemberPayload>) => http.patch<TeamMember>(`/admin/team/${id}`, payload).then((res) => res.data),
  delete: (id: string) => http.delete(`/admin/team/${id}`),
};
