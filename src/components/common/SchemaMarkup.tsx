import React from 'react';
import { CONFIG } from '@/data/config';

const SchemaMarkup = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": CONFIG.brandName,
    "image": "https://taw10.com/logo.png", // Replace with actual logo URL
    "@id": "https://taw10.com",
    "url": "https://taw10.com",
    "telephone": CONFIG.contact.phone,
    "email": CONFIG.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "48 Lot IGUIDER, Allal El Fassi",
      "addressLocality": "Marrakech",
      "postalCode": "40000",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 31.6346,
      "longitude": -8.0150
    },

    "priceRange": "$$",
    "description": "TAW 10 est la référence premium pour la domiciliation d'entreprise et la création de société à Marrakech, Guéliz.",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "09:00",
        "closes": "13:00"
      }
    ],
    "sameAs": [
      CONFIG.socials.facebook,
      CONFIG.socials.instagram
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services TAW 10",
      "itemListElement": [
        {
          "@type": "Service",
          "name": "Domiciliation d'entreprise à Marrakech",
          "description": "Siège social premium dans le quartier de Guéliz pour votre entreprise au Maroc."
        },
        {
          "@type": "Service",
          "name": "Création de société au Maroc",
          "description": "Accompagnement juridique et administratif complet pour entrepreneurs."
        },
        {
          "@type": "Service",
          "name": "Transfert de siège social",
          "description": "Gestion administrative du changement d'adresse de votre entreprise."
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default SchemaMarkup;
