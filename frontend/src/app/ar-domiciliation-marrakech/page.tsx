import React from "react";
import { Metadata } from "next";
import LandingPage from "@/components/layout/LandingPage";
import { getLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getLocalizedMetadata(
    "توطين الشركات مراكش | المقر الاجتماعي في المغرب | TAW10",
    "قم بتوطين شركتك في مراكش في عنوان تجاري مرموق مع TAW10. نوفر لك خدمات السكرتارية الافتراضية، إدارة البريد والمواكبة القانونية الشاملة."
  );
  return {
    ...meta,
    keywords: ["توطين الشركات مراكش", "المقر الاجتماعي مراكش", "إنشاء المقاولات المغرب", "عنوان تجاري مراكش"],
  };
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TAW 10 - توطين الشركات مراكش",
    "description": "خدمات توطين الشركات والمقرات الاجتماعية المتميزة في مراكش، المغرب.",
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
      question: "ماذا يعني توطين الشركات في المغرب؟",
      answer: "توطين الشركة هو إجراء قانوني يسمح للمقاول بتسجيل المقر الاجتماعي لشركته في مركز أعمال معتمد دون الحاجة إلى استئجار مكتب تجاري مكلف."
    },
    {
      question: "هل يمكن للمستثمرين الأجانب الاستفادة من خدمة التوطين؟",
      answer: "نعم، يعتبر التوطين خياراً ممتازاً ومحبباً جداً للشركات الأجنبية ورواد الأعمال الراغبين في تأسيس حضور رسمي وقانوني في المغرب بأقل التكاليف."
    }
  ];

  return (
    <LandingPage
      language="AR"
      title="توطين الشركات مراكش"
      subtitle="مقر اجتماعي متميز وسكرتارية افتراضية"
      description="امنح شركتك عنواناً تجارياً مرموقاً في شارع علال الفاسي بمراكش. بسّط الإجراءات الإدارية والضريبية لمشروعك اليوم."
      h1="توطين الشركات والمقاولات في مراكش"
      h2="حلول متكاملة ومرنة لهوية شركتك في المغرب"
      ctaText="توطين شركتي الآن"
      ctaLink="/ar#contact"
      faqs={faqs}
      localBusinessSchema={schema}
      content={
        <div className="space-y-6 text-right">
          <p>
            تعتبر TAW10 مركز الأعمال الرائد في مراكش لتقديم خدمات التوطين التجاري والضريبي. سواء كنت مقاولاً ذاتياً، مستشاراً مستقلاً أو شركة دولية، فإن حلولنا مصممة لتلبية تطلعاتك.
          </p>
          <h3 className="text-xl font-bold text-[#1c1c1b] mt-6">مزايا التوطين مع TAW10:</h3>
          <ul className="list-disc pr-6 space-y-2">
            <li><strong>عنوان مرموق:</strong> سجل مقرك في أحد أنشط شوارع الأعمال بمراكش.</li>
            <li><strong>إدارة المراسلات:</strong> استقبال وفرز وتصوير رسائلكم اليومية الهامة.</li>
            <li><strong>قاعات الاجتماعات:</strong> إمكانية استخدام فضاءات العمل لعقد اجتماعاتكم المهنية.</li>
            <li><strong>سكرتارية محترفة:</strong> استقبال وتوجيه مكالماتكم بكفاءة عالية.</li>
          </ul>
        </div>
      }
    />
  );
}
