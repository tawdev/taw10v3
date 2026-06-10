import { BLOG_POSTS } from '@/data/blog';
import { apiFetch } from './api';

export type PublicBlogArticle = {
  id: string;
  title: string;
  title_fr?: string | null;
  title_en?: string | null;
  title_ar?: string | null;
  slug: string;
  featuredImage: string;
  excerpt: string;
  excerpt_fr?: string | null;
  excerpt_en?: string | null;
  excerpt_ar?: string | null;
  content: string;
  content_fr?: string | null;
  content_en?: string | null;
  content_ar?: string | null;
  metaTitle: string;
  metaTitle_fr?: string | null;
  metaTitle_en?: string | null;
  metaTitle_ar?: string | null;
  metaDescription: string;
  metaDescription_fr?: string | null;
  metaDescription_en?: string | null;
  metaDescription_ar?: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string | null;
  createdAt: string;
};

type Language = 'fr' | 'en' | 'ar';

export function formatBlogDate(value?: string | null) {
  if (!value) return '';
  return value.slice(0, 10);
}

export function localizeBlogArticle(article: PublicBlogArticle, language: Language) {
  return {
    ...article,
    title: article[`title_${language}`] || article.title,
    excerpt: article[`excerpt_${language}`] || article.excerpt,
    content: article[`content_${language}`] || article.content,
    metaTitle: article[`metaTitle_${language}`] || article.metaTitle,
    metaDescription: article[`metaDescription_${language}`] || article.metaDescription,
  };
}

export async function getPublishedBlogArticles(language: Language = 'fr'): Promise<PublicBlogArticle[]> {
  try {
    const articles = await apiFetch<PublicBlogArticle[]>('/blog', { cache: 'no-store' });
    return articles.map((article) => localizeBlogArticle(article, language));
  } catch {
    return BLOG_POSTS.map((post) => ({
      id: post.slug,
      title: post.title[language],
      slug: post.slug,
      featuredImage: post.image,
      excerpt: post.excerpt[language],
      content: post.content[language],
      metaTitle: post.title[language],
      metaDescription: post.excerpt[language],
      status: 'PUBLISHED',
      publishedAt: post.date,
      createdAt: post.date,
    }));
  }
}
