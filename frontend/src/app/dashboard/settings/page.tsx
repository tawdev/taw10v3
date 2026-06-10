'use client';

import { FormEvent, useState } from 'react';
import { Save } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, Input } from '@/components/ui/form';
import { useAdminStore } from '@/store/admin-store';
import { useToastStore } from '@/store/toast-store';

export default function SettingsPage() {
  const { settings, updateSettings } = useAdminStore();
  const [draft, setDraft] = useState(settings);
  const toast = useToastStore((state) => state.toast);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateSettings(draft);
    toast({ title: 'Settings saved', variant: 'success' });
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage company identity, contact details, social links, logo and favicon."
      />
      <form onSubmit={save} className="grid gap-6 max-w-5xl">
        <Card>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold text-[#1f2a24] text-base font-headline">Company Profile</h3>
              <p className="text-xs text-[#667085] mt-0.5">Primary information displayed on the website and client invoices.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 border-t border-[#f3efe7] pt-4">
              <Field label="Company Name">
                <Input value={draft.companyName} onChange={(e) => setDraft({ ...draft, companyName: e.target.value })} />
              </Field>
              <Field label="Phone Number">
                <Input value={draft.phoneNumber} onChange={(e) => setDraft({ ...draft, phoneNumber: e.target.value })} />
              </Field>
              <Field label="Email Address">
                <Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </Field>
              <Field label="Physical Address">
                <Input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold text-[#1f2a24] text-base font-headline">Social Media Handles</h3>
              <p className="text-xs text-[#667085] mt-0.5">Configure public social links integration.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3 border-t border-[#f3efe7] pt-4">
              <Field label="Facebook">
                <Input value={draft.facebook} onChange={(e) => setDraft({ ...draft, facebook: e.target.value })} placeholder="https://facebook.com/..." />
              </Field>
              <Field label="Instagram">
                <Input value={draft.instagram} onChange={(e) => setDraft({ ...draft, instagram: e.target.value })} placeholder="https://instagram.com/..." />
              </Field>
              <Field label="LinkedIn">
                <Input value={draft.linkedin} onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })} placeholder="https://linkedin.com/..." />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold text-[#1f2a24] text-base font-headline">Visual Branding Assets</h3>
              <p className="text-xs text-[#667085] mt-0.5">Upload high-resolution images for the website headers and navigation.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 border-t border-[#f3efe7] pt-4">
              <Field label="Logo Upload">
                <Input
                  type="file"
                  accept="image/*"
                  className="py-1.5 px-3 h-10 border-[#d8d1c3] cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#efe9dd] file:text-[#1f2a24] hover:file:bg-[#e2d7c2] file:cursor-pointer transition-all"
                />
              </Field>
              <Field label="Favicon Upload">
                <Input
                  type="file"
                  accept="image/*"
                  className="py-1.5 px-3 h-10 border-[#d8d1c3] cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#efe9dd] file:text-[#1f2a24] hover:file:bg-[#e2d7c2] file:cursor-pointer transition-all"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="h-11 px-8 shadow-md">
            <Save className="h-4.5 w-4.5 mr-1" /> Save All Settings
          </Button>
        </div>
      </form>
    </>
  );
}
