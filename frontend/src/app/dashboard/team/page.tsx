'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Globe2, ImageIcon, Link2, Plus, Sparkles, Trash2, UploadCloud, UsersRound } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input, Textarea } from '@/components/ui/form';
import { Table, Td, Th } from '@/components/ui/table';
import { teamService, TeamMemberPayload } from '@/services/team.service';
import { TeamMember } from '@/types/admin';
import { ImageUploadField } from '@/components/dashboard/ImageUploadField';

type TeamLanguage = 'fr' | 'en' | 'ar';
const languages: Array<{ key: TeamLanguage; label: string }> = [
  { key: 'fr', label: 'FR' },
  { key: 'en', label: 'EN' },
  { key: 'ar', label: 'AR' },
];

const emptyMember = (): TeamMember => ({
  id: crypto.randomUUID(),
  name_fr: '',
  name_en: '',
  name_ar: '',
  role_fr: '',
  role_en: '',
  role_ar: '',
  description_fr: '',
  description_en: '',
  description_ar: '',
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

function getLocalizedValue(member: TeamMember, field: 'name' | 'role' | 'description', language: TeamLanguage) {
  return member[`${field}_${language}` as keyof TeamMember] as string;
}

function setLocalizedValue(member: TeamMember, field: 'name' | 'role' | 'description', language: TeamLanguage, value: string) {
  return { ...member, [`${field}_${language}`]: value };
}

function toPayload(member: TeamMember): TeamMemberPayload {
  const fallback = (field: 'name' | 'role' | 'description', language: TeamLanguage) => {
    const value = getLocalizedValue(member, field, language)?.trim();
    return value || getLocalizedValue(member, field, 'fr')?.trim() || '';
  };

  return {
    name_fr: fallback('name', 'fr'),
    name_en: fallback('name', 'en'),
    name_ar: fallback('name', 'ar'),
    role_fr: fallback('role', 'fr'),
    role_en: fallback('role', 'en'),
    role_ar: fallback('role', 'ar'),
    description_fr: fallback('description', 'fr'),
    description_en: fallback('description', 'en'),
    description_ar: fallback('description', 'ar'),
    imageUrl: member.imageUrl,
    sortOrder: Number(member.sortOrder),
    isActive: member.isActive,
  };
}

function TeamImage({ src, name, large = false }: { src: string; name: string; large?: boolean }) {
  const imageSrc = normalizeImageSrc(src);

  return (
    <div className={`${large ? 'h-72 w-full rounded-xl' : 'h-16 w-16 rounded-md'} relative overflow-hidden border border-white/10 bg-white/5 shadow-sm`}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={name || 'Team member'}
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

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<TeamLanguage>('fr');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    teamService
      .list()
      .then((items) => {
        if (mounted) setMembers(items);
      })
      .catch(() => {
        if (mounted) setError('Unable to load team members.');
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
      const exists = members.some((member) => member.id === editing.id);
      const saved = exists ? await teamService.update(editing.id, toPayload(editing)) : await teamService.create(toPayload(editing));
      setMembers((items) => [...items.filter((item) => item.id !== saved.id), saved].sort((a, b) => a.sortOrder - b.sortOrder));
      setEditing(null);
      setError(null);
    } catch {
      setError('Unable to save team member. Check sort order uniqueness.');
    }
  }

  async function deleteMember(id: string) {
    try {
      await teamService.delete(id);
      setMembers((items) => items.filter((item) => item.id !== id));
      setError(null);
    } catch {
      setError('Unable to delete team member.');
    }
  }

  async function toggleActive(member: TeamMember) {
    try {
      const updated = await teamService.update(member.id, { isActive: !member.isActive });
      setMembers((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      setError(null);
    } catch {
      setError('Unable to update team member status.');
    }
  }

  return (
    <>
      <PageHeader
        title="Team"
        description="Create, edit, delete and translate team members."
        actions={
          <Button onClick={() => { setEditing({ ...emptyMember(), sortOrder: members.length + 1 }); }}>
            <Plus className="h-4 w-4" />Create Member
          </Button>
        }
      />

      <Card>
        <CardContent className="overflow-x-auto p-0">
          {error ? <div className="p-4 text-sm font-semibold text-red-700">{error}</div> : null}
          <Table>
            <thead>
              <tr>
                <Th>Photo</Th>
                <Th>Name</Th>
                <Th>Role</Th>
                <Th>Order</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <Td colSpan={6} className="text-center text-sm text-white/50">Loading team...</Td>
                </tr>
              ) : null}
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-white/5 transition-colors">
                  <Td><TeamImage src={member.imageUrl} name={member.name_fr} /></Td>
                  <Td className="font-bold text-white">{member.name_fr}</Td>
                  <Td className="text-xs text-[#667085]">{member.role_fr}</Td>
                  <Td className="text-xs font-bold">{member.sortOrder}</Td>
                  <Td>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${member.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                      {member.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setEditing(member); }}>Edit</Button>
                      <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => toggleActive(member)}>
                        {member.isActive ? 'Hide' : 'Show'}
                      </Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => deleteMember(member.id)} title="Delete Member">
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
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a0f0c] text-[#dab055] shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>Team Member</span>
          </div>
        }
        className="max-w-3xl rounded-[1.25rem]"
        onClose={() => setEditing(null)}
      >
        {editing ? (
          <form onSubmit={save} className="grid gap-6">
            <div className="rounded-xl border border-white/10 bg-[#111111]/80 p-2 shadow-inner">
              <div className="grid grid-cols-3 gap-2">
                {languages.map((language) => (
                  <button
                    key={language.key}
                    type="button"
                    onClick={() => setActiveLanguage(language.key)}
                    className={`h-11 rounded-lg text-xs font-black tracking-[0.18em] transition-all ${
                      activeLanguage === language.key
                        ? 'bg-[#0a0f0c] text-white shadow-[0_0_15px_rgba(218,176,85,0.3)]'
                        : 'bg-white text-white/60 hover:bg-white/10 hover:text-white border border-[#eadfcb]'
                    }`}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            </div>

            <section className="rounded-xl border border-white/10 bg-[#111111]/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 border-b border-white/10 bg-[#111111]/80 px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a0f0c] text-[#dab055] shadow-sm">
                  <Globe2 className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">Identity</h3>
              </div>
              <div className="grid gap-5 p-5">
                <Field label={`Name ${activeLanguage.toUpperCase()}`}>
                  <Input
                    dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                    value={getLocalizedValue(editing, 'name', activeLanguage)}
                    onChange={(event) => setEditing(setLocalizedValue(editing, 'name', activeLanguage, event.target.value))}
                    required={activeLanguage === 'fr'}
                    className="h-12 rounded-xl border-white/10 focus:border-[#dab055] bg-white/5 text-white placeholder-white/20 px-4 text-[15px] font-semibold shadow-lg"
                  />
                </Field>
                <Field label={`Role ${activeLanguage.toUpperCase()}`}>
                  <Input
                    dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                    value={getLocalizedValue(editing, 'role', activeLanguage)}
                    onChange={(event) => setEditing(setLocalizedValue(editing, 'role', activeLanguage, event.target.value))}
                    required={activeLanguage === 'fr'}
                    className="h-12 rounded-xl border-white/10 focus:border-[#dab055] bg-white/5 text-white placeholder-white/20 px-4 text-[15px] font-semibold shadow-lg"
                  />
                </Field>
                <Field label={`Description ${activeLanguage.toUpperCase()}`}>
                  <Textarea
                    dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                    value={getLocalizedValue(editing, 'description', activeLanguage)}
                    onChange={(event) => setEditing(setLocalizedValue(editing, 'description', activeLanguage, event.target.value))}
                    required={activeLanguage === 'fr'}
                    className="min-h-32 rounded-xl border-white/10 focus:border-[#dab055] bg-white/5 text-white placeholder-white/20 px-4 py-3 text-[15px] leading-relaxed shadow-lg"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-xl border border-white/10 bg-[#111111]/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 border-b border-white/10 bg-[#111111]/80 px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a0f0c] text-[#dab055] shadow-sm">
                  <UsersRound className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">Profile</h3>
              </div>
              <div className="grid gap-5 p-5">
                <TeamImage src={editing.imageUrl} name={getLocalizedValue(editing, 'name', activeLanguage)} large />
                <ImageUploadField
                  value={editing.imageUrl}
                  onChange={(url) => setEditing({ ...editing, imageUrl: url })}
                  label="Image URL"
                  required
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Order">
                    <Input
                      type="number"
                      min={1}
                      value={editing.sortOrder}
                      onChange={(event) => setEditing({ ...editing, sortOrder: Number(event.target.value) })}
                      required
                      className="h-12 rounded-xl border-white/10 focus:border-[#dab055] bg-white/5 text-white placeholder-white/20 px-4 font-semibold shadow-lg"
                    />
                  </Field>
                  <Field label="Visible">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, isActive: !editing.isActive })}
                      className={`h-12 rounded-xl border px-4 text-xs font-black uppercase tracking-wider transition ${
                        editing.isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-stone-200 bg-stone-100 text-stone-500'
                      }`}
                    >
                      {editing.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </Field>
                </div>
              </div>
            </section>

            <Button type="submit" className="h-12 w-full rounded-xl bg-[#0a0f0c] text-sm font-black uppercase tracking-[0.2em] shadow-[0_16px_35px_rgba(31,42,36,0.24)] hover:bg-[#2b3a32]">
              Save Member
            </Button>
          </form>
        ) : null}
      </Dialog>
    </>
  );
}
