import React from "react";
import { Metadata } from "next";
import LandingPage from "@/components/layout/LandingPage";
import { getLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getLocalizedMetadata(
    "Business Domiciliation Marrakech | Registered Office Morocco | TAW10",
    "Register your company address in Marrakech at a prime location with TAW10. Virtual office services, mail forwarding, and legal support for international businesses."
  );
  return {
    ...meta,
    keywords: ["business domiciliation marrakech", "registered office morocco", "virtual address marrakech", "company registration morocco"],
  };
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TAW 10 - Business Domiciliation Marrakech",
    "description": "Premium business domiciliation and virtual office solutions in Marrakech, Morocco.",
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
      question: "What does business domiciliation mean in Morocco?",
      answer: "Business domiciliation is the legal process of establishing a company's registered headquarters address (siège social) at a professional business center instead of buying or renting expensive physical office space."
    },
    {
      question: "Can international investors use a domiciliation address?",
      answer: "Yes, domiciliation is highly popular among foreign investors and international startups wanting to set up a legal entity in Marrakech without initial heavy physical infrastructure costs."
    }
  ];

  return (
    <LandingPage
      language="EN"
      title="Business Domiciliation Marrakech"
      subtitle="Corporate Address & Virtual Office Solutions"
      description="Establish your official company headquarters in Marrakech on the prestigious Allal El Fassi avenue. Benefit from full mail handling, call forwarding, and flexible corporate support."
      h1="Premium Business Domiciliation in Marrakech"
      h2="A Turnkey Solution for Your Corporate Identity in Morocco"
      ctaText="Domiciliate my business"
      ctaLink="/en#contact"
      faqs={faqs}
      localBusinessSchema={schema}
      content={
        <div className="space-y-6">
          <p>
            TAW10 offers premier virtual office address services for startups, remote workers, and international organizations looking to register a legal company in Marrakech, Morocco.
          </p>
          <h3 className="text-xl font-bold text-[#1c1c1b] mt-6">Our Premium Services Include:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Prestigious Business Address:</strong> Enhance your brand image with a corporate location in one of Marrakech's business hubs.</li>
            <li><strong>Mail Handling & Scanning:</strong> Daily receipt, sorting, and optional digital scanning/forwarding of your mail.</li>
            <li><strong>Meeting Rooms:</strong> Fully equipped workspaces to meet clients and partners whenever necessary.</li>
            <li><strong>Virtual Secretary:</strong> Professional customer hosting and telephone management.</li>
          </ul>
        </div>
      }
    />
  );
}
