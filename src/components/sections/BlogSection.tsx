"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { BLOG_POSTS } from '@/data/blog';

const BlogSection = () => {
  const { t, language } = useLanguage();
  const langPrefix = `/${language.toLowerCase()}`;

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="blog">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#dab055] font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">
            {t("blog.subtitle")}
          </span>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-[#1c1c1b] mb-6">
            {t("blog.title")}
          </h2>
          <div className="w-20 h-1 bg-[#dab055] mx-auto"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12" dir={language === "AR" ? "rtl" : "ltr"}>
          {BLOG_POSTS.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={`${langPrefix}/blog/${post.slug}`}
                className="group block h-full bg-[#fcf9f6] rounded-[3rem] border border-[#dab055]/5 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#dab055]/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#dab055]/10 transition-colors z-0"></div>
                
                <div className="h-64 overflow-hidden relative z-10 w-full mb-6">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f6] via-transparent to-transparent"></div>
                </div>

                <div className="px-10 md:px-12 pb-10 md:pb-12 relative z-10">
                  <p className="text-[#dab055] font-bold text-xs mb-4">{post.date}</p>
                  <h3 className="text-2xl font-bold mb-6 text-[#1c1c1b] group-hover:text-[#dab055] transition-colors">{post.title}</h3>
                  <p className="text-[#1c1c1b]/60 leading-relaxed mb-8 font-body line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center gap-2 text-[#dab055] font-black text-xs uppercase tracking-widest">
                    {t("common.learn_more")}
                    <span className={`material-symbols-outlined text-sm ${language === "AR" ? "rotate-180" : ""}`}>
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
