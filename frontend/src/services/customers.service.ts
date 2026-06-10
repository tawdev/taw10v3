import { Customer } from '@/types/admin';
import { http } from './http';

export const customersService = {
  list: () => http.get<Customer[]>('/admin/customers').then((res) => res.data),
  create: (payload: Omit<Customer, 'id' | 'createdAt'>) => http.post<Customer>('/admin/customers', payload).then((res) => res.data),
  update: (id: string, payload: Partial<Customer>) => http.patch<Customer>(`/admin/customers/${id}`, payload).then((res) => res.data),
  delete: (id: string) => http.delete(`/admin/customers/${id}`),
};
