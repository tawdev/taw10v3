import React from "react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { getLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const rawLang = headersList.get("x-locale")?.toUpperCase() || "FR";
  const language = ["FR", "AR", "EN"].includes(rawLang) ? rawLang : "FR";

  const titles: Record<string, string> = {
    FR: "Domiciliation Maroc & Création d'Entreprise Marrakech | TAW 10",
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TAW 10 Consulting",
    "alternateName": "TAW 10",
    "url": "https://taw10.ma",
    "logo": "https://taw10.ma/icon-512.png",
    "sameAs": [
      "https://www.facebook.com/taw10.ma/",
      "https://www.instagram.com/tawteen_10/",
      "https://linkedin.com/company/taw10"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TAW 10",
    "image": "https://taw10.ma/icon-512.png",
    "telephone": "+212 5 24 30 80 38",
    "email": "contact@taw10.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "48 Lot IGUIDER, Allal El Fassi",
      "addressLocality": "Marrakech",
      "postalCode": "40000",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 31.6497,
      "longitude": -8.0125
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
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
