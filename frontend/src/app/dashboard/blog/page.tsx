'use client';

import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { CalendarDays, Globe2, ImageIcon, Plus, Search, Sparkles, Trash2, type LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PublishBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input, Textarea } from '@/components/ui/form';
import { Table, Td, Th } from '@/components/ui/table';
import { blogService, ArticlePayload } from '@/services/blog.service';
import { BlogArticle } from '@/types/admin';
import { ImageUploadField } from '@/components/dashboard/ImageUploadField';

type BlogLanguage = 'fr' | 'en' | 'ar';

const languages: Array<{ key: BlogLanguage; label: string }> = [
  { key: 'fr', label: 'FR' },
  { key: 'en', label: 'EN' },
  { key: 'ar', label: 'AR' },
];

const today = () => new Date().toISOString().slice(0, 10);

const emptyArticle = (): BlogArticle => ({
  id: crypto.randomUUID(),
  title: '',
  title_fr: '',
  title_en: '',
  title_ar: '',
  slug: '',
  featuredImage: '',
  excerpt: '',
  excerpt_fr: '',
  excerpt_en: '',
  excerpt_ar: '',
  content: '',
  content_fr: '',
  content_en: '',
  content_ar: '',
  metaTitle: '',
  metaTitle_fr: '',
  metaTitle_en: '',
  metaTitle_ar: '',
  metaDescription: '',
  metaDescription_fr: '',
  metaDescription_en: '',
  metaDescription_ar: '',
  status: 'DRAFT',
  publishedAt: today(),
  createdAt: today(),
});

function formatDate(value?: string | null) {
  return value ? value.slice(0, 10) : '';
}

function normalizeImageSrc(src: string) {
  const value = src.trim();
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) return value;
  return `/${value}`;
}

function BlogImagePreview({ src, title, size = 'table' }: { src: string; title: string; size?: 'table' | 'form' }) {
  const imageSrc = normalizeImageSrc(src);
  const isForm = size === 'form';

  return (
    <div className={`${isForm ? 'h-56 w-full rounded-xl border-white/10 focus:border-[#dab055] shadow-2xl' : 'h-16 w-24 rounded-md border-white/10'} relative overflow-hidden border bg-white/5`}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={title ? `${title} featured image` : 'Blog featured image'}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ) : null}
      {isForm ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111b16]/45 via-transparent to-transparent" />
      ) : null}
      <div className="absolute inset-0 -z-10 flex items-center justify-center text-[#a68942]">
        <ImageIcon className={isForm ? 'h-8 w-8' : 'h-5 w-5'} />
      </div>
    </div>
  );
}

