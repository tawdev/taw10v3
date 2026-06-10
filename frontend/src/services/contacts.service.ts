import { ContactRequest } from '@/types/admin';
import { http } from './http';

export const contactsService = {
  // Public: post contact form submission
  create: (data: { nom: string; prenom: string; email: string; phone?: string; service?: string; message: string }) =>
    http.post<any>('/contacts', data).then((res) => res.data),

  list: () => http.get<ContactRequest[]>('/contacts').then((res) => res.data),
  markRead: (id: string) => http.patch<ContactRequest>(`/contacts/${id}/read`).then((res) => res.data),
  delete: (id: string) => http.delete(`/contacts/${id}`),
};
