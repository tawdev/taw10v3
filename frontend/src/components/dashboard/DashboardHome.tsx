'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Clock3,
  FileUp,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Table, Td, Th } from '@/components/ui/table';
import { useAdminStore } from '@/store/admin-store';
import { OrderStatusBadge } from './StatusBadge';
import { ordersService } from '@/services/orders.service';
import { contactsService } from '@/services/contacts.service';
import { customersService } from '@/services/customers.service';
import { documentsService } from '@/services/documents.service';
import { pricingService } from '@/services/pricing.service';
import { Order } from '@/types/admin';

const currency = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
  maximumFractionDigits: 0,
});

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function DashboardHome() {
  const {
    orders,
    pricing,
    customers,
    documents,
    contacts,
    setOrders,
    setPricing,
    setCustomers,
    setDocuments,
    setContacts,
  } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const getOrderPrice = useCallback((order: Order) => {
    if (typeof order.revenue === 'number' && order.revenue > 0) return order.revenue;
    const selectedPlan = order.selectedPlan?.trim().toLowerCase();
    if (!selectedPlan) return 0;

    const plan = pricing.find((item) => {
      const planName = item.name.trim().toLowerCase();
      return selectedPlan === planName || selectedPlan.includes(planName) || planName.includes(selectedPlan);
    });

    return plan?.price ?? 0;
  }, [pricing]);

  const refreshDashboard = useCallback(async () => {
    setIsLoading(true);
    const results = await Promise.allSettled([
      ordersService.list(),
      pricingService.list(true),
      customersService.list(),
      documentsService.list(),
      contactsService.list(),
    ]);

    const [ordersResult, pricingResult, customersResult, documentsResult, contactsResult] = results;
    if (ordersResult.status === 'fulfilled') setOrders(ordersResult.value);
    if (pricingResult.status === 'fulfilled') setPricing(pricingResult.value);
    if (customersResult.status === 'fulfilled') setCustomers(customersResult.value);
    if (documentsResult.status === 'fulfilled') setDocuments(documentsResult.value);
    if (contactsResult.status === 'fulfilled') setContacts(contactsResult.value);

    setLastSync(new Date().toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' }));
    setIsLoading(false);
  }, [setContacts, setCustomers, setDocuments, setOrders, setPricing]);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const metrics = useMemo(() => {
    const completedOrders = orders.filter((order) => order.status === 'COMPLETED');
    const pendingOrders = orders.filter((order) => ['PENDING', 'IN_PROGRESS', 'WAITING_DOCUMENTS'].includes(order.status));
    const revenue = completedOrders.reduce((sum, order) => sum + getOrderPrice(order), 0);
    const conversion = orders.length ? Math.round((completedOrders.length / orders.length) * 100) : 0;

    return {
      completed: completedOrders.length,
      pending: pendingOrders.length,
      revenue,
      conversion,
    };
  }, [getOrderPrice, orders]);

  const kpis = [
    { label: 'Total Orders', value: orders.length, detail: `${metrics.conversion}% completed`, icon: ShoppingCart, href: '/dashboard/orders' },
    { label: 'Total Customers', value: customers.length, detail: 'Customer records', icon: Users, href: '/dashboard/customers' },
    { label: 'Pending Orders', value: metrics.pending, detail: 'Need follow-up', icon: Clock3, href: '/dashboard/orders' },
    { label: 'Completed Orders', value: metrics.completed, detail: 'Revenue counted', icon: CheckCircle2, href: '/dashboard/orders' },
    { label: 'Documents Uploaded', value: documents.length, detail: 'Across all clients', icon: FileUp, href: '/dashboard/documents' },
    { label: 'Revenue', value: currency.format(metrics.revenue), detail: 'Completed orders only', icon: Banknote, href: '/dashboard/orders' },
  ];

  if (isLoading && orders.length === 0) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-40" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-[#e4d7bd] bg-[#1f2a24] text-white shadow-[0_24px_80px_rgba(31,42,36,0.18)]">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-[#e8c979]">
              <Sparkles className="h-3.5 w-3.5" />
              Live admin command center
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">TAW10 Operations</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">
              Suivez les commandes, clients, documents et demandes depuis une vue dynamique connectee a l'API quand les endpoints sont disponibles.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <Button type="button" variant="secondary" onClick={refreshDashboard} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <p className="text-xs text-white/55">{lastSync ? `Last sync ${lastSync}` : 'Sync pending'}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.label} href={kpi.href}>
              <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:border-[#a68942]/50 hover:shadow-[0_18px_50px_rgba(31,42,36,0.10)]">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a8172]">{kpi.label}</p>
                      <p className="mt-3 text-2xl font-bold tracking-tight text-[#1f2a24]">{kpi.value}</p>
                      <p className="mt-1 text-xs font-medium text-[#667085]">{kpi.detail}</p>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#eee8dd] bg-[#faf6ee] text-[#a68942] transition-all group-hover:bg-[#a68942] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <p className="mt-1 text-sm text-[#667085]">Latest activity with calculated plan price.</p>
            </div>
            <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-sm font-bold text-[#a68942]">
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <thead><tr><Th>Order</Th><Th>Customer</Th><Th>Plan</Th><Th>Price</Th><Th>Status</Th></tr></thead>
              <tbody>{orders.slice(0, 6).map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-[#fcfaf7]">
                  <Td className="font-semibold text-[#1f2a24]">{order.orderNumber}</Td>
                  <Td>{order.customerName}</Td>
                  <Td><span className="rounded-full bg-[#f1ede5] px-2.5 py-1 text-xs font-bold text-[#5a4300]">{order.selectedPlan}</span></Td>
                  <Td className="font-semibold">{getOrderPrice(order) ? currency.format(getOrderPrice(order)) : 'Non defini'}</Td>
                  <Td><OrderStatusBadge status={order.status} /></Td>
                </tr>
              ))}</tbody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Contact Requests</CardTitle>
            <p className="mt-1 text-sm text-[#667085]">Unread messages and recent inquiries.</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {contacts.slice(0, 5).map((contact) => (
              <div key={contact.id} className="rounded-lg border border-[#eee8dd] bg-[#fcfaf7] p-4 transition hover:border-[#a68942]/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#1f2a24]">{contact.subject}</p>
                    <p className="mt-1 text-xs font-semibold text-[#667085]">{contact.name} - {contact.email}</p>
                  </div>
                  {!contact.isRead ? <span className="rounded-full bg-[#fff3d6] px-2 py-1 text-[10px] font-black uppercase text-[#8a5a00]">New</span> : null}
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#4f5b54]">{contact.message}</p>
                <p className="mt-3 text-xs font-bold text-[#a68942]">{formatDate(contact.createdAt)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Customers</CardTitle>
            <p className="mt-1 text-sm text-[#667085]">Newest customer and company profiles.</p>
          </div>
          <Link href="/dashboard/customers" className="inline-flex items-center gap-1 text-sm font-bold text-[#a68942]">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <thead><tr><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Company</Th><Th>Date</Th></tr></thead>
            <tbody>{customers.slice(0, 6).map((customer) => (
              <tr key={customer.id} className="transition-colors hover:bg-[#fcfaf7]">
                <Td className="font-semibold text-[#1f2a24]">{customer.fullName}</Td>
                <Td className="text-xs text-[#667085]">{customer.email}</Td>
                <Td>{customer.phone}</Td>
                <Td>{customer.companyName}</Td>
                <Td className="text-xs">{formatDate(customer.createdAt)}</Td>
              </tr>
            ))}</tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
