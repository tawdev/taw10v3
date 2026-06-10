import { ServiceOffering } from '@/types/admin';
import { http } from './http';

export type ServiceOfferingPayload = Omit<ServiceOffering, 'id' | 'createdAt'>;

export const servicesService = {
  publicList: () => http.get<ServiceOffering[]>('/services').then((res) => res.data),
  list: () => http.get<ServiceOffering[]>('/admin/services').then((res) => res.data),
  create: (payload: ServiceOfferingPayload) => http.post<ServiceOffering>('/admin/services', payload).then((res) => res.data),
  update: (id: string, payload: Partial<ServiceOfferingPayload>) => http.patch<ServiceOffering>(`/admin/services/${id}`, payload).then((res) => res.data),
  delete: (id: string) => http.delete(`/admin/services/${id}`),
};
