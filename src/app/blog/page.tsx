import React from 'react';
import Link from 'next/link';

import { BLOG_POSTS } from '@/data/blog';

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-40 pb-20 bg-[#fcf9f6]">
      <div className="max-w-7xl mx-auto px-8">
        <span className="text-[#dab055] font-bold uppercase tracking-[0.3em] text-xs mb-4 block text-center">Inspirations & Conseils</span>
        <h1 className="text-6xl font-black text-[#1c1c1b] text-center mb-16 font-headline tracking-tighter">Le Journal TAW 10</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {BLOG_POSTS.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-[3rem] p-12 border border-[#dab055]/10 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <p className="text-[#dab055] font-bold text-xs mb-4">{post.date}</p>
              <h2 className="text-3xl font-bold mb-6 group-hover:text-[#dab055] transition-colors">{post.title}</h2>
              <p className="text-[#1c1c1b]/60 leading-relaxed mb-8">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-[#dab055] font-black text-xs uppercase tracking-widest">
                Lire l'article
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
