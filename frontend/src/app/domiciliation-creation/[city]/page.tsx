import React from "react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { getLocalizedMetadata } from "@/lib/metadata";
import { LazyMotion, domAnimation } from "framer-motion";

// Components
import Hero from "@/components/sections/Hero";
import Expertise from "@/components/sections/Expertise";
import Pricing from "@/components/sections/Pricing";
import Calculator from "@/components/sections/Calculator";
import Steps from "@/components/sections/Steps";
import Leadership from "@/components/sections/Leadership";
import Team from "@/components/sections/Team";
import BlogSection from "@/components/sections/BlogSection";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const headersList = await headers();
  const rawLang = headersList.get("x-locale")?.toUpperCase() || "FR";
  const language = ["FR", "AR", "EN"].includes(rawLang) ? rawLang : "FR";

  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

  const titles: Record<string, string> = {
    FR: `Domiciliation & Création d'Entreprise à ${capitalizedCity} | TAW 10`,
    AR: `توطين وإنشاء الشركات في ${capitalizedCity === "Casablanca" ? "الدار البيضاء" : capitalizedCity === "Rabat" ? "الرباط" : capitalizedCity === "Marrakech" ? "مراكش" : capitalizedCity === "Agadir" ? "أكادير" : capitalizedCity === "Tanger" ? "طنجer" : capitalizedCity} | TAW 10`,
    EN: `Business Domiciliation & Company Creation in ${capitalizedCity} | TAW 10`,
  };

  const descriptions: Record<string, string> = {
    FR: `TAW 10 vous accompagne pour la domiciliation de votre siège social et la création de votre entreprise à ${capitalizedCity}. Profitez d'une adresse de prestige et de services premium.`,
    AR: `ترافقكم TAW 10 في توطين مقر شركتكم وإنشاء مقاولتكم في ${capitalizedCity === "Casablanca" ? "الدار البيضاء" : capitalizedCity === "Rabat" ? "الرباط" : capitalizedCity === "Marrakech" ? "مراكش" : capitalizedCity === "Agadir" ? "أكادير" : capitalizedCity === "Tanger" ? "طنجة" : capitalizedCity}. استفد من عنوان مرموق وخدمات متميزة.`,
    EN: `TAW 10 supports you with business domiciliation and company creation in ${capitalizedCity}. Benefit from a prestigious address and premium corporate services.`,
  };

  return getLocalizedMetadata(titles[language], descriptions[language]);
}

export default async function CityLandingPage({ params }: PageProps) {
  const { city } = await params;
  
  return (
    <LazyMotion features={domAnimation}>
      <main>
        <Hero city={city} />
        <Expertise />
        <Pricing />
        <Calculator />
        <Steps />
        <Leadership />
        <Team />
        <BlogSection />
        <FAQ />
        <Contact />
      </main>
    </LazyMotion>
  );
}
