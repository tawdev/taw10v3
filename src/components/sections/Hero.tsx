"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { MagneticButton } from "../common/UIComponents";

export default function Hero() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elemRect = elem.getBoundingClientRect().top;
      const elemPosition = elemRect - bodyRect;
      const offsetPosition = elemPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section 
      id="hero"
      ref={heroRef} 
      className="relative min-h-screen flex items-center pt-32 overflow-hidden bg-[#0f172a]"
      aria-label="Hero section"
    >
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, scale: heroScale }}
      >
        <Image
          className="object-cover brightness-[0.3]"
          alt="Luxury modern architectural space"
          src="/luxury_marrakech_office_hero_1775496536100.png"
          fill
          priority
          sizes="100vw"
          quality={75}
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" aria-hidden="true"></div>
      </motion.div>
      
      <div 
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#dab055]/10 rounded-full blur-[100px] animate-orb-drift"
        aria-hidden="true"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <motion.div 
          className="max-w-6xl"
          style={{ opacity }}
        >
          <motion.span 
            className="font-label text-[#dab055] font-bold tracking-[0.4em] uppercase text-xs mb-8 block drop-shadow-md"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("hero.subtitle")}
          </motion.span>
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl leading-[1.1] md:leading-[1.15] text-white font-bold tracking-tighter mb-6 md:mb-10 font-headline drop-shadow-2xl text-balance italic"
            style={{ fontFamily: '"Playfair Display", serif' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {t("hero.title_prefix")} <span className="text-[#dab055] font-label font-black tracking-[0.1em] md:tracking-[0.15em] uppercase italic px-1 md:px-2 border-b-2 border-[#dab055]/20 inline-block transform hover:scale-105 transition-transform duration-300 whitespace-nowrap">TAW 10</span> {t("hero.title_suffix")}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/90 font-body max-w-3xl mb-10 md:mb-14 leading-relaxed drop-shadow-md text-balance"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="text-[#dab055] font-label font-black tracking-widest uppercase italic px-1">TAW 10</span> {t("hero.tagline")}
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <MagneticButton 
              onClick={(e) => scrollToSection(e, "#contact")}
              className="w-full sm:w-auto bg-[#dab055] text-white px-12 py-6 rounded-full text-lg font-bold shadow-2xl uppercase tracking-widest hover:bg-[#ceb674] transition-all"
            >
              {t("nav.consultation")}
            </MagneticButton>
            <Link 
              href="#expertise" 
              onClick={(e) => scrollToSection(e as any, "#expertise")}
              className="font-label text-white/60 hover:text-[#dab055] uppercase tracking-[0.3em] text-[10px] font-bold flex items-center gap-4 transition-colors group"
            >
              <span className="w-12 h-px bg-[#dab055]/30 group-hover:w-16 transition-all duration-500"></span>
              {t("hero.discover")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
