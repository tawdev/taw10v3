'use client';

import { FormEvent, useState } from 'react';
import { Save } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, Input } from '@/components/ui/form';
import { useAdminStore } from '@/store/admin-store';
import { useToastStore } from '@/store/toast-store';
import { ImageUploadField } from '@/components/dashboard/ImageUploadField';

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
              <h3 className="font-bold text-white text-base font-headline">Company Profile</h3>
              <p className="text-xs text-white/50 mt-0.5">Primary information displayed on the website and client invoices.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 border-t border-white/10 pt-4">
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
              <h3 className="font-bold text-white text-base font-headline">Social Media Handles</h3>
              <p className="text-xs text-white/50 mt-0.5">Configure public social links integration.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3 border-t border-white/10 pt-4">
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
              <h3 className="font-bold text-white text-base font-headline">Visual Branding Assets</h3>
              <p className="text-xs text-white/50 mt-0.5">Upload high-resolution images for the website headers and navigation.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 border-t border-white/10 pt-4">
              <ImageUploadField
                value={draft.logoUrl || ''}
                onChange={(url) => setDraft({ ...draft, logoUrl: url })}
                label="Logo Upload"
              />
              <ImageUploadField
                value={draft.faviconUrl || ''}
                onChange={(url) => setDraft({ ...draft, faviconUrl: url })}
                label="Favicon Upload"
              />
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
