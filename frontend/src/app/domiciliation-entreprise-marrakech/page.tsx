import React from "react";
import { Metadata } from "next";
import LandingPage from "@/components/layout/LandingPage";
import { getLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getLocalizedMetadata(
    "Domiciliation Entreprise Marrakech | Siège Social Maroc | TAW10",
    "Domiciliez votre entreprise à Marrakech à une adresse prestigieuse avec TAW10. Profitez de services de secrétariat, gestion du courrier et support juridique haut de gamme."
  );
  return {
    ...meta,
    keywords: ["domiciliation marrakech", "siege social marrakech", "domiciliation entreprise maroc", "adresse commerciale marrakech"],
  };
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TAW 10 - Domiciliation Marrakech",
    "description": "Service premium de domiciliation d'entreprise et de secrétariat virtuel au cœur de Marrakech.",
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
      question: "Qu'est-ce que la domiciliation d'entreprise ?",
      answer: "La domiciliation d'entreprise consiste à attribuer une adresse administrative et fiscale (siège social) à votre société sans avoir à louer des locaux commerciaux physiques coûteux."
    },
    {
      question: "Pourquoi choisir Marrakech pour domicilier son entreprise ?",
      answer: "Marrakech est un hub économique dynamique et touristique majeur au Maroc, offrant une image de marque forte et de nombreuses opportunités de croissance pour les entrepreneurs."
    }
  ];

  return (
    <LandingPage
      language="FR"
      title="Domiciliation Entreprise Marrakech"
      subtitle="Siège Social Premium & Secrétariat Virtuel"
      description="Offrez à votre entreprise une adresse commerciale prestigieuse sur l'avenue Allal El Fassi à Marrakech. Simplifiez vos démarches administratives et fiscales dès aujourd'hui."
      h1="Domiciliation d'Entreprise de Prestige à Marrakech"
      h2="Une Solution de Domiciliation Commerciale Complète et Flexible"
      ctaText="Domicilier mon entreprise"
      ctaLink="/fr#contact"
      faqs={faqs}
      localBusinessSchema={schema}
      content={
        <div className="space-y-6">
          <p>
            TAW10 est un centre d'affaires d'excellence proposant des services de domiciliation commerciale et fiscale de premier plan au Maroc. Que vous soyez jeune créateur d'entreprise, consultant indépendant ou entreprise internationale, notre formule s'adapte à vos besoins.
          </p>
          <h3 className="text-xl font-bold text-[#1c1c1b] mt-6">Les Avantages de la Domiciliation avec TAW10 :</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Adresse prestigieuse :</strong> Positionnez votre siège social sur l'un des axes les plus dynamiques de Marrakech (Allal El Fassi).</li>
            <li><strong>Gestion du courrier :</strong> Réception, tri et numérisation quotidienne de vos correspondances importantes.</li>
            <li><strong>Secrétariat virtuel :</strong> Accueil téléphonique personnalisé et gestion professionnelle de vos clients.</li>
            <li><strong>Salles de réunion :</strong> Accès à des espaces de travail équipés pour vos rendez-vous d'affaires.</li>
          </ul>
        </div>
      }
    />
  );
}
