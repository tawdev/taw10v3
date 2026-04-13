"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "../common/Animations";
import { TypingText } from "../common/UIComponents";

export default function Expertise() {
  const { t } = useLanguage();
  const expertiseRef = useRef<HTMLElement>(null);
  const expertiseInView = useInView(expertiseRef, { once: true, margin: "-100px" });

  const services = [
    { title: t("service_card.premium_title"), icon: "location_on", slug: "domiciliation", desc: t("service_card.premium_desc") },
    { title: t("service_card.creation_title"), icon: "rocket_launch", slug: "creation-entreprise", desc: t("service_card.creation_desc") },
    { title: t("service_card.secretary_title"), icon: "forward_to_inbox", slug: "secretariat", desc: t("service_card.secretary_desc") },
    { title: t("service_card.legal_title"), icon: "gavel", slug: "accompagnement-juridique", desc: t("service_card.legal_desc") },
    { title: t("service_card.support_title"), icon: "support_agent", slug: "support-administratif", desc: t("service_card.support_desc") },
    { title: t("service_card.strategic_title"), icon: "insights", slug: "conseil-strategique", desc: t("service_card.strategic_desc") },
  ];

  return (
    <>
      {/* 2. VALUE PROPOSITION / PULL-QUOTE */}
      <motion.section 
        className="py-24 bg-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <motion.div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#dab055]/20 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <div className="max-w-4xl mx-auto px-8 text-center relative">
          <motion.div 
            className="text-[#dab055] text-6xl font-serif absolute -top-8 left-0 opacity-20"
            initial={{ opacity: 0, rotate: -180 }}
            whileInView={{ opacity: 0.2, rotate: 0 }}
            transition={{ duration: 1 }}
          >
            "
          </motion.div>
          <motion.h2 
            className="text-[#1c1c1b] text-4xl md:text-5xl italic font-headline leading-snug relative z-10"
            variants={fadeInUp}
          >
            <TypingText text={`"${t("hero.quote")}"`} />
          </motion.h2>
          <motion.div 
            className="mt-10 w-24 h-1 bg-[#dab055]/20 mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8, delay: 2 }}
          />
        </div>
        <motion.div 
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#dab055]/20 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </motion.section>

      {/* 3. EXPERTISE SECTION */}
      <section id="expertise" ref={expertiseRef} className="py-32 bg-white relative overflow-hidden">
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-[#dab055]/5 rounded-full blur-[120px] animate-orb-drift"
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.div 
            className="mb-20 text-center"
            initial="hidden"
            animate={expertiseInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.span 
              className="text-[#dab055] font-label uppercase tracking-[0.3em] text-xs font-bold mb-4 block"
              variants={fadeInUp}
            >
              {t("expertise.label")}
            </motion.span>
            <motion.h2 
              className="text-5xl md:text-6xl font-bold tracking-tight mb-8 font-headline text-[#1c1c1b]"
              variants={fadeInUp}
            >
              {t("expertise.title")}
            </motion.h2>
            <motion.p 
              className="text-[#1c1c1b]/60 text-xl max-w-2xl font-body leading-relaxed mx-auto"
              variants={fadeInUp}
            >
              {t("expertise.subtitle")}
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate={expertiseInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {services.map((item, idx) => (
              <motion.div 
                key={idx}
                className="bg-[#fcf9f6] p-10 rounded-3xl border border-[#dab055]/10 group relative overflow-hidden flex flex-col h-full"
                variants={fadeInUp}
                whileHover={{ 
                  y: -8, 
                  boxShadow: "0 25px 50px -12px rgba(218, 176, 85, 0.25)",
                  borderColor: "rgba(218, 176, 85, 0.4)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#dab055]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 h-full flex flex-col">
                  <motion.div 
                    className="w-16 h-16 bg-[#dab055]/10 rounded-2xl flex items-center justify-center text-[#dab055] mb-8"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </motion.div>
                  <h4 className="text-2xl font-headline font-bold mb-4 text-[#1c1c1b] group-hover:text-[#dab055] transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-[#1c1c1b]/60 mb-8 leading-relaxed font-body flex-grow">
                    {item.desc}
                  </p>
                  <Link
                    className="text-[#dab055] font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all"
                    href={`/services/${item.slug}`}
                    aria-label={`${t("common.learn_more")} - ${item.title}`}
                  >
                    {t("common.learn_more")} <span className="material-symbols-outlined text-sm animate-pulse-scale" aria-hidden="true">arrow_forward</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
