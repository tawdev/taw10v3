'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Eye, EyeOff, Globe2, ImageIcon, Plus, Sparkles, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input, Textarea } from '@/components/ui/form';
import { Table, Td, Th } from '@/components/ui/table';
import { servicesService, ServiceOfferingPayload } from '@/services/services.service';
import { ServiceOffering } from '@/types/admin';

type ServiceLanguage = 'fr' | 'en' | 'ar';

const languages: Array<{ key: ServiceLanguage; label: string }> = [
  { key: 'fr', label: 'FR' },
  { key: 'en', label: 'EN' },
  { key: 'ar', label: 'AR' },
];

const emptyService = (): ServiceOffering => ({
  id: crypto.randomUUID(),
  slug: '',
  title_fr: '',
  title_en: '',
  title_ar: '',
  description_fr: '',
  description_en: '',
  description_ar: '',
  icon: 'sparkles',
  imageUrl: '',
  sortOrder: 1,
  isActive: true,
});

function normalizeImageSrc(src: string) {
  const value = src.trim();
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) return value;
  return `/${value}`;
}

function getLocalizedValue(service: ServiceOffering, field: 'title' | 'description', language: ServiceLanguage) {
  return service[`${field}_${language}` as keyof ServiceOffering] as string;
}

function setLocalizedValue(service: ServiceOffering, field: 'title' | 'description', language: ServiceLanguage, value: string) {
  return { ...service, [`${field}_${language}`]: value };
}

function toPayload(service: ServiceOffering): ServiceOfferingPayload {
  const fallback = (field: 'title' | 'description', language: ServiceLanguage) => {
    const value = getLocalizedValue(service, field, language)?.trim();
    return value || getLocalizedValue(service, field, 'fr')?.trim() || '';
  };

  return {
    slug: service.slug.trim(),
    title_fr: fallback('title', 'fr'),
    title_en: fallback('title', 'en'),
    title_ar: fallback('title', 'ar'),
    description_fr: fallback('description', 'fr'),
    description_en: fallback('description', 'en'),
    description_ar: fallback('description', 'ar'),
    icon: service.icon.trim(),
    imageUrl: service.imageUrl.trim(),
    sortOrder: Number(service.sortOrder),
    isActive: service.isActive,
  };
}

