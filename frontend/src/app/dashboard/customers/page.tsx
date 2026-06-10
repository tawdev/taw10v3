'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Building2, Eye, Mail, Phone, Plus, Trash2, Users } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input } from '@/components/ui/form';
import { Table, Td, Th } from '@/components/ui/table';
import { customersService } from '@/services/customers.service';
import { ordersService } from '@/services/orders.service';
import { useAdminStore } from '@/store/admin-store';
import { useToastStore } from '@/store/toast-store';
import { Customer, Order } from '@/types/admin';

const emptyCustomer = (): Customer => ({
  id: crypto.randomUUID(),
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  createdAt: new Date().toISOString().slice(0, 10),
});

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || 'N/A';
  return date.toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' });
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function customersFromOrders(orders: Order[]) {
  const customerMap = new Map<string, Customer>();

  orders.forEach((order) => {
    const key = normalize(order.email || order.phone || order.customerName);
    if (!key || customerMap.has(key)) return;

    customerMap.set(key, {
      id: `order-customer-${order.id}`,
      fullName: order.customerName,
      email: order.email || '',
      phone: order.phone || '',
      companyName: '',
      createdAt: order.createdAt,
    });
  });

  return Array.from(customerMap.values());
}

export default function CustomersPage() {
  const { customers, setCustomers, upsertCustomer, removeCustomer } = useAdminStore();
  const toast = useToastStore((state) => state.toast);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([customersService.list(), ordersService.list()])
      .then(([customersResult, ordersResult]) => {
        if (customersResult.status === 'fulfilled') {
          setCustomers(customersResult.value);
          return;
        }

        if (ordersResult.status === 'fulfilled') {
          setCustomers(customersFromOrders(ordersResult.value));
        }
      })
      .finally(() => setIsLoading(false));
  }, [setCustomers, toast]);

  const stats = useMemo(() => {
    const withCompany = customers.filter((customer) => customer.companyName.trim()).length;
    const withPhone = customers.filter((customer) => customer.phone.trim()).length;
    const withEmail = customers.filter((customer) => customer.email.trim()).length;

    return {
      total: customers.length,
      withCompany,
      withPhone,
      withEmail,
    };
  }, [customers]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    const payload = {
      fullName: editing.fullName,
      email: editing.email,
      phone: editing.phone,
      companyName: editing.companyName,
    };
    const exists = customers.some((customer) => customer.id === editing.id);

    try {
      const saved = exists
        ? await customersService.update(editing.id, payload)
        : await customersService.create(payload);

      upsertCustomer(saved);
      toast({ title: 'Client sauvegarde', variant: 'success' });
      setEditing(null);
    } catch {
      upsertCustomer(editing);
      toast({
        title: 'Client sauvegarde localement',
        description: "L'API clients n'est pas encore disponible.",
        variant: 'default',
      });
      setEditing(null);
    }
  }

  async function deleteCustomer(customer: Customer) {
    if (!confirm('Supprimer ce client ?')) return;

    try {
      if (!customer.id.startsWith('order-customer-')) {
        await customersService.delete(customer.id);
      }
      removeCustomer(customer.id);
      toast({ title: 'Client supprime', variant: 'success' });
    } catch {
      toast({ title: 'Impossible de supprimer le client', variant: 'destructive' });
    }
  }

  return (
    <>
      <PageHeader
        title="Customers"
        description="Gestion des profils clients: nom, contact, societe et date de creation."
        actions={
          <Button onClick={() => setEditing(emptyCustomer())}>
            <Plus className="h-4 w-4" />Create Customer
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">Clients</p>
              <p className="mt-2 text-2xl font-semibold text-[#1f2a24]">{stats.total}</p>
            </div>
            <Users className="h-10 w-10 rounded-md bg-[#f1ede5] p-2 text-[#a68942]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">Companies</p>
              <p className="mt-2 text-2xl font-semibold text-[#1f2a24]">{stats.withCompany}</p>
            </div>
            <Building2 className="h-10 w-10 rounded-md bg-[#eef6f2] p-2 text-[#137333]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">Phones</p>
              <p className="mt-2 text-2xl font-semibold text-[#1f2a24]">{stats.withPhone}</p>
            </div>
            <Phone className="h-10 w-10 rounded-md bg-[#fff3d6] p-2 text-[#8a5a00]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">Emails</p>
              <p className="mt-2 text-2xl font-semibold text-[#1f2a24]">{stats.withEmail}</p>
            </div>
            <Mail className="h-10 w-10 rounded-md bg-[#edf2ff] p-2 text-[#3559c7]" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <p className="mt-1 text-sm text-[#667085]">
            Cette page affiche uniquement les informations du client. Les donnees de reservation restent dans Orders.
          </p>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {isLoading && customers.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-sm text-[#667085]">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-sm text-[#667085]">No customers found.</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Client</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Company</Th>
                  <Th>Created Date</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="transition-colors hover:bg-[#fcfaf7]">
                    <Td>
                      <p className="font-bold text-[#1f2a24]">{customer.fullName || 'N/A'}</p>
                      <p className="mt-1 text-xs text-[#8a8172]">Profil client</p>
                    </Td>
                    <Td className="font-semibold text-[#4f5b54]">{customer.email || 'N/A'}</Td>
                    <Td className="font-semibold text-[#4f5b54]">{customer.phone || 'N/A'}</Td>
                    <Td className="font-semibold">{customer.companyName || 'N/A'}</Td>
                    <Td className="text-xs">{formatDate(customer.createdAt)}</Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-[#efe9dd]" title="View Customer" onClick={() => setViewing(customer)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setEditing(customer)}>
                          Edit
                        </Button>
                        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => deleteCustomer(customer)} title="Delete Customer">
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

      <Dialog open={Boolean(viewing)} title="Customer Profile" onClose={() => setViewing(null)}>
        {viewing ? (
          <div className="grid gap-4">
            <div className="rounded-lg border border-[#eee8dd] bg-[#fcfaf7] p-4">
              <p className="text-lg font-bold text-[#1f2a24]">{viewing.fullName || 'N/A'}</p>
              <p className="mt-1 text-sm text-[#667085]">Created {formatDate(viewing.createdAt)}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-[#eee8dd] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8a8172]">Email</p>
                <p className="mt-2 font-semibold text-[#1f2a24]">{viewing.email || 'N/A'}</p>
              </div>
              <div className="rounded-lg border border-[#eee8dd] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8a8172]">Phone</p>
                <p className="mt-2 font-semibold text-[#1f2a24]">{viewing.phone || 'N/A'}</p>
              </div>
              <div className="rounded-lg border border-[#eee8dd] p-4 md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8a8172]">Company</p>
                <p className="mt-2 font-semibold text-[#1f2a24]">{viewing.companyName || 'N/A'}</p>
              </div>
            </div>
          </div>
        ) : null}
      </Dialog>

      <Dialog open={Boolean(editing)} title="Customer Profile" onClose={() => setEditing(null)}>
        {editing ? (
          <form onSubmit={save} className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full Name">
                <Input value={editing.fullName} onChange={(event) => setEditing({ ...editing, fullName: event.target.value })} required />
              </Field>
              <Field label="Email">
                <Input type="email" value={editing.email} onChange={(event) => setEditing({ ...editing, email: event.target.value })} required />
              </Field>
              <Field label="Phone">
                <Input value={editing.phone} onChange={(event) => setEditing({ ...editing, phone: event.target.value })} placeholder="e.g. +212 600-000000" />
              </Field>
              <Field label="Company Name">
                <Input value={editing.companyName} onChange={(event) => setEditing({ ...editing, companyName: event.target.value })} placeholder="Company Name LLC" />
              </Field>
            </div>
            <Button type="submit" className="mt-2 h-11 w-full">
              Save Customer
            </Button>
          </form>
        ) : null}
      </Dialog>
    </>
  );
}
