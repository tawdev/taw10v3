import { AdminDocument, DocumentType } from '@/types/admin';
import { http } from './http';

export const documentsService = {
  list: (type?: DocumentType) => http.get<AdminDocument[]>('/admin/documents', { params: { type } }).then((res) => res.data),
  downloadUrl: (id: string) => `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/admin/documents/${id}/download`,
  delete: (id: string) => http.delete(`/admin/documents/${id}`),
};
