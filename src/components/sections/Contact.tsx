"use client";

import React, { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CONFIG } from "@/data/config";

export default function Contact() {
  const { t } = useLanguage();
  const contactRef = useRef<HTMLElement>(null);
  const contactInView = useInView(contactRef, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    service: "",
    message: "",
    website: "" // Honeypot field
  });
  const [errors, setErrors] = useState({
    email: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "email") {
      if (value && !validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: "Invalid email address" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.website) {
      // If honeypot is filled, assume bot and exit silently
      console.warn("Spam attempt detected.");
      setSubmitted(true);
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email" }));
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { nom, prenom, email, message } = formData;
    
    const text = `Bonjour TAW 10,

Nouveau message depuis le formulaire de contact :

*Nom :* ${nom}
*Prénom :* ${prenom}
*Email :* ${email}
*Service :* ${formData.service || 'Non spécifié'}
*Message :* ${message}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${CONFIG.contact.whatsapp}?text=${encodedText}`;
    
    setSubmitted(true);
    setIsSubmitting(false);

    // Track GTM Conversion
    if (typeof window !== 'undefined' && (window as unknown as Window & { dataLayer?: any[] }).dataLayer) {
      (window as unknown as Window & { dataLayer: any[] }).dataLayer.push({
        event: 'form_submission_success',
        form_name: 'contact_form',
        service_selected: formData.service || 'general'
      });
    }
    
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setFormData({ 
        nom: "", 
        prenom: "", 
        email: "", 
        service: "", 
        message: "",
        website: "" 
      });
      setSubmitted(false);
    }, 2000);
  };

  return (
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
                  <a href={`mailto:${CONFIG.contact.email}`} className="text-xl font-headline font-bold hover:text-[#dab055] transition-colors border-b-2 border-transparent hover:border-[#dab055]">{CONFIG.contact.email}</a>
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
                  <p className="text-xl font-headline font-bold text-[#1c1c1b]/80">
                    <span dir="ltr">{CONFIG.contact.phone}</span>
                  </p>
                  <p className="text-xl font-headline font-bold text-[#1c1c1b]/80">
                    <span dir="ltr">{CONFIG.contact.mobile}</span>
                  </p>
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
                  {/* Honeypot field for bot protection */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1 }}
                  />
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
                        placeholder={t("contact.name_placeholder")}
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
                      <label className="text-[10px] font-bold text-[#1c1c1b] uppercase tracking-widest ml-1 opacity-60">{t("contact.firstname")}</label>
                      <motion.input 
                        type="text" 
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#fcf9f6] border border-gray-100 rounded-2xl p-5 outline-none text-[#1c1c1b] font-body" 
                        placeholder={t("contact.firstname_placeholder")}
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
                      className={`w-full bg-[#fcf9f6] border ${errors.email ? 'border-red-400' : 'border-gray-100'} rounded-2xl p-5 outline-none text-[#1c1c1b] font-body`} 
                      placeholder={t("contact.email_placeholder")}
                      whileFocus={{ borderColor: errors.email ? "#f87171" : "#dab055", boxShadow: errors.email ? "0 0 0 3px rgba(248, 113, 113, 0.2)" : "0 0 0 3px rgba(218, 176, 85, 0.2)" }}
                      transition={{ duration: 0.2 }}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email}</p>}
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={contactInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.55 }}
                  >
                    <label className="text-[11px] font-bold text-[#1c1c1b] uppercase tracking-widest ml-1 opacity-60">{t("contact.service")}</label>
                    <select 
                      name="service"
                      value={formData.service}
                      onChange={(e) => handleChange(e as React.ChangeEvent<HTMLSelectElement>)}
                      required
                      className="w-full bg-[#fcf9f6] border border-gray-100 rounded-2xl p-5 outline-none text-[#1c1c1b] font-body appearance-none cursor-pointer focus:border-[#dab055] focus:shadow-[0_0_0_3px_rgba(218, 176, 85, 0.2)] transition-all"
                    >
                      <option value="" disabled>{t("contact.service_placeholder")}</option>
                      <option value={t("contact.service_domiciliation")}>{t("contact.service_domiciliation")}</option>
                      <option value={t("contact.service_creation")}>{t("contact.service_creation")}</option>
                      <option value={t("contact.service_legal")}>{t("contact.service_legal")}</option>
                      <option value={t("contact.service_other")}>{t("contact.service_other")}</option>
                    </select>
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
                  <p className="text-[9px] text-center text-[#1c1c1b]/40 font-body px-4 italic">
                    {t("contact.privacy")}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 md:gap-8 pt-6 border-t border-gray-100 mt-6 justify-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#dab055] text-lg">verified_user</span>
                      <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">Agréé par l&apos;État</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#dab055] text-lg">lock</span>
                      <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">100% Confidentiel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#dab055] text-lg">speed</span>
                      <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">Réponse sous 24h</span>
                    </div>
                  </div>
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
                    {t("contact.success_title")}
                  </h3>
                  <p 
                    className="text-[#1c1c1b]/60 text-center"
                  >
                    {t("contact.success_desc")}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
