"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useInView, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { CONFIG } from "@/data/config";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export default function Footer() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <LazyMotion features={domAnimation}>
    <footer ref={ref} className="pt-24 pb-12 bg-[#1c1c1b] text-white overflow-hidden relative border-t border-[#dab055]/10" role="contentinfo" aria-label="Footer">
      <div aria-hidden="true">
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#dab055]/5 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse-glow"
        />
        <div 
          className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#dab055]/5 rounded-full blur-[100px] -ml-32 -mb-32 animate-orb-drift"
        />
      </div>

      {/* Animated top line */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#dab055]/20 to-transparent"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {/* Brand Identity */}
          <motion.div className="space-y-8" variants={fadeInUp}>
            <Link className="font-headline text-3xl font-bold tracking-tighter flex items-center gap-4 group" href="/">
              <motion.span 
                className="text-white"
                whileHover={{ scale: 1.05 }}
              >
                TAW <motion.span 
                  className="text-[#dab055]" 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >10</motion.span>
              </motion.span>
            </Link>
            <motion.p 
              className="text-white/40 text-sm leading-relaxed max-w-[280px] font-body italic"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              &quot;{t("footer.quote")}&quot;
            </motion.p>
            <motion.div className="flex items-center gap-4" variants={scaleIn}>
              {[
                { icon: 'fa-brands fa-facebook-f', href: CONFIG.socials.facebook, label: 'Facebook' },
                { icon: 'fa-brands fa-instagram', href: CONFIG.socials.instagram, label: 'Instagram' }
              ].map((social, idx) => (
                <motion.a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.label}`}
                  className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-white/30 border border-white/5 shadow-lg relative overflow-hidden group"
                  whileHover={{ 
                    backgroundColor: "#dab055",
                    borderColor: "rgba(218, 176, 85, 0.5)",
                    y: -5,
                    boxShadow: "0 10px 30px rgba(218, 176, 85, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.1 + 0.5 }}
                >
                  <span className="sr-only">{social.label}</span>
                  <i className={`${social.icon} text-lg`} aria-hidden="true"></i>
                  <motion.span 
                    className="absolute inset-0 bg-[#dab055] opacity-0"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.2 }}
                  />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Navigation Support */}
          <motion.div className="lg:pl-8" variants={fadeInUp}>
            <motion.h4 
              className="font-headline text-lg font-bold mb-10 text-white inline-block relative"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              {t("footer.nav")}
              <motion.span 
                className="absolute -bottom-2 left-0 h-0.5 bg-[#dab055]"
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </motion.h4>
            <ul className="space-y-5 text-sm text-white/40 font-body">
              {[
                { name: t('nav.home'), href: '/#hero' },
                { name: t('nav.services'), href: '/#expertise' },
                { name: t('nav.pricing'), href: '/#pricing' },
                { name: t('nav.team'), href: '/#lineup' },
                { name: t('nav.contact'), href: '/#contact' }
              ].map((link, idx) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                >
                  <Link className="hover:text-[#dab055] transition-colors flex items-center gap-3 group" href={link.href}>
                    <motion.span 
                      className="w-1 h-1 bg-[#dab055] rounded-full"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    />
                    <motion.span
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Specialized Services */}
          <motion.div variants={fadeInUp}>
            <motion.h4 
              className="font-headline text-lg font-bold mb-10 text-white inline-block relative"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              {t("footer.expertises")}
              <motion.span 
                className="absolute -bottom-2 left-0 h-0.5 bg-[#dab055]"
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
            </motion.h4>
            <ul className="space-y-5 text-sm text-white/40 font-body">
              {[
                { key: 'service_card.premium_title', href: '/services/domiciliation' },
                { key: 'service_card.creation_title', href: '/services/creation-entreprise' },
                { key: 'service_card.secretary_title', href: '/services/secretariat' },
                { key: 'service_card.legal_title', href: '/services/accompagnement-juridique' },
                { key: 'service_card.support_title', href: '/services/support-administratif' },
                { key: 'service_card.strategic_title', href: '/services/conseil-strategique' }
              ].map((service, idx) => (
                <motion.li 
                  key={service.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: idx * 0.1 + 0.4 }}
                >
                  <Link className="hover:text-[#dab055] transition-colors flex items-center gap-2 group" href={service.href}>
                    <motion.span 
                      className="material-symbols-outlined text-[10px] text-[#dab055]/30"
                      whileHover={{ scale: 1.5 }}
                      style={{ color: "#dab055" }}
                    >
                      circle
                    </motion.span>
                    <motion.span
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {t(service.key)}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Insider Newsletter */}
          <motion.div className="space-y-8" variants={fadeInUp}>
            <motion.h4 
              className="font-headline text-lg font-bold text-white inline-block relative"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              {t("footer.newsletter")}
              <motion.span 
                className="absolute -bottom-2 left-0 h-0.5 bg-[#dab055]"
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              />
            </motion.h4>
            <motion.p 
              className="text-white/40 text-sm font-body leading-relaxed"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {t("footer.newsletter_desc")}
            </motion.p>
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <motion.input 
                type="email" 
                placeholder={t("contact.your_email")}
                aria-label={t("contact.your_email")}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm outline-none placeholder:text-white/20 text-white" 
                whileFocus={{ 
                  borderColor: "rgba(218, 176, 85, 0.5)",
                  boxShadow: "0 0 0 3px rgba(218, 176, 85, 0.1)"
                }}
              />
              <motion.button 
                type="submit"
                aria-label="Subscribe to newsletter"
                className="absolute right-2 top-2 bottom-2 bg-[#dab055] px-4 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ 
                  backgroundColor: "#ceb674",
                  scale: 1.05,
                  boxShadow: "0 5px 20px rgba(218, 176, 85, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined text-white text-sm" aria-hidden="true">arrow_forward</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-white/20 uppercase tracking-[0.25em] font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
        >
          <motion.p 
            className="text-center md:text-left"
            whileHover={{ scale: 1.02 }}
          >
            &copy; 2024 <motion.a 
              href="https://cdigital.ma" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#dab055] font-bold"
              whileHover={{ scale: 1.1, color: "#ceb674" }}
            >cdigital</motion.a>. {t("footer.rights")}
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
          >
            {[
              { label: t("footer.legal"), href: "#" },
              { label: "Confidentialité", href: "#" },
              { label: "Conditions Générales", href: "#" }
            ].map((link) => (
              <motion.a 
                key={link.label}
                href={link.href}
                className="hover:text-[#dab055] transition-colors"
                whileHover={{ y: -2, color: "#dab055" }}
                transition={{ duration: 0.2 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        className="fixed bottom-8 right-8 w-12 h-12 bg-[#dab055] rounded-full flex items-center justify-center shadow-lg z-50"
        aria-label="Back to top"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0 }}
        whileHover={{ scale: 1.1, boxShadow: "0 10px 30px rgba(218, 176, 85, 0.4)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <span 
          className="material-symbols-outlined text-white animate-float-up-down"
          aria-hidden="true"
        >
          keyboard_arrow_up
        </span>
      </motion.button>
    </footer>
    </LazyMotion>
  );
}
