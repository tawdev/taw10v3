"use client";

import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { CONFIG } from "@/data/config";

export default function WhatsappContact() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleChat = () => setIsOpen(!isOpen);

    // TAW 10 Brand Colors
    const primaryColor = "#1c1c1b"; // Signature Deep Charcoal
    const secondaryColor = "#dab055"; // Signature Gold

    if (!mounted) return null;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleChat}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-24 md:bottom-28 right-4 md:right-8 z-50 w-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white font-outfit"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    >
                        <div className="p-7 text-white" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #0f172a 100%)` }}>
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                    <FaWhatsapp size={24} className="text-secondaryColor" style={{ color: secondaryColor }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold tracking-tight">{t("whatsapp.title")}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-xs text-white/60 uppercase tracking-widest font-bold">{t("whatsapp.status")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-7 space-y-5">
                            <p className="text-slate-500 text-sm leading-relaxed font-light">{t("whatsapp.description")}</p>
                            <a
                                href={`https://wa.me/${CONFIG.contact.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                  if (typeof window !== 'undefined' && (window as any).dataLayer) {
                                    if (typeof window !== 'undefined' && (window as Window & { dataLayer?: any[] }).dataLayer) {
                                      (window as Window & { dataLayer: any[] }).dataLayer.push({ event: 'whatsapp_engagement', status: 'opened' });
                                    }
                                  }
                                }}
                                className="flex items-center justify-between bg-gray-50/50 hover:bg-white p-5 rounded-2xl border border-gray-100 transition-all duration-500 group shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg" style={{ backgroundColor: secondaryColor }}>
                                        T10
                                    </div>
                                    <div>
                                        <span className="block font-bold text-primary">TAW 10</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{t("whatsapp.role")}</span>
                                    </div>
                                </div>
                                <FaWhatsapp size={24} style={{ color: secondaryColor }} className="group-hover:scale-110 transition-transform duration-500" />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-8 right-8 z-50">
                <motion.button
                    onClick={toggleChat}
                    className="relative w-14 h-14 md:w-16 md:h-16 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-center text-white overflow-hidden cursor-pointer active:scale-90 transition-transform"
                    style={{ background: isOpen ? '#ef4444' : `linear-gradient(135deg, ${primaryColor} 0%, #0f172a 100%)` }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ rotate: isOpen ? 0 : [0, -5, 5, -5, 0] }}
                    transition={{ rotate: { duration: 2, repeat: isOpen ? 0 : Infinity, repeatDelay: 3 } }}
                >
                    {isOpen ? <FaTimes size={24} /> : <FaWhatsapp size={28} style={{ color: !isOpen ? secondaryColor : 'white' }} />}
                </motion.button>
            </div>

            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        className="fixed bottom-11 right-28 z-40 bg-white/95 backdrop-blur-xl py-3 px-6 rounded-2xl shadow-2xl border border-gray-100 hidden xl:block font-outfit"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <div className="text-primary font-bold text-sm tracking-tight">{t("whatsapp.tooltip_title")}</div>
                        <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold opacity-60">{t("whatsapp.tooltip_sub")}</div>
                        {/* Triangle decorator */}
                        <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-3 h-3 bg-white border-r border-t border-gray-100 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
