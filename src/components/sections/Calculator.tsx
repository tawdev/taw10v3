"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { CONFIG } from "@/data/config";

const Calculator = () => {
  const { t, language } = useLanguage();

  const [formType, setFormType] = useState<"sarl" | "auto">("sarl");
  const [duration, setDuration] = useState<"none" | "12m" | "24m">("12m");
  const [extraMail, setExtraMail] = useState(false);
  const [extraLegal, setExtraLegal] = useState(false);

  const priceMapping = {
    sarl: 3499,
    auto: 500,
    none: 0,
    "12m": 1200,
    "24m": 2500,
    mail: 400,
    legal: 900,
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

  const handleWhatsAppRoute = () => {
    const text = `Bonjour, je souhaite un devis personnalisé:\n- Forme: ${t(`calc.${formType}`)}\n- Domiciliation: ${t(`calc.${duration}`)}\n- Extras: ${extraMail ? 'Courrier' : ''} ${extraLegal ? 'Juridique' : ''}\n- Estimation: ${total} ${t("calc.currency")}`;
    const url = `https://wa.me/${CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
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
          <span className="text-[#dab055] font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">SIMULATEUR VIP</span>
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
                    onClick={() => setFormType(type)}
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
                onClick={handleWhatsAppRoute}
                className="w-full bg-[#dab055] hover:bg-[#ceb674] text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(218,176,85,0.3)] transition-all flex justify-center items-center gap-3"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                {t("calc.submit")}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
