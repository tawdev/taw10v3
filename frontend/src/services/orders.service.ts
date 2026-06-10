import { Order, OrderStatus } from '@/types/admin';
import { http } from './http';

export const ordersService = {
  // Public: called from website when user clicks a pricing plan
  create: (data: { customerName: string; phone: string; email?: string; selectedPlan: string }) =>
    http.post<Order>('/orders', data).then((res) => res.data),

  // Dashboard: list all orders
  list: () => http.get<Order[]>('/orders').then((res) => res.data),

  // Dashboard: update order status
  updateStatus: (id: string, status: OrderStatus) =>
    http.patch<Order>(`/orders/${id}/status`, { status }).then((res) => res.data),

  // Dashboard: delete order
  delete: (id: string) => http.delete(`/orders/${id}`),
};
