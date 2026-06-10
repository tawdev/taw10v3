import React from "react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { getLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const rawLang = headersList.get("x-locale")?.toUpperCase() || "FR";
  const language = ["FR", "AR", "EN"].includes(rawLang) ? rawLang : "FR";

  const titles: Record<string, string> = {
    FR: "Domiciliation Maroc & Création Entreprise Marrakech | TAW 10",
    AR: "توطين الشركات وإنشاء المقاولات في المغرب | TAW 10",
    EN: "Business Domiciliation & Company Creation Morocco | TAW 10",
  };

  const descriptions: Record<string, string> = {
    FR: "TAW 10 offre les meilleures solutions de domiciliation au Maroc, création d'entreprise à Marrakech et accompagnement juridique premium pour entrepreneurs.",
    AR: "تقدم TAW 10 أفضل حلول توطين الشركات في المغرب، وإنشاء المقاولات في مراكش، والمواكبة القانونية المتميزة للمقاولين.",
    EN: "TAW 10 provides premium business domiciliation in Morocco, company formation in Marrakech, and strategic legal support for entrepreneurs.",
  };

  return getLocalizedMetadata(titles[language], descriptions[language]);
}

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

export default function Home() {
  return (
    <LazyMotion features={domAnimation}>
      <main>
        <Hero />
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
