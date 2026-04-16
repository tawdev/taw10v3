import React from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { BLOG_POSTS } from '@/data/blog';

type Language = 'fr' | 'en' | 'ar';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const language = (cookieStore.get('language')?.value?.toLowerCase() || 'fr') as Language;
  
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);
  if (!post) return { title: 'Article introuvable | TAW 10' };
  
  return {
    title: `${post.title[language]} | TAW 10`,
    description: post.excerpt[language],
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const language = (cookieStore.get('language')?.value?.toLowerCase() || 'fr') as Language;
  
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Language specific labels
  const labels = {
    fr: { back: "Retour aux articles" },
    en: { back: "Back to articles" },
    ar: { back: "العودة إلى المقالات" }
  };

  // Pre-process content to handle simple markdown-like newlines and headings
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-2xl font-bold mt-12 mb-6 text-[#1c1c1b]">{line.replace('### ', '')}</h3>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-4">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-[#fcf9f6] pt-48 lg:pt-56 pb-24">
      <article className="max-w-4xl mx-auto px-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mb-12">
          <Link 
            href={`/${language}#blog`} 
            className="inline-flex items-center gap-4 text-[#1c1c1b]/60 font-bold text-xs uppercase tracking-widest hover:text-[#dab055] transition-colors group"
          >
            <span className="w-10 h-10 rounded-full border border-[#1c1c1b]/10 bg-white shadow-sm flex items-center justify-center group-hover:border-[#dab055]/30 group-hover:bg-[#dab055]/5 group-hover:shadow-md transition-all duration-300">
              <span className={`material-symbols-outlined text-sm transition-transform ${language === 'ar' ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}>arrow_back</span>
            </span>
            {labels[language].back}
          </Link>
        </div>
        
        <header className="mb-16">
          <p className="text-[#dab055] font-bold text-sm tracking-widest uppercase mb-6">{post.date}</p>
          <h1 className="text-4xl md:text-6xl font-headline font-black text-[#1c1c1b] leading-tight mb-12">
            {post.title[language]}
          </h1>
          
          <div className="w-full h-[60vh] rounded-[3rem] overflow-hidden shadow-2xl relative">
            <img 
              src={post.image} 
              alt={post.title[language]} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        </header>

        <div className="prose prose-lg prose-[#1c1c1b] max-w-none text-[#1c1c1b]/80 font-body leading-relaxed text-lg bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-[#dab055]/5">
          {formatContent(post.content[language])}
        </div>
      </article>
    </div>
  );
}
