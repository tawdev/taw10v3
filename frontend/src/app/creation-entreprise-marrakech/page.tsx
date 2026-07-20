import React from "react";
import { Metadata } from "next";
import LandingPage from "@/components/layout/LandingPage";
import { getLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getLocalizedMetadata(
    "Création d'Entreprise Marrakech | Créer sa Société au Maroc | TAW10",
    "Créez votre entreprise à Marrakech rapidement et en toute sécurité avec TAW10. Rédaction des statuts, enregistrement OMPIC, patente et Registre du Commerce."
  );
  return {
    ...meta,
    keywords: ["creation entreprise marrakech", "creer societe maroc", "creation sarl marrakech", "registre commerce maroc"],
  };
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TAW 10 - Création d'Entreprise Marrakech",
    "description": "Accompagnement complet de A à Z pour la création de votre société à Marrakech.",
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
      question: "Quelles sont les étapes pour créer une société au Maroc ?",
      answer: "Les étapes incluent l'obtention du certificat négatif de l'OMPIC, la rédaction des statuts de la société, le blocage du capital si nécessaire, le dépôt des documents au Centre Régional d'Investissement (CRI), l'immatriculation au registre du commerce et la publication officielle."
    },
    {
      question: "Quel est le délai de création d'une entreprise au Maroc ?",
      answer: "Avec l'accompagnement de TAW10, le processus de création de société prend généralement entre 7 à 15 jours ouvrables, selon la complexité du dossier."
    }
  ];

  return (
    <LandingPage
      language="FR"
      title="Création d'entreprise Marrakech"
      subtitle="Accompagnement Juridique & Création de A à Z"
      description="Nos experts juridiques s'occupent de toutes les formalités pour créer votre société (SARL, SA, SNC) à Marrakech. Obtenez votre registre du commerce rapidement."
      h1="Création d'Entreprise Simplifiée à Marrakech"
      h2="Votre Projet Entrepreneuriat entre des Mains d'Experts"
      ctaText="Lancer ma création de société"
      ctaLink="/fr#contact"
      faqs={faqs}
      localBusinessSchema={schema}
      content={
        <div className="space-y-6">
          <p>
            Lancer son activité au Maroc peut s'avérer complexe face aux nombreuses exigences administratives. TAW10 simplifie tout le processus en prenant en charge la totalité des démarches juridiques, comptables et administratives nécessaires à la création de votre entité commerciale.
          </p>
          <h3 className="text-xl font-bold text-[#1c1c1b] mt-6">Pourquoi faire confiance à TAW10 ?</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Expertise reconnue :</strong> Une équipe de juristes et de conseillers d'entreprises à votre écoute.</li>
            <li><strong>Gain de temps :</strong> Formalités accélérées auprès de l'OMPIC et du tribunal de commerce.</li>
            <li><strong>Package complet :</strong> Nous proposons également la domiciliation et la gestion administrative post-création.</li>
          </ul>
        </div>
      }
    />
  );
}
