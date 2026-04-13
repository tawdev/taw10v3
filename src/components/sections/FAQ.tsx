"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const FAQ = () => {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const questions = [
    { key: "faq.q1", aKey: "faq.a1" },
    { key: "faq.q2", aKey: "faq.a2" },
    { key: "faq.q3", aKey: "faq.a3" },
    { key: "faq.q4", aKey: "faq.a4" },
  ];

  return (
    <section className="py-24 bg-[#fcf9f6] relative overflow-hidden" id="faq">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#dab055]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1c1c1b]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#dab055] font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-[#1c1c1b] mb-6">
            {t("faq.title")}
          </h2>
          <div className="w-20 h-1 bg-[#dab055] mx-auto"></div>
        </motion.div>

        <div className="space-y-4">
          {questions.map((item, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-8 py-7 flex items-center justify-between text-left group"
                dir={language === "AR" ? "rtl" : "ltr"}
              >
                <span className={`text-lg font-bold transition-colors duration-300 ${activeIndex === index ? 'text-[#dab055]' : 'text-[#1c1c1b]'}`}>
                  {t(item.key)}
                </span>
                <motion.span 
                  className={`material-symbols-outlined text-[#dab055] transition-transform duration-500 ${activeIndex === index ? 'rotate-180' : ''}`}
                >
                  expand_more
                </motion.span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div 
                      className="px-8 pb-8 text-[#1c1c1b]/60 leading-relaxed font-body"
                      dir={language === "AR" ? "rtl" : "ltr"}
                    >
                      {t(item.aKey)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
