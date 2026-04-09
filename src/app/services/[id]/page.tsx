"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { servicesData } from "@/data/services";

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { language, t } = useLanguage();
  
  // Get services for current language, fallback to FR
  const langServices = servicesData[language] || servicesData["FR"];
  const service = langServices[id];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f6]">
        <div className="text-center">
          <h1 className="text-4xl font-headline font-bold text-[#1c1c1b] mb-4">
            {language === "AR" ? "الخدمة غير موجودة" : language === "EN" ? "Service not found" : "Service non trouvé"}
          </h1>
          <Link href="/" className="text-[#dab055] font-bold hover:underline">
            {language === "AR" ? "العودة للرئيسية" : language === "EN" ? "Back to home" : "Retour à l'accueil"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 z-0">
          <Image 
            src={id === "domiciliation" ? "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2000&auto=format&fit=crop" : 
                 id === "creation-entreprise" ? "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop" :
                 id === "secretariat" ? "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2000&auto=format&fit=crop" :
                 id === "accompagnement-juridique" ? "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2000&auto=format&fit=crop" :
                 id === "support-administratif" ? "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop" :
                 "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop"} 
            alt={service.title} 
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.3] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-transparent to-transparent opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 w-full relative z-10 pt-20">
          <div className="max-w-4xl">
            <nav className="mb-8 overflow-hidden">
               <Link href="/#expertise" className="text-[10px] font-bold tracking-[0.3em] text-[#dab055] uppercase flex items-center gap-3 group">
                <span className={`material-symbols-outlined text-sm transition-transform ${language === 'AR' ? 'group-hover:translate-x-2 rotate-180' : 'group-hover:-translate-x-2'}`}>arrow_back</span>
                {t("service.back")}
              </Link>
            </nav>
            <span className="text-[#dab055] font-label uppercase tracking-[0.4em] text-xs font-bold mb-6 block">
              {t("service.label")}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-headline text-white mb-8 tracking-tight leading-[1.1] drop-shadow-2xl">
              {service.title.split(' ')[0]} <br />
              <span className="italic font-normal text-[#dab055]">{service.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-headline italic max-w-2xl leading-relaxed drop-shadow-md">
              {service.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-32 bg-white relative z-10 -mt-20 rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Main Text Content */}
            <div className="lg:col-span-7 space-y-16">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-[#1c1c1b] leading-tight">
                  {t("service.heritage")}
                </h2>
                <div className="w-20 h-1 bg-[#dab055]/20 rounded-full"></div>
                <p className="text-xl text-[#1c1c1b]/70 leading-relaxed font-body" dangerouslySetInnerHTML={{ __html: service.description }}>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-12">
                {service.features.map((feature: any) => (
                  <div key={feature.id} className="flex gap-8 group">
                    <span className="text-6xl font-headline text-[#dab055]/10 group-hover:text-[#dab055] transition-colors duration-500 font-bold shrink-0">
                      {feature.id}
                    </span>
                    <div className="space-y-4">
                      <h4 className="text-2xl font-bold font-headline text-[#1c1c1b] group-hover:text-[#dab055] transition-colors">{feature.name}</h4>
                      <p className="text-[#1c1c1b]/60 leading-relaxed text-lg">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Benefits Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 bg-[#fcf9f6] p-8 md:p-12 rounded-[4rem] border border-[#dab055]/10 shadow-2xl space-y-10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#dab055]/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                
                <h3 className="text-3xl font-headline font-bold text-[#1c1c1b]">
                  {t("service.cta_title").split(' ')[0]} <br /> <span className="text-[#dab055] italic uppercase font-bold">{t("service.cta_title").split(' ').slice(1).join(' ')}</span>
                </h3>
                
                <ul className="space-y-6">
                  {service.benefits.map((benefit: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4 text-[#1c1c1b]/80 font-medium text-lg">
                      <div className="mt-1.5 shrink-0 w-5 h-5 bg-[#dab055] rounded-full flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/#contact" 
                  className="block w-full bg-[#dab055] text-white py-6 rounded-3xl text-center font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#ceb674] transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl mt-4"
                >
                  {t("service.cta_button")}
                </Link>
                
                <div className="flex flex-col items-center gap-4 pt-4">
                   <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                         <Image 
                           src={`https://i.pravatar.cc/100?u=${i+10}`} 
                           alt="client"
                           width={32}
                           height={32}
                           className="w-full h-full object-cover"
                         />
                       </div>
                     ))}
                   </div>
                   <p className="text-[10px] text-[#1c1c1b]/40 font-bold uppercase tracking-widest text-center">
                     {t("service.join")}
                   </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#0f172a] text-white relative group">
        <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30">
          <Image 
            src="/luxury_marrakech_office_hero_1775496536100.png" 
            alt="Marrakech business" 
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-12">
           <span className="text-[#dab055] font-label uppercase tracking-[0.5em] text-xs font-bold block">
            {t("service.ready")}
          </span>
          <h2 className="text-5xl md:text-7xl font-bold font-headline tracking-tight leading-tight">
            {t("service.ready_title").split(' ').slice(0, 3).join(' ')} <br />
            <span className="italic font-normal text-[#dab055]">{t("service.ready_title").split(' ').slice(3).join(' ')}</span>
          </h2>
          <Link 
            href="/#contact" 
            className="inline-flex items-center gap-6 bg-white text-[#0f172a] px-14 py-7 rounded-full font-bold uppercase tracking-widest hover:bg-[#dab055] hover:text-white transition-all shadow-2xl transform hover:scale-105"
          >
            {t("service.ready_button")}
            <span className={`material-symbols-outlined font-bold ${language === 'AR' ? 'rotate-180' : ''}`}>north_east</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
