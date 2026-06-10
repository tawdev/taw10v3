import { PricingPlan } from '@/types/admin';
import { http } from './http';

export const pricingService = {
  list: (includeInactive = false) => http.get<PricingPlan[]>('/pricing', { params: { includeInactive } }).then((res) => res.data),
  get: (id: string) => http.get<PricingPlan>(`/pricing/${id}`).then((res) => res.data),
  create: (payload: Omit<PricingPlan, 'id'>) => http.post<PricingPlan>('/pricing', payload).then((res) => res.data),
  update: (id: string, payload: Partial<PricingPlan>) => http.patch<PricingPlan>(`/pricing/${id}`, payload).then((res) => res.data),
  delete: (id: string) => http.delete(`/pricing/${id}`),
};
