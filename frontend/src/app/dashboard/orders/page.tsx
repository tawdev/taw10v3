'use client';

import { useEffect, useState } from 'react';
import { Banknote, CheckCircle2, Clock3, Eye, Trash2, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { OrderStatusBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/form';
import { Table, Td, Th } from '@/components/ui/table';
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

    return plan?.price ?? null;
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
              <p className="text-sm font-medium text-[#667085]">Pending Orders</p>
              <p className="mt-2 text-2xl font-semibold text-[#1f2a24]">{pendingOrders}</p>
            </div>
            <Clock3 className="h-10 w-10 rounded-md bg-[#fff3d6] p-2 text-[#8a5a00]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">Completed</p>
              <p className="mt-2 text-2xl font-semibold text-[#1f2a24]">{completedOrders}</p>
            </div>
            <CheckCircle2 className="h-10 w-10 rounded-md bg-[#e6f4ea] p-2 text-[#137333]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">Cancelled</p>
              <p className="mt-2 text-2xl font-semibold text-[#1f2a24]">{cancelledOrders}</p>
            </div>
            <XCircle className="h-10 w-10 rounded-md bg-[#ffe8e5] p-2 text-[#ba1a1a]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">Revenue</p>
              <p className="mt-2 text-2xl font-semibold text-[#1f2a24]">{currency.format(totalRevenue)}</p>
            </div>
            <Banknote className="h-10 w-10 rounded-md bg-[#f1ede5] p-2 text-[#a68942]" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Orders List</CardTitle>
            <p className="mt-1 text-sm text-[#667085]">
              View customer details, selected package, order price and workflow status.
            </p>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-sm text-[#667085]">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-sm text-[#667085]">
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
                  <tr key={order.id} className="transition-colors hover:bg-[#fcfaf7]">
                    <Td>
                      <p className="font-bold text-[#1f2a24]">{order.orderNumber}</p>
                      <p className="mt-1 text-xs text-[#8a8172]">#{order.id}</p>
                    </Td>
                    <Td>
                      <p className="font-semibold text-[#1f2a24]">{order.customerName}</p>
                      <p className="mt-1 text-xs text-[#667085]">{order.email || 'No email'}</p>
                    </Td>
                    <Td>
                      <p className="text-sm font-semibold text-[#4f5b54]">{order.phone || 'N/A'}</p>
                      <p className="mt-1 text-xs text-[#667085]">{order.email || 'N/A'}</p>
                    </Td>
                    <Td>
                      <span className="inline-flex rounded-full bg-[#f1ede5] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#5a4300]">
                        {order.selectedPlan || 'N/A'}
                      </span>
                    </Td>
                    <Td>
                      {getOrderPrice(order) !== null ? (
                        <>
                          <p className="font-bold text-[#1f2a24]">{currency.format(getOrderPrice(order) ?? 0)}</p>
                          <p className="mt-1 text-xs font-medium text-[#8a8172]">DH ht</p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-[#8a8172]">Non defini</p>
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
    </>
  );
}
