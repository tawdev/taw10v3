"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { faqService } from "@/services/faq.service";
import { faqs as fallbackFaqs } from "@/store/admin-data";
import { FaqItem } from "@/types/admin";

type Reaction = "like" | "dislike";

const FAQ = () => {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [questions, setQuestions] = useState<FaqItem[]>(fallbackFaqs.filter((item) => item.isActive));
  const [reactions, setReactions] = useState<Record<string, Reaction>>({});

  useEffect(() => {
    faqService
      .publicList()
      .then((items) => setQuestions(items))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("taw10_faq_reactions");
      if (saved) setReactions(JSON.parse(saved) as Record<string, Reaction>);
    } catch {
      setReactions({});
    }
  }, []);

  const sortedQuestions = useMemo(() => [...questions].sort((a, b) => a.sortOrder - b.sortOrder), [questions]);

  async function react(item: FaqItem, type: Reaction) {
    if (reactions[item.id]) return;

    const nextReactions = { ...reactions, [item.id]: type };
    setReactions(nextReactions);
    window.localStorage.setItem("taw10_faq_reactions", JSON.stringify(nextReactions));

    setQuestions((items) =>
      items.map((faq) =>
        faq.id === item.id
          ? {
              ...faq,
              likeCount: (faq.likeCount ?? 0) + (type === "like" ? 1 : 0),
              dislikeCount: (faq.dislikeCount ?? 0) + (type === "dislike" ? 1 : 0),
            }
          : faq,
      ),
    );

    try {
      const updated = await faqService.react(item.id, type);
      setQuestions((items) => items.map((faq) => (faq.id === updated.id ? updated : faq)));
    } catch {
      // Keep the optimistic local vote; the API may be unavailable in local preview.
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#fcf9f6] py-24" id="faq">
      <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#dab055]/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#1c1c1b]/5 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.3em] text-[#dab055]">FAQ</span>
          <h2 className="mb-6 font-headline text-4xl font-bold text-[#1c1c1b] md:text-5xl">
            {t("faq.title")}
          </h2>
          <div className="mx-auto h-1 w-20 bg-[#dab055]"></div>
        </motion.div>

        <div className="space-y-4">
          {sortedQuestions.map((item, index) => {
            const selectedReaction = reactions[item.id];
            const lang = language.toLowerCase();
            const question = item[`question_${lang}` as keyof FaqItem] as string || item.question_fr;
            const answer = item[`answer_${lang}` as keyof FaqItem] as string || item.answer_fr;

            return (
              <motion.div
                key={item.id}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="group flex w-full items-center justify-between px-8 py-7 text-left"
                  dir={language === "AR" ? "rtl" : "ltr"}
                >
                  <span className={`text-lg font-bold transition-colors duration-300 ${activeIndex === index ? "text-[#dab055]" : "text-[#1c1c1b]"}`}>
                    {question}
                  </span>
                  <motion.span className={`material-symbols-outlined text-[#dab055] transition-transform duration-500 ${activeIndex === index ? "rotate-180" : ""}`}>
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
                      <div className="px-8 pb-8" dir={language === "AR" ? "rtl" : "ltr"}>
                        <p className="font-body leading-relaxed text-[#1c1c1b]/60">{answer}</p>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a8172]">
                            {language === "AR" ? "هل كانت مفيدة؟" : language === "EN" ? "Was this helpful?" : "Cette reponse est utile ?"}
                          </span>
                          <button
                            type="button"
                            onClick={() => react(item, "like")}
                            disabled={Boolean(selectedReaction)}
                            className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-bold transition ${
                              selectedReaction === "like"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-[#eee8dd] bg-[#fcf9f6] text-[#4f5b54] hover:border-emerald-200 hover:text-emerald-700 disabled:opacity-60"
                            }`}
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                            {item.likeCount ?? 0}
                          </button>
                          <button
                            type="button"
                            onClick={() => react(item, "dislike")}
                            disabled={Boolean(selectedReaction)}
                            className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-bold transition ${
                              selectedReaction === "dislike"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-[#eee8dd] bg-[#fcf9f6] text-[#4f5b54] hover:border-red-200 hover:text-red-700 disabled:opacity-60"
                            }`}
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                            {item.dislikeCount ?? 0}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
