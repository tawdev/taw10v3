'use client';

import { FormEvent, useEffect, useState } from 'react';
import { MessageCircleQuestion, Plus, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
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

const emptyFaq = (sortOrder: number): FaqItem => ({
  id: crypto.randomUUID(),
  question: '',
  answer: '',
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

  useEffect(() => {
    faqService
      .list()
      .then((items) => {
        setFaq(items);
      })
      .catch(() => {
        toast({
          title: 'FAQ locale affichee',
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
      question: editing.question,
      answer: editing.answer,
      sortOrder: editing.sortOrder,
      isActive: editing.isActive,
    };
    const exists = faq.some((item) => item.id === editing.id);

    try {
      const saved = exists ? await faqService.update(editing.id, payload) : await faqService.create(payload);
      upsertFaq(saved);
      setEditing(null);
      toast({ title: 'FAQ sauvegardee', variant: 'success' });
    } catch {
      toast({
        title: 'Impossible de sauvegarder',
        description: 'Verifiez que la question existe et que le sort order est unique.',
        variant: 'destructive',
      });
    }
  }

  async function handleToggle(item: FaqItem) {
    try {
      const updated = await faqService.update(item.id, { isActive: !item.isActive });
      upsertFaq(updated);
      toast({ title: updated.isActive ? 'FAQ activee' : 'FAQ desactivee', variant: 'success' });
    } catch {
      toggleFaq(item.id);
      toast({ title: 'Statut mis a jour localement', variant: 'default' });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette question FAQ ?')) return;

    try {
      await faqService.delete(id);
      removeFaq(id);
      toast({ title: 'FAQ supprimee', variant: 'success' });
    } catch {
      toast({ title: 'Impossible de supprimer la FAQ', variant: 'destructive' });
    }
  }

  const sortedFaq = [...faq].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <PageHeader
        title="FAQ"
        description="Gestion dynamique des questions, reponses, ordre, statut et reactions client."
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
              <p className="mt-2 text-2xl font-semibold text-[#1f2a24]">{faq.length}</p>
            </div>
            <MessageCircleQuestion className="h-10 w-10 rounded-md bg-[#f1ede5] p-2 text-[#a68942]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">Likes</p>
              <p className="mt-2 text-2xl font-semibold text-[#1f2a24]">{faq.reduce((sum, item) => sum + (item.likeCount ?? 0), 0)}</p>
            </div>
            <ThumbsUp className="h-10 w-10 rounded-md bg-emerald-50 p-2 text-emerald-700" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">Dislikes</p>
              <p className="mt-2 text-2xl font-semibold text-[#1f2a24]">{faq.reduce((sum, item) => sum + (item.dislikeCount ?? 0), 0)}</p>
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
                <Th>Question</Th>
                <Th>Answer</Th>
                <Th>Feedback</Th>
                <Th className="w-28">Status</Th>
                <Th className="w-64">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <Td colSpan={6} className="text-center text-sm text-[#8a8172]">Loading FAQ...</Td>
                </tr>
              ) : null}
              {sortedFaq.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-[#faf9f6]/80">
                  <Td className="font-bold text-[#a68942]">{item.sortOrder}</Td>
                  <Td className="font-bold text-[#1f2a24]">{item.question}</Td>
                  <Td className="max-w-md break-words text-xs leading-relaxed text-[#667085]">{item.answer}</Td>
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

      <Dialog open={Boolean(editing)} title="FAQ Item" onClose={() => setEditing(null)}>
        {editing ? (
          <form onSubmit={save} className="grid gap-5">
            <Field label="Question">
              <Input
                value={editing.question}
                onChange={(event) => setEditing({ ...editing, question: event.target.value })}
                required
                placeholder="e.g. Quels documents sont necessaires ?"
              />
            </Field>

            <Field label="Answer">
              <Textarea
                value={editing.answer}
                onChange={(event) => setEditing({ ...editing, answer: event.target.value })}
                required
                placeholder="Write the detailed answer here..."
                className="min-h-32"
              />
            </Field>

            <div className="grid items-center gap-4 md:grid-cols-2">
              <Field label="Sort Order">
                <Input
                  type="number"
                  min={1}
                  value={editing.sortOrder}
                  onChange={(event) => setEditing({ ...editing, sortOrder: Number(event.target.value) })}
                  required
                />
              </Field>
              <label className="mt-5 flex cursor-pointer select-none items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#4f5b54]">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-[#d8d1c3] text-[#a68942] transition-all focus:ring-[#a68942]/30"
                  checked={editing.isActive}
                  onChange={(event) => setEditing({ ...editing, isActive: event.target.checked })}
                />
                Active FAQ Item
              </label>
            </div>

            <Button type="submit" className="mt-2 h-11 w-full">
              Save FAQ Item
            </Button>
          </form>
        ) : null}
      </Dialog>
    </>
  );
}
