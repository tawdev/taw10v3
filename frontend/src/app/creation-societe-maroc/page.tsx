import React from "react";
import { Metadata } from "next";
import LandingPage from "@/components/layout/LandingPage";
import { getLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getLocalizedMetadata(
    "Création de Société au Maroc | Services aux Entreprises | TAW10",
    "Créez votre société au Maroc en toute sérénité. TAW10 gère la totalité du processus juridique, fiscal et administratif pour votre SARL, SA ou filiale."
  );
  return {
    ...meta,
    keywords: ["creation societe maroc", "creer entreprise maroc", "sarl maroc", "formalites administratives maroc"],
  };
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TAW 10 - Création Société Maroc",
    "description": "Services premium d'accompagnement juridique et de création de société partout au Maroc.",
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
      question: "Qu'est-ce qu'une SARL au Maroc ?",
      answer: "La SARL (Société à Responsabilité Limitée) est la forme de société la plus courante au Maroc. Elle protège le patrimoine des associés à hauteur de leurs apports et n'exige aucun capital minimum obligatoire fixé par la loi."
    },
    {
      question: "Puis-je créer une entreprise au Maroc à distance ?",
      answer: "Oui, grâce à une procuration légale que vous donnez à nos conseillers juridiques TAW10, nous pouvons effectuer la quasi-totalité des formalités de création de votre entreprise au Maroc sans que vous ayez besoin de vous déplacer."
    }
  ];

  return (
    <LandingPage
      language="FR"
      title="Création société Maroc"
      subtitle="Conseil & Solutions Juridiques au Maroc"
      description="Immatriculez votre structure légale au Maroc avec nos avocats et conseillers comptables. Nos forfaits couvrent les démarches de A à Z avec la domiciliation incluse."
      h1="Création de Société Simplifiée et Sécurisée au Maroc"
      h2="Votre Partenaire de Confiance pour Investir au Maroc"
      ctaText="Démarrer mon projet au Maroc"
      ctaLink="/fr#contact"
      faqs={faqs}
      localBusinessSchema={schema}
      content={
        <div className="space-y-6">
          <p>
            Le Maroc offre un climat d'affaires propice à l'investissement et à la création de valeur. Pour vous implanter avec succès, TAW10 vous propose un accompagnement sur mesure comprenant la rédaction des actes, la négociation avec les administrations et le conseil fiscal stratégique.
          </p>
          <h3 className="text-xl font-bold text-[#1c1c1b] mt-6">Notre offre clé en main comprend :</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Certificat Négatif :</strong> Recherche et dépôt de votre nom commercial auprès de l'OMPIC.</li>
            <li><strong>Rédaction des Actes :</strong> Statuts personnalisés rédigés par nos experts en droit des affaires marocain.</li>
            <li><strong>Formalités administratives :</strong> Enregistrement fiscal, patente, numéro d'identifiant unique (ICE), et immatriculation finale.</li>
          </ul>
        </div>
      }
    />
  );
}
