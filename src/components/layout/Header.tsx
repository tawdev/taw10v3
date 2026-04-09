"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHome || !href.startsWith("#")) return;
    
    e.preventDefault();
    setIsMobileMenuOpen(false);
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

  const navItems = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.why_us', href: '/#how-it-works' },
    { key: 'nav.services', href: '/#expertise' },
    { key: 'nav.pricing', href: '/#pricing' },
    { key: 'nav.contact', href: '/#contact' }
  ];

  return (
    <LazyMotion features={domAnimation}>
    <>
      <div className="sr-only">
        <a href="#main-content" className="skip-link">Skip to main content</a>
      </div>
      
      <motion.div 
        className={`fixed top-0 w-full z-[60] bg-[#0c0c0c] text-white border-b border-white/5 ${
          isScrolled ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        role="banner"
        aria-label="Top bar"
      >
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
          <motion.div 
            className="flex gap-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <span className="material-symbols-outlined text-[14px] text-[#dab055]" aria-hidden="true">schedule</span>
              <span>{t("top.schedule")}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <span className="material-symbols-outlined text-[14px] text-[#dab055]">mail</span>
              Contact@taw10.com
            </motion.div>
          </motion.div>
          <motion.div 
            className="flex items-center gap-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <span className="material-symbols-outlined text-[14px] text-[#dab055]">call</span>
              +212 52430-8038
            </motion.div>
            <div className="flex items-center gap-3" role="group" aria-label="Language selection">
              {["FR", "AR", "EN"].map((lang, idx) => (
                <motion.button
                  key={lang}
                  type="button"
                  className={`${language === lang ? "text-[#dab055]" : "text-white/60 hover:text-white"}`}
                  onClick={() => setLanguage(lang as "FR" | "AR" | "EN")}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  aria-pressed={language === lang}
                  aria-label={`Switch to ${lang === "FR" ? "French" : lang === "AR" ? "Arabic" : "English"}`}
                >
                  {lang}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Navbar */}
      <motion.header 
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-in-out ${
          isScrolled 
            ? 'top-4 w-[98%] max-w-6xl bg-white/95 backdrop-blur-xl rounded-full shadow-2xl border border-[#dab055]/20 px-10' 
            : 'top-10 w-full bg-[#0f172a]/0 px-6'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
          <Link 
            className="flex items-center gap-3 group" 
            href="/" 
            onClick={(e) => scrollToSection(e, "#")}
          >
            <motion.span 
              className={`font-headline text-2xl font-bold tracking-tighter transition-colors duration-500 ${isScrolled ? 'text-[#1c1c1b]' : 'text-white'}`}
              whileHover={{ scale: 1.05 }}
            >
              TAW <motion.span 
                className="text-[#dab055] border-b-2 border-[#dab055] pb-0.5 inline-block"
                whileHover={{ scale: 1.1 }}
              >10</motion.span>
            </motion.span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
            {navItems.map((link, idx) => (
              <motion.div
                key={link.key}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
              >
                <Link
                  className={`text-[11px] font-bold tracking-[0.25em] transition-all duration-300 relative group cursor-pointer ${
                    isScrolled ? 'text-[#1c1c1b]/80 hover:text-[#dab055]' : 'text-white/70 hover:text-[#dab055]'
                  }`}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href.startsWith("/#") ? link.href.substring(1) : link.href)}
                >
                  {t(link.key)}
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#dab055]"
                    initial={{ width: language === link.key.substring(0, link.key.indexOf('.')) ? "100%" : "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center gap-8">
            {/* Minimal Language Switcher for Scrolled State */}
            <AnimatePresence>
              {isScrolled && (
                <motion.div 
                  className="hidden md:flex items-center gap-3 text-[10px] font-bold tracking-widest bg-[#1c1c1b]/5 px-5 py-2.5 rounded-full border border-[#1c1c1b]/10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  {["FR", "AR", "EN"].map((lang) => (
                    <motion.span
                      key={lang}
                      className={`${language === lang ? "text-[#dab055]" : "text-[#1c1c1b]/60 cursor-pointer hover:text-[#1c1c1b]"}`}
                      onClick={() => setLanguage(lang as "FR" | "AR" | "EN")}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {lang}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Top Bar Language Switcher (visible when not scrolled) */}
            <AnimatePresence>
              {!isScrolled && (
                <motion.div 
                  className="hidden lg:flex items-center gap-3 text-[10px] font-bold tracking-widest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {["FR", "AR", "EN"].map((lang, idx) => (
                    <motion.span
                      key={lang}
                      className={`${language === lang ? "text-[#dab055]" : "text-white/60 hover:text-white cursor-pointer"}`}
                      onClick={() => setLanguage(lang as "FR" | "AR" | "EN")}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {lang}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className={`bg-[#dab055] text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center ${
                isScrolled ? 'px-8 py-3' : 'px-10 py-4'
              }`}
              >
                <motion.span
                  className="flex items-center justify-center animate-glow-pulse"
                >
                  {t("nav.consultation")}
                </motion.span>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <div className="flex flex-col gap-1.5">
                <motion.span 
                  className={`w-6 h-0.5 ${isScrolled ? 'bg-[#1c1c1b]' : 'bg-white'} block`}
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 9 : 0,
                    x: isMobileMenuOpen ? 0 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span 
                  className={`w-6 h-0.5 ${isScrolled ? 'bg-[#1c1c1b]' : 'bg-white'} block`}
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1,
                    x: isMobileMenuOpen ? 10 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span 
                  className={`w-6 h-0.5 ${isScrolled ? 'bg-[#1c1c1b]' : 'bg-white'} block`}
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -9 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#dab055]/20 overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <motion.nav className="flex flex-col p-6">
                {navItems.map((link, idx) => (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      className="text-[#1c1c1b] font-bold tracking-[0.2em] py-4 block border-b border-[#dab055]/10 hover:text-[#dab055] transition-colors"
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href.startsWith("/#") ? link.href.substring(1) : link.href)}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
                <motion.div 
                  className="mt-6 flex justify-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {["FR", "AR", "EN"].map((lang) => (
                    <motion.button
                      key={lang}
                      className={`w-12 h-12 rounded-full font-bold text-sm ${
                        language === lang 
                          ? 'bg-[#dab055] text-white' 
                          : 'bg-[#1c1c1b]/5 text-[#1c1c1b]/60 hover:bg-[#dab055]/10'
                      }`}
                      onClick={() => setLanguage(lang as "FR" | "AR" | "EN")}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {lang}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
    </LazyMotion>
  );
}
