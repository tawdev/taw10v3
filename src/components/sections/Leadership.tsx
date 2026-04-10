"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useInView } from "framer-motion";
import { fadeInUp } from "../common/Animations";

export default function Leadership() {
  const { t } = useLanguage();
  const leadershipRef = useRef<HTMLElement>(null);
  const leadershipInView = useInView(leadershipRef, { once: true, margin: "-100px" });

  return (
    <section ref={leadershipRef} className="py-24 bg-[#fcf9f6] relative overflow-hidden">
      <div 
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#dab055]/5 rounded-full blur-[120px] animate-rotate-slow"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: -100 }}
            animate={leadershipInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="rounded-3xl shadow-2xl relative z-10 w-full aspect-[4/5] overflow-hidden"
              initial={{ filter: "grayscale(100%)" }}
              animate={leadershipInView ? { filter: "grayscale(10%)" } : {}}
              whileHover={{ filter: "grayscale(0%)" }}
              transition={{ duration: 0.7 }}
            >
              <Image
                className="object-cover"
                alt="Leadership TAW 10"
                src="/leadership-photo.jpeg"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </motion.div>
            <motion.div 
              className="absolute -bottom-10 -right-10 p-10 bg-white shadow-2xl z-20 rounded-3xl border border-[#dab055]/10"
              initial={{ opacity: 0, y: 50 }}
              animate={leadershipInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              whileHover={{ y: -10 }}
            >
              <p className="font-headline italic text-3xl text-[#dab055]">{t("leadership.years")}</p>
              <p className="font-label uppercase tracking-widest text-[10px] text-slate-500 mt-1">{t("leadership.badge_subtitle")}</p>
            </motion.div>
          </motion.div>
          <motion.div 
            className="lg:col-span-7 pl-0 lg:pl-12"
            initial={{ opacity: 0, x: 100 }}
            animate={leadershipInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.span 
              className="text-[#dab055] font-label uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block"
              variants={fadeInUp}
            >
              {t("leadership.label")}
            </motion.span>
            <motion.h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-headline text-[#1c1c1b]">
              {t("leadership.title")}
            </motion.h2>
            <motion.div 
              className="space-y-6 text-[#1c1c1b]/60 text-lg font-body leading-relaxed mb-10"
            >
              <p>{t("leadership.desc1")}</p>
              <p>{t("leadership.desc2")}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
