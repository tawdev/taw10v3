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
  keywords?: string | null;
  language?: string;
  author?: string;
  category?: string;
  readingTime?: number;
};

type Language = 'fr' | 'en' | 'ar';

export function formatBlogDate(value?: string | null) {
  if (!value) return '';
  return value.slice(0, 10);
}

export function localizeBlogArticle(article: any, language: Language): PublicBlogArticle {
  const featuredImageRaw = article.featuredImage || article.featured_image || '';
  const baseUrl = 'http://127.0.0.1:4000';
  const featuredImage = featuredImageRaw.startsWith('http') 
    ? featuredImageRaw 
    : featuredImageRaw.startsWith('/uploads')
      ? `${baseUrl}${featuredImageRaw}`
      : featuredImageRaw;

  const normalized: PublicBlogArticle = {
    ...article,
    id: article.id,
    slug: article.slug,
    featuredImage,
    metaTitle: article.metaTitle || article.meta_title || '',
    metaDescription: article.metaDescription || article.meta_description || '',
    readingTime: article.readingTime || article.reading_time || 5,
    status: article.status,
    publishedAt: article.publishedAt || article.published_at || null,
    createdAt: article.createdAt || article.created_at || '',
    author: article.author || 'TAW 10',
    category: article.category || 'Business',
    keywords: article.keywords || '',
  };

  return {
    ...normalized,
    title: article[`title_${language}`] || normalized.title,
    excerpt: article[`excerpt_${language}`] || normalized.excerpt,
    content: article[`content_${language}`] || normalized.content,
    metaTitle: article[`metaTitle_${language}`] || article[`meta_title_${language}`] || normalized.metaTitle,
    metaDescription: article[`metaDescription_${language}`] || article[`meta_description_${language}`] || normalized.metaDescription,
  };
}

export async function getPublishedBlogArticles(language: Language = 'fr'): Promise<PublicBlogArticle[]> {
  try {
    const articles = await apiFetch<PublicBlogArticle[]>('/blog', { cache: 'no-store' });
    return articles.map((article) => localizeBlogArticle(article, language));
  } catch (error) {
    console.error('Error fetching blog articles from API, using static fallback:', error);
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

export async function getPublishedBlogArticleBySlug(slug: string, language: Language = 'fr'): Promise<PublicBlogArticle | null> {
  try {
    const article = await apiFetch<PublicBlogArticle>(`/blog/${slug}`, { cache: 'no-store' });
    return localizeBlogArticle(article, language);
  } catch (error) {
    console.error(`Error fetching blog article ${slug} from API, using static fallback:`, error);
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) return null;
    return {
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
    };
  }
}
