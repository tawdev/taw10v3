"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer, scaleIn } from "../common/Animations";
import { CONFIG } from "@/data/config";
import { MagneticButton } from "../common/UIComponents";
import { pricingPlans as fallbackPricingPlans } from "@/store/admin-data";
import { pricingService } from "@/services/pricing.service";
import { ordersService } from "@/services/orders.service";
import { PricingPlan } from "@/types/admin";

const modalTranslations = {
  FR: {
    title: "Finaliser votre demande",
    subtitle: "Remplissez ce formulaire pour continuer votre réservation sur WhatsApp.",
    nameLabel: "Nom Complet",
    namePlaceholder: "Ex: Mohamed Alami",
    phoneLabel: "Numéro de Téléphone (WhatsApp)",
    phonePlaceholder: "Ex: +212 600 000000",
    emailLabel: "Email (Optionnel)",
    emailPlaceholder: "Ex: mohamed.alami@example.com",
    confirmBtn: "Confirmer et Ouvrir WhatsApp",
    cancelBtn: "Annuler",
    errorRequired: "Le nom et le téléphone sont obligatoires.",
  },
  AR: {
    title: "إتمام الطلب",
    subtitle: "يرجى ملء الاستمارة لمتابعة الحجز على واتساب.",
    nameLabel: "الاسم الكامل",
    namePlaceholder: "مثال: محمد العلمي",
    phoneLabel: "رقم الهاتف (واتساب)",
    phonePlaceholder: "مثال: +212 600 000000",
    emailLabel: "البريد الإلكتروني (اختياري)",
    emailPlaceholder: "مثال: mohamed.alami@example.com",
    confirmBtn: "تأكيد ومتابعة على واتساب",
    cancelBtn: "إلغاء",
    errorRequired: "الاسم ورقم الهاتف مطلوبان.",
  },
  EN: {
    title: "Complete Your Order",
    subtitle: "Fill out the form to proceed with your booking on WhatsApp.",
    nameLabel: "Full Name",
    namePlaceholder: "e.g. Mohamed Alami",
    phoneLabel: "Phone Number (WhatsApp)",
    phonePlaceholder: "e.g. +212 600 000000",
    emailLabel: "Email (Optional)",
    emailPlaceholder: "e.g. mohamed.alami@example.com",
    confirmBtn: "Confirm and Open WhatsApp",
    cancelBtn: "Cancel",
    errorRequired: "Name and Phone are required.",
  }
};

