import { BlogArticle } from '@/types/admin';
import { http } from './http';

export type BlogArticlePayload = {
  title_fr: string;
  title_en: string;
  title_ar: string;
  slug: string;
  featuredImage: string;
  excerpt_fr: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_fr: string;
  content_en: string;
  content_ar: string;
  metaTitle_fr: string;
  metaTitle_en: string;
  metaTitle_ar: string;
  metaDescription_fr: string;
  metaDescription_en: string;
  metaDescription_ar: string;
  status: BlogArticle['status'];
  publishedAt?: string | null;
};

export type ArticlePayload = BlogArticlePayload;


export const blogService = {
  list: () => http.get<BlogArticle[]>('/admin/blog').then((res) => res.data),
  create: (payload: BlogArticlePayload) => http.post<BlogArticle>('/admin/blog', payload).then((res) => res.data),
  update: (id: string, payload: Partial<BlogArticlePayload>) => http.patch<BlogArticle>(`/admin/blog/${id}`, payload).then((res) => res.data),
  delete: (id: string) => http.delete(`/admin/blog/${id}`),
};
