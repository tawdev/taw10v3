import { FaqItem } from '@/types/admin';
import { http } from './http';

export const faqService = {
  publicList: () => http.get<FaqItem[]>('/faq').then((res) => res.data),
  list: () => http.get<FaqItem[]>('/admin/faq').then((res) => res.data),
  create: (payload: Omit<FaqItem, 'id'>) => http.post<FaqItem>('/admin/faq', payload).then((res) => res.data),
  update: (id: string, payload: Partial<FaqItem>) => http.patch<FaqItem>(`/admin/faq/${id}`, payload).then((res) => res.data),
  delete: (id: string) => http.delete(`/admin/faq/${id}`),
  react: (id: string, type: 'like' | 'dislike') => http.post<FaqItem>(`/faq/${id}/reaction`, { type }).then((res) => res.data),
};