function FormSection({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[#d8d1c3]/60 bg-[#fcfbf9] shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[#d8d1c3]/60 bg-[#f1ede5] px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a0f0c] text-[#dab055] shadow-sm">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#1f2a24]">{title}</h3>
      </div>
      <div className="grid gap-5 p-5">{children}</div>
    </section>
  );
}

function getLocalizedValue(article: BlogArticle, field: 'title' | 'excerpt' | 'content' | 'metaTitle' | 'metaDescription', language: BlogLanguage) {
  const key = `${field}_${language}` as keyof BlogArticle;
  const value = article[key];
  return typeof value === 'string' ? value : article[field] || '';
}

function setLocalizedValue(
  article: BlogArticle,
  field: 'title' | 'excerpt' | 'content' | 'metaTitle' | 'metaDescription',
  language: BlogLanguage,
  value: string,
) {
  const key = `${field}_${language}` as keyof BlogArticle;
  const next = { ...article, [key]: value };

  if (language === 'fr') {
    return { ...next, [field]: value };
  }

  return next;
}

function translatedPayload(article: BlogArticle) {
  const fallback = (field: 'title' | 'excerpt' | 'content' | 'metaTitle' | 'metaDescription', language: BlogLanguage) => {
    const value = getLocalizedValue(article, field, language).trim();
    return value || getLocalizedValue(article, field, 'fr').trim();
  };

  return {
    title_fr: fallback('title', 'fr'),
    title_en: fallback('title', 'en'),
    title_ar: fallback('title', 'ar'),
    slug: article.slug,
    featuredImage: article.featuredImage,
    excerpt_fr: fallback('excerpt', 'fr'),
    excerpt_en: fallback('excerpt', 'en'),
    excerpt_ar: fallback('excerpt', 'ar'),
    content_fr: fallback('content', 'fr'),
    content_en: fallback('content', 'en'),
    content_ar: fallback('content', 'ar'),
    metaTitle_fr: fallback('metaTitle', 'fr'),
    metaTitle_en: fallback('metaTitle', 'en'),
    metaTitle_ar: fallback('metaTitle', 'ar'),
    metaDescription_fr: fallback('metaDescription', 'fr'),
    metaDescription_en: fallback('metaDescription', 'en'),
    metaDescription_ar: fallback('metaDescription', 'ar'),
    status: article.status,
    publishedAt: formatDate(article.publishedAt) || null,
  };
}

export default function BlogPage() {
  const [blog, setBlog] = useState<BlogArticle[]>([]);
  const [editing, setEditing] = useState<BlogArticle | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<BlogLanguage>('fr');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    blogService
      .list()
      .then((articles) => {
        if (isMounted) setBlog(articles);
      })
      .catch(() => {
        if (isMounted) setError('Unable to load blog articles.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editing) {
      const payload = translatedPayload(editing);

      try {
        const saved = blog.some((article) => article.id === editing.id)
          ? await blogService.update(editing.id, payload)
          : await blogService.create(payload);
        setBlog((articles) => [saved, ...articles.filter((article) => article.id !== saved.id)]);
        setEditing(null);
        setError(null);
      } catch {
        setError('Unable to save blog article.');
      }
    }
  }

  async function deleteArticle(id: string) {
    try {
      await blogService.delete(id);
      setBlog((articles) => articles.filter((article) => article.id !== id));
      setError(null);
    } catch {
      setError('Unable to delete blog article.');
    }
  }

  async function toggleArticleStatus(article: BlogArticle) {
    const nextStatus = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const updated = await blogService.update(article.id, {
        status: nextStatus,
        publishedAt: nextStatus === 'PUBLISHED' ? formatDate(article.publishedAt) || today() : article.publishedAt,
      });
      setBlog((articles) => articles.map((item) => (item.id === updated.id ? updated : item)));
      setError(null);
    } catch {
      setError('Unable to update article status.');
    }
  }

  return (
    <>
      <PageHeader
        title="Blog"
        description="Create, edit, delete, publish and draft articles."
        actions={
          <Button onClick={() => setEditing(emptyArticle())}>
            <Plus className="h-4 w-4" />Create Article
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
                <Th>Meta Title</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <Td colSpan={7} className="text-center text-sm text-white/50">Loading articles...</Td>
                </tr>
              ) : null}
              {blog.map((article) => (
                <tr key={article.id} className="hover:bg-white/5 transition-colors">
                  <Td>
                    <BlogImagePreview src={article.featuredImage} title={getLocalizedValue(article, 'title', 'fr')} />
                  </Td>
                  <Td className="font-bold text-white">{getLocalizedValue(article, 'title', 'fr')}</Td>
                  <Td className="text-xs font-semibold text-white/50">{article.slug}</Td>
                  <Td className="text-xs text-[#667085]">{article.metaTitle}</Td>
                  <Td>
                    <PublishBadge status={article.status} />
                  </Td>
                  <Td className="text-xs">{formatDate(article.publishedAt ?? article.createdAt)}</Td>
                  <Td>
                    <div className="flex gap-1.5 items-center">
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setEditing(article)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 text-xs"
                        onClick={() => toggleArticleStatus(article)}
                      >
                        {article.status === 'PUBLISHED' ? 'Draft' : 'Publish'}
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => deleteArticle(article.id)}
                        title="Delete Article"
                      >
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
            <span>Blog Article</span>
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

            <FormSection icon={Globe2} title="Editorial">
              <Field label={`Title ${activeLanguage.toUpperCase()}`}>
                <Input
                  dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                  value={getLocalizedValue(editing, 'title', activeLanguage)}
                  onChange={(e) => setEditing(setLocalizedValue(editing, 'title', activeLanguage, e.target.value))}
                  required={activeLanguage === 'fr'}
                  placeholder="e.g. 5 steps to domiciliate your business in Marrakech"
                  className="h-12 rounded-xl border-[#d8d1c3] focus:border-[#dab055] bg-white text-[#1f2a24] placeholder-[#a29b8f]/70 px-4 text-[15px] font-semibold shadow-sm focus:ring-2 focus:ring-[#dab055]/15 focus:ring-offset-0"
                />
              </Field>

              <Field label={`Excerpt ${activeLanguage.toUpperCase()}`}>
                <Textarea
                  dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                  value={getLocalizedValue(editing, 'excerpt', activeLanguage)}
                  onChange={(e) => setEditing(setLocalizedValue(editing, 'excerpt', activeLanguage, e.target.value))}
                  required={activeLanguage === 'fr'}
                  placeholder="Short summary shown on blog cards..."
                  className="min-h-28 rounded-xl border-[#d8d1c3] focus:border-[#dab055] bg-white text-[#1f2a24] placeholder-[#a29b8f]/70 px-4 py-3 text-[15px] leading-relaxed shadow-sm focus:ring-2 focus:ring-[#dab055]/15 focus:ring-offset-0"
                />
              </Field>

              <Field label="Content">
                <Textarea
                  dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                  value={getLocalizedValue(editing, 'content', activeLanguage)}
                  onChange={(e) => setEditing(setLocalizedValue(editing, 'content', activeLanguage, e.target.value))}
                  placeholder="Write your article content here..."
                  className="min-h-56 rounded-xl border-[#d8d1c3] focus:border-[#dab055] bg-white text-[#1f2a24] placeholder-[#a29b8f]/70 px-4 py-3 text-[15px] leading-7 shadow-sm focus:ring-2 focus:ring-[#dab055]/15 focus:ring-offset-0"
                />
              </Field>
            </FormSection>

            <FormSection icon={ImageIcon} title="Media">
              <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                <Field label="Slug">
                  <Input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    required
                    placeholder="e.g. steps-to-domiciliate-business-marrakech"
                    className="h-12 rounded-xl border-[#d8d1c3] focus:border-[#dab055] bg-white text-[#1f2a24] placeholder-[#a29b8f]/70 px-4 font-semibold shadow-sm focus:ring-2 focus:ring-[#dab055]/15 focus:ring-offset-0"
                  />
                </Field>
                <ImageUploadField
                  value={editing.featuredImage}
                  onChange={(url) => setEditing({ ...editing, featuredImage: url })}
                  label="Featured Image URL"
                />
              </div>

              <BlogImagePreview src={editing.featuredImage} title={getLocalizedValue(editing, 'title', activeLanguage)} size="form" />

              <Field label="Published Date">
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a68942]" />
                  <Input
                    type="date"
                    value={formatDate(editing.publishedAt)}
                    onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value })}
                    className="h-12 rounded-xl border-[#d8d1c3] focus:border-[#dab055] bg-white text-[#1f2a24] placeholder-[#a29b8f]/70 pl-11 pr-4 font-semibold shadow-sm focus:ring-2 focus:ring-[#dab055]/15 focus:ring-offset-0"
                  />
                </div>
              </Field>
            </FormSection>

            <FormSection icon={Search} title="SEO">
              <Field label={`Meta Title ${activeLanguage.toUpperCase()}`}>
                <Input
                  dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                  value={getLocalizedValue(editing, 'metaTitle', activeLanguage)}
                  onChange={(e) => setEditing(setLocalizedValue(editing, 'metaTitle', activeLanguage, e.target.value))}
                  placeholder="SEO Search result title"
                  className="h-12 rounded-xl border-[#d8d1c3] focus:border-[#dab055] bg-white text-[#1f2a24] placeholder-[#a29b8f]/70 px-4 font-semibold shadow-sm focus:ring-2 focus:ring-[#dab055]/15 focus:ring-offset-0"
                />
              </Field>
              <Field label={`Meta Description ${activeLanguage.toUpperCase()}`}>
                <Textarea
                  dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                  value={getLocalizedValue(editing, 'metaDescription', activeLanguage)}
                  onChange={(e) => setEditing(setLocalizedValue(editing, 'metaDescription', activeLanguage, e.target.value))}
                  placeholder="SEO Search result snippet..."
                  className="min-h-28 rounded-xl border-[#d8d1c3] focus:border-[#dab055] bg-white text-[#1f2a24] placeholder-[#a29b8f]/70 px-4 py-3 text-[15px] leading-relaxed shadow-sm focus:ring-2 focus:ring-[#dab055]/15 focus:ring-offset-0"
                />
              </Field>
            </FormSection>

            <Button type="submit" className="h-12 w-full rounded-xl bg-[#0a0f0c] text-sm font-black uppercase tracking-[0.2em] shadow-[0_16px_35px_rgba(31,42,36,0.24)] hover:bg-[#2b3a32]">
              Save Article
            </Button>
          </form>
        ) : null}
      </Dialog>
    </>
  );
}
