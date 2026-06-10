"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf9f6] px-8">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#dab055] font-label uppercase tracking-[0.5em] text-4xl font-black block mb-4">404</span>
          <h1 className="text-5xl md:text-7xl font-bold text-[#1c1c1b] mb-8 font-headline tracking-tighter shadow-text">Oups ! Page introuvable.</h1>
          <p className="text-xl text-[#1c1c1b]/60 mb-12 leading-relaxed font-body">
            Il semble que l'adresse recherchée n'existe plus ou a été déplacée. 
            Rejoignez l'excellence de TAW 10 en revenant à l'accueil.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/"
              className="bg-[#1c1c1b] text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#dab055] transition-all shadow-xl hover:shadow-[#dab055]/30"
            >
              Retour à l'accueil
            </Link>
            <Link 
              href="/#contact"
              className="border-2 border-[#1c1c1b] text-[#1c1c1b] px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#1c1c1b] hover:text-white transition-all"
            >
              Nous contacter
            </Link>
          </div>
        </motion.div>
        
        <div className="mt-24 pt-12 border-t border-[#dab055]/10">
          <p className="text-[10px] text-[#1c1c1b]/30 font-bold uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} TAW 10 — Marrakech, Maroc
          </p>
        </div>
      </div>
    </div>
  );
}
