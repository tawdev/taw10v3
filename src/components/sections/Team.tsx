"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "../common/Animations";

export default function Team() {
  const { t } = useLanguage();
  const teamRef = useRef<HTMLElement>(null);
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });

  const teamMembers = [
    { name: t("team.ceo_name"), role: t("team.ceo"), desc: t("team.ceo_desc"), img: "/hicham.jpeg" },
    { name: t("team.operational_name"), role: t("team.operational"), desc: t("team.operational_desc"), img: "/team-member-2.jpeg" },
    { name: t("team.commercial_name"), role: t("team.commercial"), desc: t("team.commercial_desc"), img: "/team-member-1.jpeg" },
  ];

  return (
    <section id="lineup" ref={teamRef} className="py-32 bg-white relative overflow-hidden">
      <div 
        className="absolute top-20 right-20 w-64 h-64 bg-[#dab055]/5 rounded-full blur-[100px] animate-orb-drift"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <motion.div 
          className="text-center mb-24"
          initial="hidden"
          animate={teamInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.span 
            className="text-[#dab055] font-label uppercase tracking-[0.4em] text-xs font-bold mb-4 block"
            variants={fadeInUp}
          >
            {t("team.title")}
          </motion.span>
          <motion.h2 
            className="text-5xl md:text-6xl font-bold tracking-tight mb-8 font-headline text-[#1c1c1b]"
            variants={fadeInUp}
          >
            {t("team.subtitle")}
          </motion.h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          initial="hidden"
          animate={teamInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {teamMembers.map((member, i) => (
            <motion.div 
              key={i}
              className="group relative perspective-1000"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] shadow-2xl bg-slate-100 border-4 border-[#dab055]/5 transition-all duration-500"
                whileHover={{ borderColor: "rgba(218, 176, 85, 0.2)" }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ filter: "grayscale(15%)" }}
                  whileHover={{ filter: "grayscale(0%)" }}
                  transition={{ duration: 1 }}
                >
                  <Image 
                    className="object-cover"
                    alt={member.name} 
                    src={member.img}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                </motion.div>
                <motion.div 
                  className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1, height: "60%" }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.h4 
                    className="text-white text-2xl font-bold font-headline mb-1"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    {member.name}
                  </motion.h4>
                  <motion.p 
                    className="text-[#dab055] font-label uppercase tracking-[0.1em] text-[10px] font-bold"
                    initial={{ opacity: 1 }}
                    whileHover={{ opacity: 0 }}
                  >
                    {member.role}
                  </motion.p>
                  <motion.p 
                    className="text-white/80 text-sm mt-2 font-body leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {member.desc}
                  </motion.p>
                </motion.div>
                <motion.div 
                  className="absolute top-8 right-8 w-12 h-12 bg-[#dab055] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.2, rotate: 90 }}
                >
                  <span className="material-symbols-outlined text-white text-sm">arrow_forward</span>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
