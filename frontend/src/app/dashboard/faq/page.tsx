'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Globe2, MessageCircleQuestion, Plus, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ActiveBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input, Textarea } from '@/components/ui/form';
import { Table, Td, Th } from '@/components/ui/table';
import { faqService } from '@/services/faq.service';
import { useAdminStore } from '@/store/admin-store';
import { useToastStore } from '@/store/toast-store';
import { FaqItem } from '@/types/admin';

const languages = [
  { key: 'fr', label: 'FRANÇAIS' },
  { key: 'en', label: 'ENGLISH' },
  { key: 'ar', label: 'العربية' },
] as const;

type Language = typeof languages[number]['key'];

const getLocalizedValue = (item: any, field: string, lang: Language) => {
  return item[`${field}_${lang}`] || '';
};

const setLocalizedValue = (item: any, field: string, lang: Language, value: string) => {
  return { ...item, [`${field}_${lang}`]: value };
};

const emptyFaq = (sortOrder: number): FaqItem => ({
  id: crypto.randomUUID(),
  question_fr: '',
  question_en: '',
  question_ar: '',
  answer_fr: '',
  answer_en: '',
  answer_ar: '',
  sortOrder,
  isActive: true,
  likeCount: 0,
  dislikeCount: 0,
});

export default function FaqPage() {
  const { faq, setFaq, upsertFaq, removeFaq, toggleFaq } = useAdminStore();
  const toast = useToastStore((state) => state.toast);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLanguage, setActiveLanguage] = useState<Language>('fr');

  useEffect(() => {
    faqService
      .list()
      .then((items) => {
        setFaq(items);
      })
      .catch(() => {
        toast({
          title: 'FAQ locale affichée',
          description: "Impossible de synchroniser la FAQ depuis l'API.",
          variant: 'default',
        });
      })
      .finally(() => setIsLoading(false));
  }, [setFaq, toast]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    const payload = {
      question_fr: editing.question_fr,
      question_en: editing.question_en,
      question_ar: editing.question_ar,
      answer_fr: editing.answer_fr,
      answer_en: editing.answer_en,
      answer_ar: editing.answer_ar,
      sortOrder: editing.sortOrder,
      isActive: editing.isActive,
    };
    const exists = faq.some((item) => item.id === editing.id);

    try {
      const saved = exists ? await faqService.update(editing.id, payload) : await faqService.create(payload);
      upsertFaq(saved);
      setEditing(null);
      toast({ title: 'FAQ sauvegardée', variant: 'success' });
    } catch {
      toast({
        title: 'Impossible de sauvegarder',
        description: 'Vérifiez que la question existe et que le sort order est unique.',
        variant: 'destructive',
      });
    }
  }

  async function handleToggle(item: FaqItem) {
    try {
      const updated = await faqService.update(item.id, { isActive: !item.isActive });
      upsertFaq(updated);
      toast({ title: updated.isActive ? 'FAQ activée' : 'FAQ désactivée', variant: 'success' });
    } catch {
      toggleFaq(item.id);
      toast({ title: 'Statut mis à jour localement', variant: 'default' });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette question FAQ ?')) return;

    try {
      await faqService.delete(id);
      removeFaq(id);
      toast({ title: 'FAQ supprimée', variant: 'success' });
    } catch {
      toast({ title: 'Impossible de supprimer la FAQ', variant: 'destructive' });
    }
  }

  const sortedFaq = [...faq].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <PageHeader
        title="FAQ"
        description="Gestion dynamique des questions, réponses, ordre, statut et réactions client en multi-langue."
        actions={
          <Button onClick={() => setEditing(emptyFaq(sortedFaq.length + 1))}>
            <Plus className="h-4 w-4" />Create FAQ
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">Questions</p>
              <p className="mt-2 text-2xl font-semibold text-white">{faq.length}</p>
            </div>
            <MessageCircleQuestion className="h-10 w-10 rounded-md bg-[#f1ede5] p-2 text-[#a68942]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">Likes</p>
              <p className="mt-2 text-2xl font-semibold text-white">{faq.reduce((sum, item) => sum + (item.likeCount ?? 0), 0)}</p>
            </div>
            <ThumbsUp className="h-10 w-10 rounded-md bg-emerald-50 p-2 text-emerald-700" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">Dislikes</p>
              <p className="mt-2 text-2xl font-semibold text-white">{faq.reduce((sum, item) => sum + (item.dislikeCount ?? 0), 0)}</p>
            </div>
            <ThumbsDown className="h-10 w-10 rounded-md bg-red-50 p-2 text-red-700" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <thead>
              <tr>
                <Th className="w-20">Sort</Th>
                <Th>Question (FR)</Th>
                <Th>Answer (FR)</Th>
                <Th>Feedback</Th>
                <Th className="w-28">Status</Th>
                <Th className="w-64">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <Td colSpan={6} className="text-center text-sm text-white/50">Loading FAQ...</Td>
                </tr>
              ) : null}
              {sortedFaq.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-white/5">
                  <Td className="font-bold text-[#a68942]">{item.sortOrder}</Td>
                  <Td className="font-bold text-white">{item.question_fr}</Td>
                  <Td className="max-w-md break-words text-xs leading-relaxed text-[#667085]">{item.answer_fr}</Td>
                  <Td>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                        <ThumbsUp className="h-3 w-3" />{item.likeCount ?? 0}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-red-700">
                        <ThumbsDown className="h-3 w-3" />{item.dislikeCount ?? 0}
                      </span>
                    </div>
                  </Td>
                  <Td><ActiveBadge active={item.isActive} /></Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setEditing(item)}>Edit</Button>
                      <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => handleToggle(item)}>
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(item.id)} title="Delete FAQ">
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
              <MessageCircleQuestion className="h-4 w-4" />
            </span>
            <span>FAQ Item</span>
          </div>
        } 
        className="max-w-3xl rounded-[1.25rem]"
        onClose={() => setEditing(null)}
      >
        {editing ? (
          <form onSubmit={save} className="grid gap-6">
            <div className="rounded-xl border border-[#d8d1c3]/60 bg-[#faf8f5] p-2 shadow-inner">
              <div className="grid grid-cols-3 gap-2">
                {languages.map((language) => (
                  <button
                    key={language.key}
                    type="button"
                    onClick={() => setActiveLanguage(language.key)}
                    className={`h-11 rounded-lg text-xs font-black tracking-[0.18em] transition-all ${
                      activeLanguage === language.key
                        ? 'bg-[#0a0f0c] text-white shadow-[0_0_15px_rgba(218,176,85,0.3)]'
                        : 'bg-white text-[#6b6255] hover:bg-[#faf8f5] hover:text-[#1f2a24] border border-[#eadfcb]'
                    }`}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            </div>

            <section className="rounded-xl border border-[#d8d1c3]/60 bg-[#fcfbf9] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[#d8d1c3]/60 bg-[#f1ede5] px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a0f0c] text-[#dab055] shadow-sm">
                  <Globe2 className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#1f2a24]">Content</h3>
              </div>
              <div className="grid gap-5 p-5">
                <Field label={`Question ${activeLanguage.toUpperCase()}`}>
                  <Input
                    dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                    value={getLocalizedValue(editing, 'question', activeLanguage)}
                    onChange={(event) => setEditing(setLocalizedValue(editing, 'question', activeLanguage, event.target.value))}
                    required={activeLanguage === 'fr'}
                    className="h-12 rounded-xl border-[#d8d1c3] focus:border-[#dab055] bg-white text-[#1f2a24] placeholder-[#a29b8f]/70 px-4 text-[15px] font-semibold shadow-sm focus:ring-2 focus:ring-[#dab055]/15 focus:ring-offset-0"
                  />
                </Field>
                <Field label={`Answer ${activeLanguage.toUpperCase()}`}>
                  <Textarea
                    dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                    value={getLocalizedValue(editing, 'answer', activeLanguage)}
                    onChange={(event) => setEditing(setLocalizedValue(editing, 'answer', activeLanguage, event.target.value))}
                    required={activeLanguage === 'fr'}
                    className="min-h-32 rounded-xl border-[#d8d1c3] focus:border-[#dab055] bg-white text-[#1f2a24] placeholder-[#a29b8f]/70 px-4 py-3 text-[15px] leading-relaxed shadow-sm focus:ring-2 focus:ring-[#dab055]/15 focus:ring-offset-0"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-xl border border-[#d8d1c3]/60 bg-[#fcfbf9] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[#d8d1c3]/60 bg-[#f1ede5] px-5 py-4">
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#1f2a24]">Settings</h3>
              </div>
              <div className="grid gap-5 p-5 md:grid-cols-2">
                <Field label="Sort Order">
                  <Input
                    type="number"
                    min={1}
                    value={editing.sortOrder}
                    onChange={(event) => setEditing({ ...editing, sortOrder: Number(event.target.value) })}
                    required
                    className="h-12 rounded-xl border-[#d8d1c3] focus:border-[#dab055] bg-white text-[#1f2a24] placeholder-[#a29b8f]/70 px-4 font-semibold shadow-sm focus:ring-2 focus:ring-[#dab055]/15 focus:ring-offset-0"
                  />
                </Field>
                <div className="flex items-center pt-8">
                  <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#4f5b54]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer rounded border-[#d8d1c3] text-[#a68942] transition-all focus:ring-[#a68942]/30"
                      checked={editing.isActive}
                      onChange={(event) => setEditing({ ...editing, isActive: event.target.checked })}
                    />
                    Active FAQ Item
                  </label>
                </div>
              </div>
            </section>

            <Button type="submit" className="h-12 w-full rounded-xl bg-[#0a0f0c] text-sm font-black uppercase tracking-[0.2em] shadow-[0_16px_35px_rgba(31,42,36,0.24)] hover:bg-[#2b3a32]">
              Save FAQ Item
            </Button>
          </form>
        ) : null}
      </Dialog>
    </>
  );
}
