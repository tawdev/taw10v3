'use client';

import { useEffect, useState } from 'react';
import { getAdminToken } from '@/lib/admin-auth';
import { AdminProfile, apiFetch } from '@/lib/api';

export default function DashboardUsersPage() {
  const [users, setUsers] = useState<AdminProfile[]>([]);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      return;
    }

    apiFetch<AdminProfile[]>('/admin/users', { token }).then(setUsers).catch(() => setUsers([]));
  }, []);

  return (
    <section className="min-h-[70vh] bg-surface px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-semibold text-on-surface">Administrateurs</h1>
        <div className="mt-8 overflow-hidden rounded-lg border border-outline-variant bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-surface-container text-on-surface">
              <tr>
                <th className="px-5 py-4 font-semibold">Nom</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-outline-variant">
                  <td className="px-5 py-4">{user.fullName}</td>
                  <td className="px-5 py-4">{user.email}</td>
                  <td className="px-5 py-4">{user.role}</td>
                  <td className="px-5 py-4">{user.isActive ? 'Actif' : 'Inactif'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
