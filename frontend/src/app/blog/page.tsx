import React from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { formatBlogDate, getPublishedBlogArticles } from '@/lib/blog';
import { getLocalizedMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

type Language = 'fr' | 'en' | 'ar';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const rawLang = headersList.get("x-locale")?.toUpperCase() || "FR";
  const language = ["FR", "AR", "EN"].includes(rawLang) ? rawLang : "FR";

  const titles: Record<string, string> = {
    FR: "Le Journal TAW 10 | Domiciliation & Création d'Entreprise Marrakech",
    AR: "مدونة TAW 10 | توطين وإنشاء المقاولات في مراكش",
    EN: "The TAW 10 Journal | Business Domiciliation & Company Formation Marrakech",
  };

  const descriptions: Record<string, string> = {
    FR: "Découvrez nos articles, conseils et guides pratiques sur la domiciliation au Maroc et la création d'entreprise à Marrakech.",
    AR: "اكتشف مقالاتنا، نصائحنا وأدلتنا العملية حول توطين الشركات في المغرب وإنشاء المقاولات في مراكش.",
    EN: "Discover our articles, advice, and practical guides on business domiciliation in Morocco and company creation in Marrakech.",
  };

  return getLocalizedMetadata(titles[language], descriptions[language]);
}

export default async function BlogPage() {
  const headersList = await headers();
  const rawLang = headersList.get('x-locale')?.toLowerCase() || 'fr';
  const language = ['fr', 'ar', 'en'].includes(rawLang) ? rawLang as Language : 'fr';

  const content = {
    fr: {
      subtitle: "Inspirations & Conseils",
      title: "Le Journal TAW 10",
      readMore: "Lire l'article"
    },
    en: {
      subtitle: "Inspirations & Advice",
      title: "The TAW 10 Journal",
      readMore: "Read article"
    },
    ar: {
      subtitle: "إلهام ونصائح",
      title: "مدونة TAW 10",
      readMore: "اقرأ المقال"
    }
  };

  const t = content[language];
  const posts = await getPublishedBlogArticles(language);

  return (
    <div className="min-h-screen pt-40 pb-20 bg-[#fcf9f6]">
      <div className="max-w-7xl mx-auto px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <span className="text-[#dab055] font-bold uppercase tracking-[0.3em] text-xs mb-4 block text-center">
          {t.subtitle}
        </span>
        <h1 className="text-6xl font-black text-[#1c1c1b] text-center mb-16 font-headline tracking-tighter">
          {t.title}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/${language}/blog/${post.slug}`}
              className="group bg-white rounded-[3rem] p-12 border border-[#dab055]/10 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <p className="text-[#dab055] font-bold text-xs mb-4">{formatBlogDate(post.publishedAt ?? post.createdAt)}</p>
              <h2 className="text-3xl font-bold mb-6 group-hover:text-[#dab055] transition-colors">
                {post.title}
              </h2>
              <p className="text-[#1c1c1b]/60 leading-relaxed mb-8">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 text-[#dab055] font-black text-xs uppercase tracking-widest">
                {t.readMore}
                <span className={`material-symbols-outlined text-sm ${language === 'ar' ? 'rotate-180' : ''}`}>
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
