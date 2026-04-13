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
      "streetAddress": "Centre commercial Carré Eden, Guéliz",
      "addressLocality": "Marrakech",
      "postalCode": "40000",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 31.6346,
      "longitude": -8.0150
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
      "closes": "18:00"
    },
    "sameAs": [
      CONFIG.socials.facebook,
      CONFIG.socials.instagram
    ],
    "services": [
      {
        "@type": "Service",
        "name": "Domiciliation d'entreprise",
        "description": "Adresse prestigieuse pour votre siège social à Marrakech."
      },
      {
        "@type": "Service",
        "name": "Création d'entreprise",
        "description": "Accompagnement complet pour la création de votre société au Maroc."
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default SchemaMarkup;
