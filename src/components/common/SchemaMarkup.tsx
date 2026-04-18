"use client";

import React from 'react';
import { CONFIG } from '@/data/config';
import { useLanguage } from '@/context/LanguageContext';

const SchemaMarkup = () => {
  const { language, t } = useLanguage();

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": CONFIG.brandName,
    "image": "https://taw10.ma/icon-512.png",
    "@id": "https://taw10.ma",
    "url": "https://taw10.ma",
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
    "description": language === "AR" 
      ? "تقدم TAW 10 أفضل حلول توطين الشركات في المغرب، وإنشاء المقاولات في مراكش، والمواكبة القانونية المتميزة للمقاولين."
      : language === "EN"
      ? "TAW 10 provides premium business domiciliation in Morocco, company formation in Marrakech, and strategic legal support."
      : "TAW 10 est la référence premium pour la domiciliation d'entreprise et la création de société à Marrakech.",
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
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t("faq.q1"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.a1")
        }
      },
      {
        "@type": "Question",
        "name": t("faq.q2"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.a2")
        }
      },
      {
        "@type": "Question",
        "name": t("faq.q3"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.a3")
        }
      },
      {
        "@type": "Question",
        "name": t("faq.q4"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.a4")
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": t("nav.home"),
        "item": "https://taw10.ma"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": t("nav.services"),
        "item": "https://taw10.ma#expertise"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};

export default SchemaMarkup;
