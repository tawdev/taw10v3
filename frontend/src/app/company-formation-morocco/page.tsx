import React from "react";
import { Metadata } from "next";
import LandingPage from "@/components/layout/LandingPage";
import { getLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getLocalizedMetadata(
    "Company Formation Morocco | Register Business Marrakech | TAW10",
    "Incorporate your company in Morocco. TAW10 manages everything from name clearance (certificat négatif) to tax registration and commercial register."
  );
  return {
    ...meta,
    keywords: ["company formation morocco", "business registration marrakech", "sarl morocco setup", "register company maroc"],
  };
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TAW 10 - Company Formation Morocco",
    "description": "Professional business setup and corporate incorporation services in Morocco.",
    "telephone": "+212 5 24 30 80 38",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "48 Lot IGUIDER, Allal El Fassi",
      "addressLocality": "Marrakech",
      "postalCode": "40000",
      "addressCountry": "MA"
    }
  };

  const faqs = [
    {
      question: "What is the most popular company structure in Morocco?",
      answer: "The SARL (Société à Responsabilité Limitée) is the most popular corporate structure. It requires at least one shareholder, limits liability to capital contributions, and has no legal minimum capital requirement."
    },
    {
      question: "Can foreigners own 100% of a Moroccan company?",
      answer: "Yes, in most sectors, foreign individuals and foreign entities can have 100% ownership of a Moroccan corporation without needing a local partner."
    }
  ];

  return (
    <LandingPage
      language="EN"
      title="Company Formation Morocco"
      subtitle="Corporate Incorporation & Accounting Services"
      description="Start your business venture in Morocco. Our corporate advisors take care of legal drafting, trade registry, tax setup, and patent declarations."
      h1="Hassle-Free Company Formation in Morocco"
      h2="Turn Your Business Vision into Reality in Morocco"
      ctaText="Start my company registration"
      ctaLink="/en#contact"
      faqs={faqs}
      localBusinessSchema={schema}
      content={
        <div className="space-y-6">
          <p>
            Incorpating a new business in Morocco requires executing multi-layered legal procedures. At TAW10, we make it seamless. Our business setup packages are designed for international investors, consultants, and tech startups.
          </p>
          <h3 className="text-xl font-bold text-[#1c1c1b] mt-6">Our Incorporation Package Includes:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Name Search:</strong> Securing the negative certificate (Certificat Négatif) from OMPIC.</li>
            <li><strong>Articles of Association:</strong> Drafting tailored corporate statutes complying with Moroccan law.</li>
            <li><strong>Administrative Registration:</strong> Tax registration, Chamber of Commerce membership, and Trade Register immatriculation (Registre de Commerce).</li>
          </ul>
        </div>
      }
    />
  );
}
