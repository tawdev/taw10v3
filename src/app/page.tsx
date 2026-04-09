"use client";

import React, { useRef, useState, useEffect, lazy, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useInView, useScroll, useTransform, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

const AnimatedCounter = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Array.from(value).map((char, i) => (
            /\d/.test(char) ? (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                {char}
              </motion.span>
            ) : (
              <span key={i}>{char}</span>
            )
          ))}
        </motion.span>
      )}
    </motion.span>
  );
};

const TypingText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    setDisplayText("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [text, isInView]);
  
  return <span ref={ref}>{displayText}<span className="animate-pulse">|</span></span>;
};

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const expertiseRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const leadershipRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  
  const expertiseInView = useInView(expertiseRef, { once: true, margin: "-100px" });
  const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" });
  const processInView = useInView(processRef, { once: true, margin: "-100px" });
  const leadershipInView = useInView(leadershipRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });
  const contactInView = useInView(contactRef, { once: true, margin: "-100px" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { nom, prenom, email, message } = formData;
    
    const whatsappNumber = "+212607790956";
    const text = `Bonjour TAW 10,

Nouveau message depuis le formulaire de contact :

*Nom :* ${nom}
*Prénom :* ${prenom}
*Email :* ${email}
*Message :* ${message}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setFormData({ nom: "", prenom: "", email: "", message: "" });
      setSubmitted(false);
    }, 2000);
  };

  const handlePlanClick = (planName: string) => {
    const whatsappNumber = "+212607790956";
    const text = `Bonjour TAW 10,
    
Je suis intéressé par l'offre *${planName}*. Pouvez-vous m'en dire plus ?`;
    
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, "_blank");
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
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
    <LazyMotion features={domAnimation}>
    <main>
      {/* 1. HERO SECTION - Immediate Impact */}
      <section 
        ref={heroRef} 
        className="relative min-h-[95vh] flex items-center pt-32 overflow-hidden bg-[#0f172a]"
        aria-label="Hero section"
      >
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y, scale: heroScale }}
        >
          <Image
            className="object-cover brightness-[0.3]"
            alt="Luxury modern architectural space in Marrakech with arches and soft golden sunlight"
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
              className="text-3xl md:text-5xl lg:text-7xl leading-[1.15] text-white font-bold tracking-tighter mb-10 font-headline drop-shadow-2xl text-balance italic"
              style={{ fontFamily: '"Playfair Display", serif' }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {t("hero.title_prefix")} <span className="text-[#dab055]"><span style={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.2em', verticalAlign: 'middle' }}>T</span>AW <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.3em', fontWeight: 'bold' }}>10</span></span> {t("hero.title_suffix")}
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 font-body max-w-3xl mb-14 leading-relaxed drop-shadow-md text-balance"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="text-[#dab055] font-bold uppercase" style={{ fontFamily: '"Playfair Display", serif' }}>T</span><span className="text-[#dab055] font-bold uppercase">AW </span><span className="text-[#dab055] font-bold uppercase" style={{ fontFamily: '"Playfair Display", serif' }}>10</span> {t("hero.tagline")}
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button 
                onClick={(e) => scrollToSection(e as any, "#contact")}
                className="w-full sm:w-auto bg-[#dab055] text-white px-12 py-6 rounded-full text-lg font-bold shadow-2xl uppercase tracking-widest hover:bg-[#ceb674]"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(218, 176, 85, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                {t("hero.cta")}
              </motion.button>
              <motion.button 
                onClick={(e) => scrollToSection(e as any, "#expertise")}
                className="w-full sm:w-auto text-white font-headline italic text-xl border-b-2 border-[#dab055]/40 pb-1 text-center"
                whileHover={{ borderColor: "rgba(218, 176, 85, 1)" }}
              >
                {t("hero.offers")}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float-up-down"
          aria-hidden="true"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-float-dot" />
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION / PULL-QUOTE - Emotional Reset */}
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

      {/* 3. EXPERTISE SECTION - What we do (Functional Proof) */}
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
            {[
              { title: t("service_card.premium_title"), icon: "location_on", slug: "domiciliation", desc: t("service_card.premium_desc"), color: "#dab055" },
              { title: t("service_card.creation_title"), icon: "rocket_launch", slug: "creation-entreprise", desc: t("service_card.creation_desc"), color: "#dab055" },
              { title: t("service_card.secretary_title"), icon: "forward_to_inbox", slug: "secretariat", desc: t("service_card.secretary_desc"), color: "#dab055" },
              { title: t("service_card.legal_title"), icon: "gavel", slug: "accompagnement-juridique", desc: t("service_card.legal_desc"), color: "#dab055" },
              { title: t("service_card.support_title"), icon: "support_agent", slug: "support-administratif", desc: t("service_card.support_desc"), color: "#dab055" },
              { title: t("service_card.strategic_title"), icon: "insights", slug: "conseil-strategique", desc: t("service_card.strategic_desc"), color: "#dab055" },
            ].map((item, idx) => (
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
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-[#dab055]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="relative z-10">
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
                  >
                    {t("common.learn_more")} <span className="material-symbols-outlined text-sm animate-pulse-scale">arrow_forward</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. PRICING SECTION - Decision Phase */}
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
            {/* INTILAQA - 3499 */}
            <motion.div 
              className="bg-white border border-[#dab055]/20 rounded-3xl p-6 flex flex-col h-full shadow-sm relative overflow-hidden"
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
            >
              <div className="text-center mb-8">
                <h4 className="text-sm font-label uppercase tracking-widest text-[#1c1c1b] mb-2 font-bold font-headline">
                  {t("pricing.intilaqa")}
                </h4>
                <div className="flex flex-col items-center">
                  <motion.span 
                    className="text-4xl font-bold text-[#1c1c1b]"
                    initial={{ opacity: 0 }}
                    animate={pricingInView ? { opacity: 1 } : {}}
                  >
                    3499
                  </motion.span>
                  <span className="text-[10px] uppercase tracking-tighter text-slate-400 mt-1 font-bold italic">
                    {t("pricing.excl_tax")}
                  </span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow text-[11px] leading-snug">
                {[
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
                ].map((feat, idx) => (
                  <motion.li 
                    key={idx} 
                    className={`flex items-start gap-3 ${feat.inactive ? "text-gray-300" : "text-[#1c1c1b]/70"}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={pricingInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <span className={`material-symbols-outlined text-[16px] mt-0.5 ${feat.inactive ? "text-gray-200" : "text-green-500"}`}>
                      {feat.inactive ? "close" : "check"}
                    </span>
                    <span>{feat.key}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.button 
                onClick={() => handlePlanClick(t("pricing.intilaqa"))}
                className="w-full py-3 bg-[#fcf9f6] text-[#1c1c1b] border border-[#dab055]/30 font-bold rounded-xl uppercase tracking-wider text-xs"
                whileHover={{ backgroundColor: "#dab055", color: "white" }}
                whileTap={{ scale: 0.95 }}
              >
                {t("pricing.start")}
              </motion.button>
            </motion.div>

            {/* INTILAQA PRO - 4699 */}
            <motion.div 
              className="bg-[#1c1c1b] border-[3px] border-[#dab055] rounded-3xl p-6 lg:py-8 lg:-mt-4 flex flex-col h-full shadow-2xl relative z-10"
              variants={scaleIn}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#dab055] text-white text-[10px] font-bold px-6 py-1.5 rounded-full tracking-widest uppercase shadow-lg animate-pulse-scale"
              >
                {t("pricing.popular")}
              </motion.div>
              <div className="text-center mb-8 pt-4">
                <h4 className="text-sm font-label uppercase tracking-widest text-[#dab055] mb-2 font-bold font-headline">
                  {t("pricing.intilaqa_pro")}
                </h4>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-white">4699</span>
                  <span className="text-[10px] uppercase tracking-tighter text-white/50 mt-1 font-bold italic">
                    {t("pricing.excl_tax")}
                  </span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow text-[11px] leading-snug">
                {[
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
                ].map((feat, idx) => (
                  <motion.li 
                    key={idx} 
                    className={`flex items-start gap-3 ${feat.inactive ? "text-white/20" : "text-white"}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={pricingInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <span className={`material-symbols-outlined text-[16px] mt-0.5 ${feat.inactive ? "text-white/10" : "text-[#dab055]"}`}>
                      {feat.inactive ? "cancel" : "check_circle"}
                    </span>
                    <span>{feat.key}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.button 
                onClick={() => handlePlanClick(t("pricing.intilaqa_pro"))}
                className="w-full py-3 bg-[#dab055] text-white font-bold rounded-xl uppercase tracking-wider text-xs shadow-sm"
                whileHover={{ backgroundColor: "#ceb674" }}
                whileTap={{ scale: 0.95 }}
              >
                {t("pricing.start")}
              </motion.button>
            </motion.div>

            {/* INTILAQA PLUS - 5999 */}
            <motion.div 
              className="bg-white border border-[#dab055]/20 rounded-3xl p-6 flex flex-col h-full shadow-sm relative overflow-hidden"
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
            >
              <div className="text-center mb-8">
                <h4 className="text-sm font-label uppercase tracking-widest text-[#1c1c1b] mb-2 font-bold font-headline">
                  {t("pricing.intilaqa_plus")}
                </h4>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-[#1c1c1b]">5999</span>
                  <span className="text-[10px] uppercase tracking-tighter text-slate-400 mt-1 font-bold italic">
                    {t("pricing.excl_tax")}
                  </span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow text-[11px] leading-snug">
                {[
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
                ].map((feat, idx) => (
                  <motion.li 
                    key={idx} 
                    className={`flex items-start gap-3 ${feat.inactive ? "text-gray-300" : "text-[#1c1c1b]/70"}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={pricingInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <span className={`material-symbols-outlined text-[16px] mt-0.5 ${feat.inactive ? "text-gray-200" : "text-green-500"}`}>
                      {feat.inactive ? "close" : "check"}
                    </span>
                    <span>{feat.key}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.button 
                onClick={() => handlePlanClick(t("pricing.intilaqa_plus"))}
                className="w-full py-3 bg-[#fcf9f6] text-[#1c1c1b] border border-[#dab055]/30 font-bold rounded-xl uppercase tracking-wider text-xs"
                whileHover={{ backgroundColor: "#dab055", color: "white" }}
                whileTap={{ scale: 0.95 }}
              >
                {t("pricing.start")}
              </motion.button>
            </motion.div>

            {/* INTILAQA PREMIUM - 8999 */}
            <motion.div 
              className="bg-white border border-[#dab055]/20 rounded-3xl p-6 flex flex-col h-full shadow-sm relative overflow-hidden"
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
            >
              <div className="text-center mb-8">
                <h4 className="text-sm font-label uppercase tracking-widest text-[#1c1c1b] mb-2 font-bold font-headline">
                  {t("pricing.intilaqa_premium")}
                </h4>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-[#1c1c1b]">8999</span>
                  <span className="text-[10px] uppercase tracking-tighter text-slate-400 mt-1 font-bold italic">
                    {t("pricing.excl_tax")}
                  </span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow text-[11px] leading-snug">
                {[
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
                ].map((feat, idx) => (
                  <motion.li 
                    key={idx} 
                    className="flex items-start gap-3 text-[#1c1c1b]/70"
                    initial={{ opacity: 0, x: -20 }}
                    animate={pricingInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <span className="material-symbols-outlined text-[16px] mt-0.5 text-green-500">check</span>
                    <span>{feat.key}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.button 
                onClick={() => handlePlanClick(t("pricing.intilaqa_premium"))}
                className="w-full py-3 bg-[#fcf9f6] text-[#1c1c1b] border border-[#dab055]/30 font-bold rounded-xl uppercase tracking-wider text-xs"
                whileHover={{ backgroundColor: "#dab055", color: "white" }}
                whileTap={{ scale: 0.95 }}
              >
                {t("pricing.start")}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. PROCESS SECTION - How it works (Removing Friction) */}
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
            {[
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
            ].map((item, idx) => (
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

      {/* 6. TRUST SECTION - Testimonials & Team (Authority) */}
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
                  src="/WhatsApp%20Image%202026-04-07%20at%2010.50.33.jpeg"
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
                <p className="font-label uppercase tracking-widest text-[10px] text-slate-500 mt-1">{t("leadership.subtitle")}</p>
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
                initial={{ opacity: 0 }}
                animate={leadershipInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
              >
                {t("leadership.history")}
              </motion.span>
              <motion.h3 
                className="text-5xl font-bold tracking-tight mb-8 font-headline text-[#1c1c1b]"
                initial={{ opacity: 0, y: 20 }}
                animate={leadershipInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                {t("leadership.history_subtitle")}
              </motion.h3>
              <motion.div 
                className="space-y-6 text-[#1c1c1b]/60 text-lg leading-relaxed font-body"
                initial="hidden"
                animate={leadershipInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <motion.p variants={fadeInUp}>{t("leadership.history_desc1")}</motion.p>
                <motion.p variants={fadeInUp}>{t("leadership.history_desc2")}</motion.p>
              </motion.div>
              <motion.div 
                className="mt-12 flex gap-12"
                initial="hidden"
                animate={leadershipInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <motion.div 
                  className="border-l-2 border-[#dab055]/20 pl-6"
                  variants={fadeInUp}
                >
                  <p className="text-4xl font-headline font-bold text-[#dab055]">
                    <AnimatedCounter value="500+" />
                  </p>
                  <p className="text-[10px] font-label uppercase tracking-widest text-slate-400">{t("leadership.clients")}</p>
                </motion.div>
                <motion.div 
                  className="border-l-2 border-[#dab055]/20 pl-6"
                  variants={fadeInUp}
                >
                  <p className="text-4xl font-headline font-bold text-[#dab055]">
                    <AnimatedCounter value="98%" />
                  </p>
                  <p className="text-[10px] font-label uppercase tracking-widest text-slate-400">{t("leadership.satisfaction")}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. LINEUP / TEAM - Human Connection */}
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
            {[
              { name: "Hicham MHAMEDI", role: t("team.ceo"), img: "/hicham.jpeg", desc: "Visionnaire et stratège, Hicham guide TAW 10 vers l'excellence depuis plus de 10 ans." },
              { name: "AFAFE KHLIFAL", role: t("team.operational"), img: "/WhatsApp Image 2026-02-24 at 10.58.10.jpeg", desc: "Experte en gestion opérationnelle, Afafe assure le bon fonctionnement de nos services." },
              { name: "Salma AAOUAD", role: t("team.commercial"), img: "/WhatsApp Image 2026-02-24 at 10.52.51.jpeg", desc: "Spécialiste du développement commercial, Salma accompagne nos clients vers leur réussite." },
            ].map((member, i) => (
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

      {/* 8. CONTACT SECTION - Final Conversion */}
      <section id="contact" ref={contactRef} className="py-32 bg-[#fcf9f6] relative overflow-hidden border-t border-[#dab055]/10">
        <div 
          className="absolute top-0 right-0 w-1/3 h-full bg-[#dab055]/5 z-0 blur-[120px] animate-pulse-glow"
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <motion.div 
              className="text-[#1c1c1b]"
              initial={{ opacity: 0, x: -50 }}
              animate={contactInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#dab055] font-label uppercase tracking-[0.3em] text-[11px] font-black mb-6 block">{t("contact.title")}</span>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-10 font-headline leading-tight">
                {t("contact.subtitle")} <br /> {t("contact.project")}
              </h2>
              <p className="text-[#1c1c1b]/60 text-lg max-w-lg font-body leading-relaxed mb-12">
                {t("contact.desc")}
              </p>
              <div className="space-y-10">
                <motion.div 
                  className="flex items-center gap-6 group cursor-pointer"
                  whileHover={{ x: 10 }}
                >
                  <motion.div 
                    className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#dab055] border border-[#dab055]/20 shadow-xl"
                    whileHover={{ backgroundColor: "#dab055", color: "white", scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="material-symbols-outlined text-3xl">mail</span>
                  </motion.div>
                  <div>
                    <p className="text-[10px] font-label uppercase tracking-[0.2em] text-[#1c1c1b]/40 mb-1 font-bold">{t("contact.email_label")}</p>
                    <a href="mailto:Contact@taw10.com" className="text-xl font-headline font-bold hover:text-[#dab055] transition-colors border-b-2 border-transparent hover:border-[#dab055]">Contact@taw10.com</a>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-6 group cursor-pointer"
                  whileHover={{ x: 10 }}
                >
                  <motion.div 
                    className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#dab055] border border-[#dab055]/20 shadow-xl"
                    whileHover={{ backgroundColor: "#dab055", color: "white", scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="material-symbols-outlined text-3xl">call</span>
                  </motion.div>
                  <div>
                    <p className="text-[10px] font-label uppercase tracking-[0.2em] text-[#1c1c1b]/40 mb-1 font-bold">{t("contact.phone_label")}</p>
                    <p className="text-xl font-headline font-bold text-[#1c1c1b]/80">+212 52430-8038</p>
                    <p className="text-xl font-headline font-bold text-[#1c1c1b]/80">+212 60779-0956</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div 
              className="bg-white p-12 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(166,137,66,0.15)] border border-[#dab055]/10"
              initial={{ opacity: 0, y: 50 }}
              animate={contactInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -8 }}
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    key="form"
                    className="space-y-6" 
                    onSubmit={handleSubmit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={contactInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="text-[10px] font-bold text-[#1c1c1b] uppercase tracking-widest ml-1 opacity-60">{t("contact.name")}</label>
                        <motion.input 
                          type="text" 
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#fcf9f6] border border-gray-100 rounded-2xl p-5 outline-none text-[#1c1c1b] font-body" 
                          placeholder="Abdellah"
                          whileFocus={{ borderColor: "#dab055", boxShadow: "0 0 0 3px rgba(218, 176, 85, 0.2)" }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={contactInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="text-[11px] font-bold text-[#1c1c1b] uppercase tracking-widest ml-1 opacity-60">{t("contact.firstname")}</label>
                        <motion.input 
                          type="text" 
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#fcf9f6] border border-gray-100 rounded-2xl p-5 outline-none text-[#1c1c1b] font-body" 
                          placeholder="Ibba"
                          whileFocus={{ borderColor: "#dab055", boxShadow: "0 0 0 3px rgba(218, 176, 85, 0.2)" }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>
                    </div>
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={contactInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="text-[11px] font-bold text-[#1c1c1b] uppercase tracking-widest ml-1 opacity-60">{t("contact.email")}</label>
                      <motion.input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#fcf9f6] border border-gray-100 rounded-2xl p-5 outline-none text-[#1c1c1b] font-body" 
                        placeholder={t("contact.email_placeholder")}
                        whileFocus={{ borderColor: "#dab055", boxShadow: "0 0 0 3px rgba(218, 176, 85, 0.2)" }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={contactInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="text-[11px] font-bold text-[#1c1c1b] uppercase tracking-widest ml-1 opacity-60">{t("contact.message")}</label>
                      <motion.textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#fcf9f6] border border-gray-100 rounded-2xl p-5 outline-none text-[#1c1c1b] min-h-[140px] font-body resize-none" 
                        placeholder={t("contact.message_placeholder")}
                        whileFocus={{ borderColor: "#dab055", boxShadow: "0 0 0 3px rgba(218, 176, 85, 0.2)" }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                    <motion.button 
                      type="submit" 
                      className="w-full bg-[#1c1c1b] text-white py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl mt-4"
                      disabled={isSubmitting}
                      whileHover={{ backgroundColor: "#dab055" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block"
                        >
                          <span className="material-symbols-outlined">progress_activity</span>
                        </motion.span>
                      ) : (
                        t("contact.send")
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <div
                    key="success"
                    className="flex flex-col items-center justify-center py-20 animate-fade-in-up"
                  >
                    <div
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-success-check"
                    >
                      <span className="material-symbols-outlined text-white text-4xl">check</span>
                    </div>
                    <h3 
                      className="text-2xl font-headline font-bold text-[#1c1c1b] mb-2"
                    >
                      Message envoyé!
                    </h3>
                    <p 
                      className="text-[#1c1c1b]/60 text-center"
                    >
                      Redirection vers WhatsApp...
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
    </LazyMotion>
  );
}