function ServiceImage({ src, title, large = false }: { src: string; title: string; large?: boolean }) {
  const imageSrc = normalizeImageSrc(src);

  return (
    <div className={`${large ? 'h-56 w-full rounded-xl' : 'h-16 w-24 rounded-md'} relative overflow-hidden border border-[#e7decc] bg-[#faf8f5] shadow-sm`}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={title || 'Service image'}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ) : null}
      {large ? <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111b16]/45 via-transparent to-transparent" /> : null}
      <div className="absolute inset-0 -z-10 flex items-center justify-center text-[#a68942]">
        <ImageIcon className={large ? 'h-8 w-8' : 'h-5 w-5'} />
      </div>
    </div>
  );
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [editing, setEditing] = useState<ServiceOffering | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<ServiceLanguage>('fr');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    servicesService
      .list()
      .then((items) => {
        if (mounted) setServices(items);
      })
      .catch(() => {
        if (mounted) setError('Unable to load services.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    try {
      const exists = services.some((service) => service.id === editing.id);
      const saved = exists ? await servicesService.update(editing.id, toPayload(editing)) : await servicesService.create(toPayload(editing));
      setServices((items) => [...items.filter((item) => item.id !== saved.id), saved].sort((a, b) => a.sortOrder - b.sortOrder));
      setEditing(null);
      setError(null);
    } catch {
      setError('Unable to save service. Check slug and sort order uniqueness.');
    }
  }

  async function deleteService(id: string) {
    try {
      await servicesService.delete(id);
      setServices((items) => items.filter((item) => item.id !== id));
      setError(null);
    } catch {
      setError('Unable to delete service.');
    }
  }

  async function toggleActive(service: ServiceOffering) {
    try {
      const updated = await servicesService.update(service.id, { isActive: !service.isActive });
      setServices((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      setError(null);
    } catch {
      setError('Unable to update service status.');
    }
  }

  return (
    <>
      <PageHeader
        title="Services"
        description="Manage expertise services, images and multilingual content."
        actions={
          <Button onClick={() => setEditing({ ...emptyService(), sortOrder: services.length + 1 })}>
            <Plus className="h-4 w-4" />Create Service
          </Button>
        }
      />

      <Card>
        <CardContent className="overflow-x-auto p-0">
          {error ? <div className="p-4 text-sm font-semibold text-red-700">{error}</div> : null}
          <Table>
            <thead>
              <tr>
                <Th>Image</Th>
                <Th>Title</Th>
                <Th>Slug</Th>
                <Th>Icon</Th>
                <Th>Order</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <Td colSpan={7} className="text-center text-sm text-[#8a8172]">Loading services...</Td>
                </tr>
              ) : null}
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-[#faf9f6]/80 transition-colors">
                  <Td><ServiceImage src={service.imageUrl} title={service.title_fr} /></Td>
                  <Td className="font-bold text-[#1f2a24]">{service.title_fr}</Td>
                  <Td className="text-xs font-semibold text-[#8a8172]">{service.slug}</Td>
                  <Td className="text-xs text-[#667085]">{service.icon}</Td>
                  <Td className="text-xs font-bold">{service.sortOrder}</Td>
                  <Td>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${service.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                      {service.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setEditing(service)}>Edit</Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => toggleActive(service)} title={service.isActive ? 'Hide' : 'Show'}>
                        {service.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => deleteService(service.id)} title="Delete Service">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(editing)}
        title={
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f2a24] text-[#dab055] shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>Service</span>
          </div>
        }
        className="max-w-3xl rounded-[1.25rem]"
        onClose={() => setEditing(null)}
      >
        {editing ? (
          <form onSubmit={save} className="grid gap-6">
            <div className="rounded-xl border border-[#e7decc] bg-[#fbf7ee] p-2 shadow-inner">
              <div className="grid grid-cols-3 gap-2">
                {languages.map((language) => (
                  <button
                    key={language.key}
                    type="button"
                    onClick={() => setActiveLanguage(language.key)}
                    className={`h-11 rounded-lg text-xs font-black tracking-[0.18em] transition-all ${
                      activeLanguage === language.key
                        ? 'bg-[#1f2a24] text-white shadow-[0_10px_25px_rgba(31,42,36,0.22)]'
                        : 'bg-white text-[#6b6255] hover:bg-[#f5eee0] hover:text-[#1f2a24] border border-[#eadfcb]'
                    }`}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            </div>

            <section className="rounded-xl border border-[#e7decc] bg-white shadow-[0_14px_40px_rgba(31,42,36,0.06)] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[#efe7d7] bg-[#fbf7ee] px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f2a24] text-[#dab055] shadow-sm">
                  <Globe2 className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#1f2a24]">Content</h3>
              </div>
              <div className="grid gap-5 p-5">
                <Field label={`Title ${activeLanguage.toUpperCase()}`}>
                  <Input
                    dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                    value={getLocalizedValue(editing, 'title', activeLanguage)}
                    onChange={(event) => setEditing(setLocalizedValue(editing, 'title', activeLanguage, event.target.value))}
                    required={activeLanguage === 'fr'}
                    className="h-12 rounded-xl border-[#d9caa9] bg-[#fffdf8] px-4 text-[15px] font-semibold shadow-[0_10px_25px_rgba(31,42,36,0.05)]"
                  />
                </Field>
                <Field label={`Description ${activeLanguage.toUpperCase()}`}>
                  <Textarea
                    dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                    value={getLocalizedValue(editing, 'description', activeLanguage)}
                    onChange={(event) => setEditing(setLocalizedValue(editing, 'description', activeLanguage, event.target.value))}
                    required={activeLanguage === 'fr'}
                    className="min-h-32 rounded-xl border-[#d9caa9] bg-[#fffdf8] px-4 py-3 text-[15px] leading-relaxed shadow-[0_10px_25px_rgba(31,42,36,0.05)]"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-xl border border-[#e7decc] bg-white shadow-[0_14px_40px_rgba(31,42,36,0.06)] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[#efe7d7] bg-[#fbf7ee] px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f2a24] text-[#dab055] shadow-sm">
                  <ImageIcon className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#1f2a24]">Media & Display</h3>
              </div>
              <div className="grid gap-5 p-5">
                <ServiceImage src={editing.imageUrl} title={getLocalizedValue(editing, 'title', activeLanguage)} large />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Slug">
                    <Input value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: event.target.value })} required className="h-12 rounded-xl border-[#d9caa9] bg-[#fffdf8] px-4 font-semibold" />
                  </Field>
                  <Field label="Icon">
                    <Input value={editing.icon} onChange={(event) => setEditing({ ...editing, icon: event.target.value })} required className="h-12 rounded-xl border-[#d9caa9] bg-[#fffdf8] px-4 font-semibold" />
                  </Field>
                  <Field label="Image URL">
                    <Input value={editing.imageUrl} onChange={(event) => setEditing({ ...editing, imageUrl: event.target.value })} required className="h-12 rounded-xl border-[#d9caa9] bg-[#fffdf8] px-4 font-semibold" />
                  </Field>
                  <Field label="Order">
                    <Input type="number" min={1} value={editing.sortOrder} onChange={(event) => setEditing({ ...editing, sortOrder: Number(event.target.value) })} required className="h-12 rounded-xl border-[#d9caa9] bg-[#fffdf8] px-4 font-semibold" />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, isActive: !editing.isActive })}
                  className={`h-12 rounded-xl border px-4 text-xs font-black uppercase tracking-wider transition ${
                    editing.isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-stone-200 bg-stone-100 text-stone-500'
                  }`}
                >
                  {editing.isActive ? 'Active' : 'Hidden'}
                </button>
              </div>
            </section>

            <Button type="submit" className="h-12 w-full rounded-xl bg-[#1f2a24] text-sm font-black uppercase tracking-[0.2em] shadow-[0_16px_35px_rgba(31,42,36,0.24)] hover:bg-[#2b3a32]">
              Save Service
            </Button>
          </form>
        ) : null}
      </Dialog>
    </>
  );
}
