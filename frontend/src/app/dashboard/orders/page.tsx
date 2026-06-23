'use client';

import { useEffect, useState } from 'react';
import { Banknote, CheckCircle2, Clock3, Eye, Trash2, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { OrderStatusBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/form';
import { Table, Td, Th } from '@/components/ui/table';
import { Dialog } from '@/components/ui/dialog';
import { useAdminStore } from '@/store/admin-store';
import { useToastStore } from '@/store/toast-store';
import { OrderStatus } from '@/types/admin';
import { ordersService } from '@/services/orders.service';

const statuses: OrderStatus[] = ['PENDING', 'IN_PROGRESS', 'WAITING_DOCUMENTS', 'COMPLETED', 'CANCELLED'];
const currency = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
  maximumFractionDigits: 0,
});

export default function OrdersPage() {
  const { orders, pricing, setOrders, updateOrderStatus, removeOrder } = useAdminStore();
  const toast = useToastStore((state) => state.toast);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    ordersService.list()
      .then((data) => {
        if (data) {
          setOrders(data);
        }
      })
      .catch((err) => {
        console.error(err);
        toast({ variant: 'destructive', title: 'Failed to fetch orders.' });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    try {
      await ordersService.updateStatus(id, newStatus);
      updateOrderStatus(id, newStatus);
      toast({ variant: 'success', title: 'Order status updated.' });
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Failed to update order status.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await ordersService.delete(id);
      removeOrder(id);
      toast({ variant: 'success', title: 'Order deleted.' });
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Failed to delete order.' });
    }
  };

  const pendingOrders = orders.filter((order) => ['PENDING', 'IN_PROGRESS', 'WAITING_DOCUMENTS'].includes(order.status)).length;
  const completedOrders = orders.filter((order) => order.status === 'COMPLETED').length;
  const cancelledOrders = orders.filter((order) => order.status === 'CANCELLED').length;
  const getOrderPrice = (order: (typeof orders)[number]) => {
    if (typeof order.revenue === 'number' && order.revenue > 0) {
      return order.revenue;
    }

    const selectedPlan = order.selectedPlan?.trim().toLowerCase();
    if (!selectedPlan) {
      return null;
    }

    const plan = pricing.find((item) => {
      const planName = item.name.trim().toLowerCase();
      return selectedPlan === planName || selectedPlan.includes(planName) || planName.includes(selectedPlan);
    });

    if (plan) return plan.price;

    // Extract price from notes for simulator orders
    if (order.notes) {
      const match = order.notes.match(/Prix estimé:\s*([\d,]+)/i);
      if (match) {
        return parseInt(match[1].replace(/,/g, ''), 10);
      }
    }

    return null;
  };

  const totalRevenue = orders
    .filter((order) => order.status === 'COMPLETED')
    .reduce((total, order) => total + (getOrderPrice(order) ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track customer orders, selected plans, prices, and processing status."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/50">Pending Orders</p>
              <p className="mt-2 text-2xl font-semibold text-white">{pendingOrders}</p>
            </div>
            <Clock3 className="h-10 w-10 rounded-md bg-[#dab055]/10 border border-[#dab055]/20 p-2 text-[#dab055]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/50">Completed</p>
              <p className="mt-2 text-2xl font-semibold text-white">{completedOrders}</p>
            </div>
            <CheckCircle2 className="h-10 w-10 rounded-md bg-emerald-500/10 border border-emerald-500/20 p-2 text-emerald-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/50">Cancelled</p>
              <p className="mt-2 text-2xl font-semibold text-white">{cancelledOrders}</p>
            </div>
            <XCircle className="h-10 w-10 rounded-md bg-red-500/10 border border-red-500/20 p-2 text-red-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/50">Revenue</p>
              <p className="mt-2 text-2xl font-semibold text-white">{currency.format(totalRevenue)}</p>
            </div>
            <Banknote className="h-10 w-10 rounded-md bg-[#dab055]/10 border border-[#dab055]/20 p-2 text-[#dab055]" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Orders List</CardTitle>
            <p className="mt-1 text-sm text-white/60">
              View customer details, selected package, order price and workflow status.
            </p>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-sm text-white/50">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-sm text-white/50">
              No orders found.
            </div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Order Number</Th>
                  <Th>Customer</Th>
                  <Th>Contact</Th>
                  <Th>Selected Plan</Th>
                  <Th>Price</Th>
                  <Th>Status</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-white/5">
                    <Td>
                      <p className="font-bold text-white">{order.orderNumber}</p>
                      <p className="mt-1 text-xs text-white/50">#{order.id}</p>
                    </Td>
                    <Td>
                      <p className="font-semibold text-white">{order.customerName}</p>
                      <p className="mt-1 text-xs text-white/40">{order.email || 'No email'}</p>
                    </Td>
                    <Td>
                      <p className="text-sm font-semibold text-white/70">{order.phone || 'N/A'}</p>
                      <p className="mt-1 text-xs text-white/40">{order.email || 'N/A'}</p>
                    </Td>
                    <Td>
                      <span className="inline-flex rounded-full bg-[#dab055]/10 border border-[#dab055]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#dab055]">
                        {order.selectedPlan || 'N/A'}
                      </span>
                    </Td>
                    <Td>
                      {getOrderPrice(order) !== null ? (
                        <>
                          <p className="font-bold text-white">{currency.format(getOrderPrice(order) ?? 0)}</p>
                          <p className="mt-1 text-xs font-medium text-white/50">DH ht</p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-white/50">Non defini</p>
                          <p className="mt-1 text-xs font-medium text-[#b0a696]">Aucun prix</p>
                        </>
                      )}
                    </Td>
                    <Td>
                      <OrderStatusBadge status={order.status} />
                    </Td>
                    <Td className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="View Order"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="h-8 w-44 py-0 text-xs font-semibold"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status.replaceAll('_', ' ')}
                            </option>
                          ))}
                        </Select>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(order.id)}
                          title="Delete Order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Order Details - ${selectedOrder?.orderNumber || ''}`}
        className="max-w-xl bg-white border border-[#dab055]/30 text-[#1c1c1b]"
      >
        {selectedOrder && (
          <div className="space-y-6 font-body text-[#1c1c1b]">
            <div className="flex justify-between items-center pb-4 border-b border-[#eee8dd]">
              <div>
                <p className="text-xs text-white/50 bg-[#1c1c1b] px-3 py-1 rounded-full inline-block font-bold">
                  Status: {selectedOrder.status}
                </p>
              </div>
              <p className="text-xs text-[#1c1c1b]/60">
                Created: {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#dab055] border-b border-[#dab055]/10 pb-1">
                Customer Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[#1c1c1b]/60 font-medium">Full Name</p>
                  <p className="font-semibold">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#1c1c1b]/60 font-medium">Phone Number (WhatsApp)</p>
                  <p className="font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {selectedOrder.phone}
                  </p>
                </div>
                {selectedOrder.email && (
                  <div className="col-span-2">
                    <p className="text-xs text-[#1c1c1b]/60 font-medium">Email Address</p>
                    <p className="font-semibold">{selectedOrder.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#dab055] border-b border-[#dab055]/10 pb-1">
                Order details
              </h3>
              <div className="text-sm space-y-2">
                <div>
                  <p className="text-xs text-[#1c1c1b]/60 font-medium">Selected Plan</p>
                  <p className="font-bold text-lg text-[#1c1c1b]">{selectedOrder.selectedPlan}</p>
                </div>
                {getOrderPrice(selectedOrder) !== null && (
                  <div>
                    <p className="text-xs text-[#1c1c1b]/60 font-medium">Estimated Price</p>
                    <p className="font-bold text-xl text-[#dab055]">
                      {currency.format(getOrderPrice(selectedOrder) ?? 0)} <span className="text-xs font-normal text-[#1c1c1b]/60">HT</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#dab055] border-b border-[#dab055]/10 pb-1">
                  Simulation details / Notes
                </h3>
                <div className="bg-[#fcf9f6] border border-gray-100 rounded-xl p-4 text-sm whitespace-pre-wrap leading-relaxed text-[#1c1c1b]">
                  {selectedOrder.notes}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-[#eee8dd]">
              <Button
                variant="outline"
                onClick={() => setIsDetailOpen(false)}
                className="bg-white border-gray-200 text-[#1c1c1b] hover:bg-gray-50"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
