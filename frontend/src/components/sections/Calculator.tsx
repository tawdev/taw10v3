"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { ordersService } from "@/services/orders.service";

// inside Calculator:
// const { t, language } = useLanguage();
// const { settings } = useSettings();
// ...
// const url = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;

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

const Calculator = () => {
  const { t, language } = useLanguage();
  const { settings } = useSettings();

  const [formType, setFormType] = useState<"sarl" | "auto">("sarl");
  const [duration, setDuration] = useState<"none" | "12m" | "24m">("12m");
  const [extraMail, setExtraMail] = useState(false);
  const [extraLegal, setExtraLegal] = useState(false);

  // Lead modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    phone: "",
    email: "",
  });
  const [orderError, setOrderError] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  const priceMapping = {
    sarl: 2499,
    auto: 500,
    none: 0,
    "12m": 1200,
    "24m": 2500,
    mail: 400,
    legal: 500,
  };

  const total = useMemo(() => {
    let sum = priceMapping[formType];
    if (formType === "sarl") {
      sum += priceMapping[duration];
    }
    if (extraMail) sum += priceMapping.mail;
    if (extraLegal) sum += priceMapping.legal;
    return sum;
  }, [formType, duration, extraMail, extraLegal]);

  const handleOpenModal = () => {
    setOrderForm({ customerName: "", phone: "", email: "" });
    setOrderError("");
    setIsModalOpen(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentTranslations = modalTranslations[language as keyof typeof modalTranslations] || modalTranslations.FR;
    if (!orderForm.customerName.trim() || !orderForm.phone.trim()) {
      setOrderError(currentTranslations.errorRequired);
      return;
    }

    setIsOrdering(true);
    try {
      const sServices = [
        extraMail ? (language === "AR" ? "إدارة البريد" : "Gestion du courrier") : "",
        extraLegal ? (language === "AR" ? "استشارة قانونية" : "Conseil Juridique") : ""
      ].filter(Boolean).join(", ");
      
      const sDuration = formType === "sarl" ? t(`calc.${duration}`) : "";
      
      const notesDetails = [
        `Forme: ${t(`calc.${formType}`)}`,
        sDuration ? `Domiciliation: ${sDuration}` : "",
        sServices ? `Services: ${sServices}` : "",
        `Prix estimé: ${total} DH HT`
      ].filter(Boolean).join("\n");

      // Save order to database
      await ordersService.create({
        customerName: orderForm.customerName,
        phone: orderForm.phone,
        email: orderForm.email || undefined,
        selectedPlan: `Simulateur - ${t(`calc.${formType}`)}`,
        notes: notesDetails,
      });

      // Prepare WhatsApp text
      const text = `Bonjour, je souhaite un devis personnalisé:\n- Client: *${orderForm.customerName}* (${orderForm.phone})\n- Forme: ${t(`calc.${formType}`)}\n- Domiciliation: ${t(`calc.${duration}`)}\n- Extras: ${extraMail ? 'Courrier' : ''} ${extraLegal ? 'Juridique' : ''}\n- Estimation: ${total} ${t("calc.currency")}`;
      const url = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
      
      setIsModalOpen(false);
      window.open(url, '_blank');
    } catch (err) {
      console.error(err);
      setOrderError(language === "AR" ? "فشل في تقديم الطلب. يرجى المحاولة مرة أخرى." : "Échec de l'envoi de la demande. Veuillez réessayer.");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="simulateur">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#dab055] font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">{t("calc.label")}</span>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-[#1c1c1b] mb-6">
            {t("calc.title")}
          </h2>
          <p className="text-[#1c1c1b]/60 font-body max-w-2xl mx-auto">
            {t("calc.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div className="space-y-10" dir={language === "AR" ? "rtl" : "ltr"}>
            {/* Forme Juridique */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#1c1c1b] mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#dab055] inline-block"></span>
                {t("calc.form")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(["sarl", "auto"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                    setFormType(type);
                    if (type === "auto") setExtraMail(false);
                  }}
                    className={`p-4 rounded-2xl border transition-all duration-300 font-bold text-sm ${
                      formType === type
                        ? "border-[#dab055] bg-[#dab055]/5 text-[#dab055] shadow-[0_10px_30px_rgba(218,176,85,0.1)]"
                        : "border-gray-100 bg-[#fcf9f6] text-[#1c1c1b]/60 hover:border-gray-200"
                    }`}
                  >
                    {t(`calc.${type}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Domiciliation - Hidder for Auto-Entrepreneur per user request */}
            {formType === "sarl" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#1c1c1b] mb-4 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-[#dab055] inline-block"></span>
                  {t("calc.duration")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(["none", "12m", "24m"] as const).map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setDuration(dur)}
                      className={`p-4 rounded-2xl border transition-all duration-300 font-bold text-sm ${
                        duration === dur
                          ? "border-[#dab055] bg-[#dab055]/5 text-[#dab055] shadow-[0_10px_30px_rgba(218,176,85,0.1)]"
                          : "border-gray-100 bg-[#fcf9f6] text-[#1c1c1b]/60 hover:border-gray-200"
                      }`}
                    >
                      {t(`calc.${dur}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Services Additionnels */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#1c1c1b] mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#dab055] inline-block"></span>
                {t("calc.services")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formType === "sarl" && (
                  <button
                    onClick={() => setExtraMail(!extraMail)}
                    className={`p-4 rounded-2xl border transition-all duration-300 font-bold text-sm flex justify-between items-center ${
                      extraMail
                        ? "border-[#dab055] bg-[#dab055]/5 text-[#dab055]"
                        : "border-gray-100 bg-[#fcf9f6] text-[#1c1c1b]/60"
                    }`}
                  >
                    {t("calc.mail")}
                    <span className="material-symbols-outlined text-[18px]">
                      {extraMail ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </button>
                )}
                <button
                  onClick={() => setExtraLegal(!extraLegal)}
                  className={`p-4 rounded-2xl border transition-all duration-300 font-bold text-sm flex justify-between items-center ${
                    extraLegal
                      ? "border-[#dab055] bg-[#dab055]/5 text-[#dab055]"
                      : "border-gray-100 bg-[#fcf9f6] text-[#1c1c1b]/60"
                  }`}
                >
                  {t("calc.legal")}
                  <span className="material-symbols-outlined text-[18px]">
                    {extraLegal ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="sticky top-32">
            <motion.div 
              className="bg-[#1c1c1b] rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#dab055]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-[#dab055] text-xs font-bold uppercase tracking-widest mb-2 font-body">
                {t("calc.total")}
              </h3>
              <div className="flex items-end gap-3 mb-8">
                <motion.span 
                  className="text-5xl font-headline font-bold text-white tracking-tighter"
                  key={total}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {total.toLocaleString()}
                </motion.span>
                <span className="text-white/60 font-body mb-2">{t("calc.currency")}</span>
              </div>

              <div className="space-y-4 mb-10 text-white/60 text-sm font-body">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span>{t(`calc.${formType}`)}</span>
                  <span className="text-white">✓</span>
                </div>
                {formType === "sarl" && duration !== "none" && (
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span>{t(`calc.${duration}`)}</span>
                    <span className="text-white">✓</span>
                  </div>
                )}
                {extraMail && (
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span>{t("calc.mail")}</span>
                    <span className="text-white">✓</span>
                  </div>
                )}
                {extraLegal && (
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span>{t("calc.legal")}</span>
                    <span className="text-white">✓</span>
                  </div>
                )}
              </div>

              <button 
                onClick={handleOpenModal}
                className="w-full bg-[#dab055] hover:bg-[#ceb674] text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(218,176,85,0.3)] transition-all flex justify-center items-center gap-3"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                {t("calc.submit")}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Calculator Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
                  {t(`calc.${formType}`)} ({total} {t("calc.currency")})
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
                    className="flex-1 py-4 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors bg-white text-[#1c1c1b]"
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
};

export default Calculator;
