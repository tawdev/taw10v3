"use client";

import React, { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "../common/Animations";

export default function Steps() {
  const { t } = useLanguage();
  const processRef = useRef<HTMLElement>(null);
  const processInView = useInView(processRef, { once: true, margin: "-100px" });

  const steps = [
    { 
      step: 1, 
      icon: "near_me", 
      title: t("process.step1"), 
      desc: t("process.step1_desc"),
      delay: 0
    },
    { 
      step: 2, 
      icon: "description", 
      title: t("process.step2"), 
      desc: t("process.step2_desc"),
      delay: 0.2
    },
    { 
      step: 3, 
      icon: "check_circle", 
      title: t("process.step3"), 
      desc: t("process.step3_desc"),
      delay: 0.4,
      isLast: true
    },
  ];

  return (
    <section id="how-it-works" ref={processRef} className="py-32 bg-white relative overflow-hidden">
      <motion.div 
        className="absolute top-1/2 left-0 w-full h-0.5 bg-[#dab055]/10 -translate-y-12 z-0"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
        <motion.div
          initial="hidden"
          animate={processInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.span 
            className="text-[#dab055] font-label uppercase tracking-[0.3em] text-xs font-bold mb-4 block"
            variants={fadeInUp}
          >
            {t("process.title")}
          </motion.span>
          <motion.h2 
            className="text-5xl md:text-6xl font-bold tracking-tight mb-8 font-headline text-[#1c1c1b]"
            variants={fadeInUp}
          >
            {t("process.subtitle")}
          </motion.h2>
          <motion.p 
            className="text-[#1c1c1b]/60 text-lg max-w-2xl mx-auto mb-20 font-body"
            variants={fadeInUp}
          >
            {t("process.description")}
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative mt-24">
          {steps.map((item, idx) => (
            <motion.div 
              key={idx}
              className="relative z-10 flex flex-col items-center group"
              initial={{ opacity: 0, y: 50 }}
              animate={processInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: item.delay }}
            >
              <motion.div 
                className="relative mb-8"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={`w-24 h-24 ${item.isLast ? 'bg-[#dab055]' : 'bg-[#fcf9f6]'} rounded-[2rem] flex items-center justify-center shadow-xl border border-[#dab055]/10 ${!item.isLast && 'group-hover:bg-white'} transition-colors`}>
                  <span className={`material-symbols-outlined text-4xl ${item.isLast ? 'text-white' : 'text-[#dab055]'}`}>{item.icon}</span>
                </div>
                <motion.div 
                  className={`absolute -top-3 -right-3 w-10 h-10 ${item.isLast ? 'bg-[#1c1c1b]' : 'bg-[#dab055]'} text-white rounded-full flex items-center justify-center text-md font-bold shadow-lg border-4 border-white`}
                  initial={{ scale: 0 }}
                  animate={processInView ? { scale: 1 } : {}}
                  transition={{ delay: item.delay + 0.5, type: "spring", stiffness: 500 }}
                >
                  {item.step}
                </motion.div>
              </motion.div>
              <motion.h4 
                className="text-xl font-headline font-bold mb-4 text-[#1c1c1b]"
                initial={{ opacity: 0 }}
                animate={processInView ? { opacity: 1 } : {}}
                transition={{ delay: item.delay + 0.3 }}
              >
                {item.title}
              </motion.h4>
              <motion.p 
                className="text-[#1c1c1b]/60 text-sm leading-relaxed max-w-xs font-body"
                initial={{ opacity: 0 }}
                animate={processInView ? { opacity: 1 } : {}}
                transition={{ delay: item.delay + 0.4 }}
              >
                {item.desc}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
