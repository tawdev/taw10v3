import React from 'react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { BLOG_POSTS } from '@/data/blog';
import { getLocalizedMetadata } from '@/lib/metadata';

type Language = 'fr' | 'en' | 'ar';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const headersList = await headers();
  const rawLang = headersList.get("x-locale")?.toUpperCase() || "FR";
  const language = ["FR", "AR", "EN"].includes(rawLang) ? rawLang.toLowerCase() as Language : "fr";
  
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);
  if (!post) return { title: 'Article introuvable | TAW 10' };
  
  return getLocalizedMetadata(`${post.title[language]} | TAW 10`, post.excerpt[language]);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const headersList = await headers();
  const rawLang = headersList.get('x-locale')?.toLowerCase() || 'fr';
  const language = ['fr', 'ar', 'en'].includes(rawLang) ? rawLang as Language : 'fr';
  
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title[language],
    "image": [
      post.image.startsWith("http") ? post.image : `https://taw10.ma${post.image}`
    ],
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "TAW 10 Consulting",
      "url": "https://taw10.ma"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TAW 10 Consulting",
      "logo": {
        "@type": "ImageObject",
        "url": "https://taw10.ma/icon-512.png"
      }
    },
    "description": post.excerpt[language]
  };

  // Language specific labels
  const labels = {
    fr: { back: "Retour aux articles" },
    en: { back: "Back to articles" },
    ar: { back: "العودة إلى المقالات" }
  };

  // Custom helper to parse basic markdown structures into rich React components
  const formatContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    
    let listItems: string[] = [];
    let tableRows: string[][] = [];

    const parseTextToNodes = (text: string): React.ReactNode => {
      const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      const boldPattern = /\*\*([^*]+)\*\*/g;
      const italicPattern = /\*([^*]+)\*/g;
      
      let html = text
        .replace(linkPattern, '<a href="$2" class="text-[#dab055] font-bold hover:underline">$1</a>')
        .replace(boldPattern, '<strong>$1</strong>')
        .replace(italicPattern, '<em>$1</em>');
        
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    };

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-8 mb-6 space-y-2 text-[#1c1c1b]/80">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-lg leading-relaxed">{parseTextToNodes(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const flushTable = (key: number) => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-wrapper-${key}`} className="overflow-x-auto my-8 border border-[#dab055]/10 rounded-2xl shadow-sm">
            <table className="min-w-full divide-y divide-[#dab055]/20">
              <thead className="bg-[#fcf9f6]">
                <tr>
                  {tableRows[0].map((cell, idx) => (
                    <th key={idx} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#1c1c1b]">
                      {parseTextToNodes(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#dab055]/10">
                {tableRows.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-[#fcf9f6]/30 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-6 py-4 text-sm text-[#1c1c1b]/80 font-medium">
                        {parseTextToNodes(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if image: ![alt](url)
      if (line.startsWith('![') && line.endsWith(')')) {
        flushList(i);
        flushTable(i);
        const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (match) {
          const alt = match[1];
          const src = match[2];
          elements.push(
            <figure key={i} className="my-12 overflow-hidden rounded-[2.5rem] shadow-xl border border-[#dab055]/10 group">
              <img src={src} alt={alt} className="w-full max-h-[500px] object-cover group-hover:scale-105 transition-transform duration-700" />
              {alt && <figcaption className="text-center text-sm text-[#1c1c1b]/50 mt-4 font-medium italic">{alt}</figcaption>}
            </figure>
          );
          continue;
        }
      }

      // Check if table row
      if (line.startsWith('|') && line.endsWith('|')) {
        flushList(i);
        const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        if (cells.every(c => c.startsWith('-') || c.endsWith('-'))) {
          continue;
        }
        tableRows.push(cells);
        continue;
      } else {
        flushTable(i);
      }

      // Check if list item
      if (line.startsWith('- ') || line.startsWith('* ')) {
        listItems.push(line.substring(2));
        continue;
      } else {
        flushList(i);
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h2 key={i} className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-[#1c1c1b] font-headline border-b border-[#dab055]/10 pb-4">
            {parseTextToNodes(line.replace('# ', ''))}
          </h2>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h3 key={i} className="text-2xl md:text-3xl font-bold mt-10 mb-6 text-[#1c1c1b] font-headline">
            {parseTextToNodes(line.replace('## ', ''))}
          </h3>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h4 key={i} className="text-xl md:text-2xl font-bold mt-8 mb-4 text-[#1c1c1b] font-headline">
            {parseTextToNodes(line.replace('### ', ''))}
          </h4>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="border-l-4 border-[#dab055] bg-[#fcf9f6] p-6 rounded-r-2xl italic text-lg my-8 text-[#1c1c1b]/80 shadow-sm">
            {parseTextToNodes(line.replace('> ', ''))}
          </blockquote>
        );
      } else if (line === '---') {
        elements.push(<hr key={i} className="my-12 border-[#dab055]/20" />);
      } else if (line === '') {
        continue;
      } else {
        elements.push(
          <p key={i} className="mb-6 text-lg text-[#1c1c1b]/80 leading-relaxed font-body">
            {parseTextToNodes(line)}
          </p>
        );
      }
    }

    flushList(lines.length);
    flushTable(lines.length);

    return elements;
  };


  return (
    <div className="min-h-screen bg-[#fcf9f6] pt-48 lg:pt-56 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
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
