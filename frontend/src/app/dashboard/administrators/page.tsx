'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Plus, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ActiveBadge } from '@/components/dashboard/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input, Select } from '@/components/ui/form';
import { Table, Td, Th } from '@/components/ui/table';
import { useAdminStore } from '@/store/admin-store';
import { useAuthStore } from '@/store/auth-store';
import { AdminRole, AdminUser } from '@/types/admin';

const emptyAdmin = (): AdminUser => ({ id: crypto.randomUUID(), fullName: '', email: '', role: 'ADMIN', isActive: true, createdAt: new Date().toISOString().slice(0, 10) });

export default function AdministratorsPage() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const { administrators, upsertAdmin, toggleAdmin } = useAdminStore();
  const [editing, setEditing] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'SUPER_ADMIN') router.replace('/dashboard');
  }, [currentUser, router]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editing) {
      upsertAdmin(editing);
      setEditing(null);
    }
  }

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card className="border-[#f9b8ae] bg-[#fff2f0]">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ffe8e5] text-[#ba1a1a] border border-[#f9b8ae]">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#ba1a1a] text-sm">Access Denied</h3>
              <p className="text-xs text-[#93000a] mt-1 leading-relaxed">
                Only accounts with a <span className="font-bold">SUPER_ADMIN</span> role can manage administrative users.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Administrators"
        description="Create admins, change roles, and activate or deactivate access."
        actions={
          <Button onClick={() => setEditing(emptyAdmin())}>
            <Plus className="h-4 w-4" />Create Admin
          </Button>
        }
      />
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {administrators.map((admin) => (
                <tr key={admin.id} className="hover:bg-white/5 transition-colors">
                  <Td className="font-bold text-white">{admin.fullName}</Td>
                  <Td className="text-xs text-[#667085]">{admin.email}</Td>
                  <Td>
                    <Badge variant={admin.role === 'SUPER_ADMIN' ? 'success' : 'default'}>
                      {admin.role.replaceAll('_', ' ')}
                    </Badge>
                  </Td>
                  <Td>
                    <ActiveBadge active={admin.isActive} />
                  </Td>
                  <Td className="text-xs">{admin.createdAt}</Td>
                  <Td>
                    <div className="flex gap-2 items-center">
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setEditing(admin)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 text-xs"
                        onClick={() => toggleAdmin(admin.id)}
                      >
                        {admin.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(editing)} title="Administrator Profile" onClose={() => setEditing(null)}>
        {editing ? (
          <form onSubmit={save} className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full Name">
                <Input
                  value={editing.fullName}
                  onChange={(e) => setEditing({ ...editing, fullName: e.target.value })}
                  required
                  placeholder="e.g. John Doe"
                />
              </Field>
              <Field label="Email Address">
                <Input
                  type="email"
                  value={editing.email}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  required
                  placeholder="admin@taw10.com"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2 items-center">
              <Field label="Role">
                <Select
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value as AdminRole })}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN</option>
                </Select>
              </Field>
              <label className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#4f5b54] cursor-pointer mt-5 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#d8d1c3] text-[#a68942] focus:ring-[#a68942]/30 transition-all cursor-pointer"
                  checked={editing.isActive}
                  onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                />{' '}
                Active Account
              </label>
            </div>

            <Button type="submit" className="w-full mt-2 h-11">
              Save Account Settings
            </Button>
          </form>
        ) : null}
      </Dialog>
    </>
  );
}
