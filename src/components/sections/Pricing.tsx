"use client";

import React, { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer, scaleIn } from "../common/Animations";
import { CONFIG } from "@/data/config";
import { MagneticButton } from "../common/UIComponents";

export default function Pricing() {
  const { t } = useLanguage();
  const pricingRef = useRef<HTMLElement>(null);
  const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" });

  const handlePlanClick = (planName: string) => {
    const text = `Bonjour TAW 10,
    
Je suis intéressé par l'offre *${planName}*. Pouvez-vous m'en dire plus ?`;
    
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${CONFIG.contact.whatsapp}?text=${encodedText}`;
    
    window.open(whatsappUrl, "_blank");
  };

  const plans = [
    {
      name: t("pricing.intilaqa"),
      price: "3499",
      features: [
        { key: t("pricing.negative_certificate"), inactive: false },
        { key: t("pricing.statutes"), inactive: false },
        { key: t("pricing.professional_tax"), inactive: false },
        { key: t("pricing.commercial_register"), inactive: false },
        { key: t("pricing.fiscal_identifier"), inactive: false },
        { key: t("pricing.cnss"), inactive: false },
        { key: t("pricing.legal_announcement"), inactive: false },
        { key: t("pricing.domiciliation_12"), inactive: true },
        { key: t("pricing.model_j"), inactive: true },
        { key: t("pricing.dgi_service"), inactive: true },
        { key: t("pricing.damancom_service"), inactive: true },
        { key: t("pricing.stamp"), inactive: true },
        { key: t("pricing.bank_support"), inactive: true },
        { key: t("pricing.website"), inactive: true },
      ],
      popular: false
    },
    {
      name: t("pricing.intilaqa_pro"),
      price: "4699",
      features: [
        { key: t("pricing.negative_certificate"), inactive: false },
        { key: t("pricing.statutes"), inactive: false },
        { key: t("pricing.professional_tax"), inactive: false },
        { key: t("pricing.commercial_register"), inactive: false },
        { key: t("pricing.fiscal_identifier"), inactive: false },
        { key: t("pricing.cnss"), inactive: false },
        { key: t("pricing.legal_announcement"), inactive: false },
        { key: t("pricing.domiciliation_12"), inactive: false },
        { key: t("pricing.model_j"), inactive: false },
        { key: t("pricing.dgi_service"), inactive: false },
        { key: t("pricing.damancom_service"), inactive: false },
        { key: t("pricing.stamp"), inactive: false },
        { key: t("pricing.bank_support"), inactive: false },
        { key: t("pricing.website"), inactive: true },
      ],
      popular: true
    },
    {
      name: t("pricing.intilaqa_plus"),
      price: "5999",
      features: [
        { key: t("pricing.negative_certificate"), inactive: false },
        { key: t("pricing.statutes"), inactive: false },
        { key: t("pricing.professional_tax"), inactive: false },
        { key: t("pricing.commercial_register"), inactive: false },
        { key: t("pricing.fiscal_identifier"), inactive: false },
        { key: t("pricing.cnss"), inactive: false },
        { key: t("pricing.legal_announcement"), inactive: false },
        { key: t("pricing.domiciliation_24"), inactive: false },
        { key: t("pricing.model_j"), inactive: false },
        { key: t("pricing.dgi_service"), inactive: false },
        { key: t("pricing.damancom_service"), inactive: false },
        { key: t("pricing.stamp"), inactive: false },
        { key: t("pricing.bank_support"), inactive: false },
        { key: t("pricing.website"), inactive: true },
      ],
      popular: false
    },
    {
      name: t("pricing.intilaqa_premium"),
      price: "8999",
      features: [
        { key: t("pricing.negative_certificate"), inactive: false },
        { key: t("pricing.statutes"), inactive: false },
        { key: t("pricing.professional_tax"), inactive: false },
        { key: t("pricing.commercial_register"), inactive: false },
        { key: t("pricing.fiscal_identifier"), inactive: false },
        { key: t("pricing.cnss"), inactive: false },
        { key: t("pricing.legal_announcement"), inactive: false },
        { key: t("pricing.domiciliation_24"), inactive: false },
        { key: t("pricing.model_j"), inactive: false },
        { key: t("pricing.dgi_service"), inactive: false },
        { key: t("pricing.damancom_service"), inactive: false },
        { key: t("pricing.stamp"), inactive: false },
        { key: t("pricing.bank_support"), inactive: false },
        { key: t("pricing.website"), inactive: false },
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" ref={pricingRef} className="py-32 bg-[#fcf9f6] border-y border-[#dab055]/10 relative overflow-hidden">
      <div 
        className="absolute -top-40 -right-40 w-80 h-80 bg-[#dab055]/10 rounded-full blur-[120px] animate-rotate-slow"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          animate={pricingInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.span 
            className="text-[#dab055] font-label uppercase tracking-[0.3em] text-xs font-bold mb-4 block"
            variants={fadeInUp}
          >
            {t("pricing.title")}
          </motion.span>
          <motion.h2 
            className="text-5xl md:text-6xl font-bold tracking-tight mb-8 font-headline text-[#1c1c1b]"
            variants={fadeInUp}
          >
            {t("pricing.intilaqa")} <br />
            <span className="italic font-normal text-[#dab055]">{t("pricing.subtitle")}</span>
          </motion.h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 items-stretch font-body"
          initial="hidden"
          animate={pricingInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {plans.map((plan, idx) => (
            <motion.div 
              key={idx}
              className={`${
                plan.popular 
                ? "bg-[#1c1c1b] border-[3px] border-[#dab055] lg:py-10 lg:-mt-8 shadow-2xl z-10" 
                : "bg-white border border-[#dab055]/20 shadow-xl"
              } rounded-[2.5rem] p-8 flex flex-col h-full relative overflow-hidden group transition-all duration-500 ${!plan.popular && 'hover:bg-[#1c1c1b] hover:border-[#dab055]'}`}
              variants={scaleIn}
              whileHover={{ y: plan.popular ? -20 : -15, scale: plan.popular ? 1.02 : 1 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-tr from-[#dab055]/${plan.popular ? '10' : '5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {plan.popular && (
                <motion.div 
                  className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#dab055] text-white text-[10px] font-black px-8 py-2 rounded-full tracking-[0.3em] uppercase shadow-2xl z-20"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {t("pricing.popular")}
                </motion.div>
              )}

              <div className="text-center mb-10 pt-6 relative z-10">
                <h4 className={`text-xs font-label uppercase tracking-[0.2em] ${plan.popular ? 'text-[#dab055]' : 'text-[#dab055]'} mb-4 font-bold font-headline`}>
                  {plan.name}
                </h4>
                <div className="flex flex-col items-center">
                  <div className={`flex items-baseline gap-1 transition-transform duration-500 ${plan.popular ? 'scale-110 group-hover:scale-125' : 'group-hover:scale-110'}`}>
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-[#1c1c1b] group-hover:text-white'} transition-colors tracking-tighter`}>
                      {plan.price}
                    </span>
                    <span className="text-lg font-bold text-[#dab055]">DH</span>
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest ${plan.popular ? 'text-white/40' : 'text-slate-400 group-hover:text-white/40'} mt-4 font-bold italic transition-colors`}>
                    {t("pricing.excl_tax")}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow text-[11px] leading-relaxed relative z-10">
                {plan.features.map((feat, fIdx) => (
                  <motion.li 
                    key={fIdx} 
                    className={`flex items-start gap-3 transition-colors duration-300 ${
                      feat.inactive 
                      ? (plan.popular ? "text-white/20" : "text-gray-300 group-hover:text-white/10") 
                      : (plan.popular ? "text-white/90 group-hover:text-white" : "text-[#1c1c1b]/70 group-hover:text-white/80")
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[16px] mt-0.5 transition-colors ${
                      feat.inactive 
                      ? (plan.popular ? "text-white/5" : "text-gray-200 group-hover:text-white/5") 
                      : (plan.popular ? "text-[#dab055]" : "text-green-500 group-hover:text-[#dab055]")
                    }`}>
                      {feat.inactive ? (plan.popular ? "remove_circle_outline" : "block") : (plan.popular ? "stars" : "verified")}
                    </span>
                    <span>{feat.key}</span>
                  </motion.li>
                ))}
              </ul>

              <MagneticButton 
                onClick={() => handlePlanClick(plan.name)}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-sm relative z-10 ${
                  plan.popular 
                  ? "bg-[#dab055] hover:bg-white hover:text-[#1c1c1b] text-white" 
                  : "bg-[#fcf9f6] group-hover:bg-[#dab055] text-[#1c1c1b] group-hover:text-white border border-[#dab055]/30"
                }`}
              >
                {t("pricing.start")}
              </MagneticButton>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
