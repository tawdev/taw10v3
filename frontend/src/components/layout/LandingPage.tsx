"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

interface FAQItem {
  question: string;
  answer: string;
}

interface LandingPageProps {
  language: "FR" | "EN" | "AR";
  title: string;
  subtitle: string;
  description: string;
  h1: string;
  h2: string;
  content: React.ReactNode;
  faqs: FAQItem[];
  ctaText: string;
  ctaLink: string;
  localBusinessSchema: any;
}

export default function LandingPage({
  language,
  title,
  subtitle,
  description,
  h1,
  h2,
  content,
  faqs,
  ctaText,
  ctaLink,
  localBusinessSchema,
}: LandingPageProps) {
  const isRtl = language === "AR";
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <div className="min-h-screen bg-[#fcf9f6] text-[#1c1c1b] pt-32 pb-16 font-body" dir={dir}>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Hero Section */}
      <header className="relative py-20 overflow-hidden bg-gradient-to-b from-[#1c1c1b] to-[#2a2a29] text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#dab055_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <span className="text-[#dab055] font-bold text-xs uppercase tracking-[0.25em] mb-4 block">
            {subtitle}
          </span>
          <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tight mb-8 leading-tight">
            {h1}
          </h1>
          <p className="text-white/80 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-12">
            {description}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={ctaLink}
              className="bg-gradient-to-r from-[#dab055] to-[#a68942] text-white font-bold px-8 py-4 rounded-full text-sm uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-10 text-center border-b border-[#dab055]/20 pb-4">
            {h2}
          </h2>
          <div className="prose prose-lg max-w-none text-[#1c1c1b]/80 leading-relaxed space-y-6">
            {content}
          </div>
        </div>
      </section>

      {/* Custom Landing Page FAQ */}
      {faqs && faqs.length > 0 && (
        <section className="py-20 bg-white border-y border-[#dab055]/10">
          <div className="max-w-4xl mx-auto px-6">
            <h3 className="text-2xl md:text-3xl font-headline font-bold mb-12 text-center text-[#1c1c1b]">
              {language === "AR" ? "الأسئلة الشائعة" : language === "EN" ? "Frequently Asked Questions" : "Questions Fréquentes"}
            </h3>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-[#fcf9f6] p-8 rounded-3xl border border-[#dab055]/5 shadow-sm">
                  <h4 className="font-bold text-lg text-[#1c1c1b] mb-3">{faq.question}</h4>
                  <p className="text-[#1c1c1b]/70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <Contact />
    </div>
  );
}