export default function Pricing() {
  const { t, language } = useLanguage();
  const pricingRef = useRef<HTMLElement>(null);
  const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" });
  const [plans, setPlans] = useState<PricingPlan[]>(fallbackPricingPlans.filter((plan) => plan.isActive));
  
  // Order modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanForOrder, setSelectedPlanForOrder] = useState<PricingPlan | null>(null);
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    phone: "",
    email: "",
  });
  const [orderError, setOrderError] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    pricingService
      .list(false)
      .then((remotePlans) => {
        if (remotePlans.length) setPlans(remotePlans);
      })
      .catch(() => undefined);
  }, []);

  const handlePlanClick = (plan: PricingPlan) => {
    setSelectedPlanForOrder(plan);
    setOrderForm({ customerName: "", phone: "", email: "" });
    setOrderError("");
    setIsModalOpen(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentTranslations = modalTranslations[language as keyof typeof modalTranslations] || modalTranslations.FR;
    if (!selectedPlanForOrder) return;
    if (!orderForm.customerName.trim() || !orderForm.phone.trim()) {
      setOrderError(currentTranslations.errorRequired);
      return;
    }

    setIsOrdering(true);
    try {
      // Save order to the database
      await ordersService.create({
        customerName: orderForm.customerName,
        phone: orderForm.phone,
        email: orderForm.email || undefined,
        selectedPlan: selectedPlanForOrder.name,
      });

      // Prepare WhatsApp message
      const text = `Bonjour TAW 10,
      
Je m'appelle *${orderForm.customerName}* (${orderForm.phone}).
Je viens de réserver l'offre *${selectedPlanForOrder.name}* (${selectedPlanForOrder.price} DH HT) sur votre site web.
Veuillez s'il vous plaît me contacter pour finaliser ma commande. Merci !`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/${CONFIG.contact.whatsapp}?text=${encodedText}`;
      
      setIsModalOpen(false);
      window.open(whatsappUrl, "_blank");
    } catch (err) {
      console.error(err);
      setOrderError("Failed to submit order. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };

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
          {plans.map((plan, idx) => {
            const featured = plan.theme === "FEATURED";

            return (
            <motion.div
              key={idx}
              className={`${featured
                ? "bg-[#1c1c1b] border-[3px] border-[#dab055] lg:py-10 lg:-mt-8 shadow-2xl z-10"
                : "bg-white border border-[#dab055]/20 shadow-xl"
                } rounded-[2.5rem] p-8 flex flex-col h-full relative overflow-hidden group transition-all duration-500 ${!featured && 'hover:bg-[#1c1c1b] hover:border-[#dab055]'}`}
              variants={scaleIn}
              whileHover={{ y: featured ? -20 : -15, scale: featured ? 1.02 : 1 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-tr from-[#dab055]/${featured ? '10' : '5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {plan.isPopular && (
                <motion.div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#dab055] text-white text-[10px] font-black px-8 py-2 rounded-full tracking-[0.3em] uppercase shadow-2xl z-20"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {t("pricing.popular")}
                </motion.div>
              )}

              <div className="text-center mb-10 pt-6 relative z-10">
                <h4 className={`text-xs font-label uppercase tracking-[0.2em] ${featured ? 'text-[#dab055]' : 'text-[#dab055]'} mb-4 font-bold font-headline`}>
                  {plan.name}
                </h4>
                <div className="flex flex-col items-center">
                  <div className={`flex items-baseline gap-1 transition-transform duration-500 ${featured ? 'scale-110 group-hover:scale-125' : 'group-hover:scale-110'}`}>
                    <span className={`text-5xl font-bold ${featured ? 'text-white' : 'text-[#1c1c1b] group-hover:text-white'} transition-colors tracking-tighter`}>
                      {plan.price}
                    </span>
                    <span className="text-lg font-bold text-[#dab055]">DH ht</span>
                  </div>

                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow text-[11px] leading-relaxed relative z-10">
                {plan.features.sort((a, b) => a.sortOrder - b.sortOrder).map((feat, fIdx) => (
                  <motion.li
                    key={fIdx}
                    className={`flex items-start gap-3 transition-colors duration-300 ${!feat.isIncluded
                      ? (featured ? "text-white/20" : "text-gray-300 group-hover:text-white/10")
                      : (featured ? "text-white/90 group-hover:text-white" : "text-[#1c1c1b]/70 group-hover:text-white/80")
                      }`}
                  >
                    <span className={`material-symbols-outlined text-[16px] mt-0.5 transition-colors ${!feat.isIncluded
                      ? (featured ? "text-white/5" : "text-gray-200 group-hover:text-white/5")
                      : (featured ? "text-[#dab055]" : "text-green-500 group-hover:text-[#dab055]")
                      }`}>
                      {!feat.isIncluded ? (featured ? "remove_circle_outline" : "block") : (featured ? "stars" : "verified")}
                    </span>
                    <span>
                      {language === "AR"
                        ? (feat.name_ar || feat.name_fr)
                        : language === "EN"
                        ? (feat.name_en || feat.name_fr)
                        : feat.name_fr}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <MagneticButton
                onClick={() => handlePlanClick(plan)}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-sm relative z-10 ${featured
                  ? "bg-[#dab055] hover:bg-white hover:text-[#1c1c1b] text-white"
                  : "bg-[#fcf9f6] group-hover:bg-[#dab055] text-[#1c1c1b] group-hover:text-white border border-[#dab055]/30"
                  }`}
              >
                {t("pricing.start")}
              </MagneticButton>
            </motion.div>
          )})}
        </motion.div>
      </div>

      {/* Booking / Lead Generation Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPlanForOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              dir={language === "AR" ? "rtl" : "ltr"}
              className="bg-white rounded-[2.5rem] border border-[#dab055]/20 shadow-2xl p-8 max-w-md w-full relative z-10 text-[#1c1c1b] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#dab055]/10 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-2xl font-bold font-headline mb-2 text-[#1c1c1b]">
                {modalTranslations[language as keyof typeof modalTranslations]?.title || modalTranslations.FR.title}
              </h3>
              <p className="text-xs text-[#1c1c1b]/60 mb-6 font-body leading-relaxed">
                {modalTranslations[language as keyof typeof modalTranslations]?.subtitle || modalTranslations.FR.subtitle}
                <span className="font-bold text-[#dab055] block mt-1">
                  {selectedPlanForOrder.name} ({selectedPlanForOrder.price} DH HT)
                </span>
              </p>

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                {orderError && (
                  <p className="text-xs text-red-500 font-semibold mb-2">{orderError}</p>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {modalTranslations[language as keyof typeof modalTranslations]?.nameLabel || modalTranslations.FR.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    placeholder={modalTranslations[language as keyof typeof modalTranslations]?.namePlaceholder || modalTranslations.FR.namePlaceholder}
                    className="w-full bg-[#fcf9f6] border border-gray-100 rounded-xl p-4 outline-none focus:border-[#dab055] focus:shadow-[0_0_0_3px_rgba(218,176,85,0.2)] transition-all font-body text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {modalTranslations[language as keyof typeof modalTranslations]?.phoneLabel || modalTranslations.FR.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    placeholder={modalTranslations[language as keyof typeof modalTranslations]?.phonePlaceholder || modalTranslations.FR.phonePlaceholder}
                    className="w-full bg-[#fcf9f6] border border-gray-100 rounded-xl p-4 outline-none focus:border-[#dab055] focus:shadow-[0_0_0_3px_rgba(218,176,85,0.2)] transition-all font-body text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {modalTranslations[language as keyof typeof modalTranslations]?.emailLabel || modalTranslations.FR.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={orderForm.email}
                    onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                    placeholder={modalTranslations[language as keyof typeof modalTranslations]?.emailPlaceholder || modalTranslations.FR.emailPlaceholder}
                    className="w-full bg-[#fcf9f6] border border-gray-100 rounded-xl p-4 outline-none focus:border-[#dab055] focus:shadow-[0_0_0_3px_rgba(218,176,85,0.2)] transition-all font-body text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    {modalTranslations[language as keyof typeof modalTranslations]?.cancelBtn || modalTranslations.FR.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    disabled={isOrdering}
                    className="flex-1 py-4 bg-[#1c1c1b] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#dab055] transition-colors disabled:opacity-55"
                  >
                    {isOrdering ? "..." : (modalTranslations[language as keyof typeof modalTranslations]?.confirmBtn || modalTranslations.FR.confirmBtn)}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
