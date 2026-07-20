import React from "react";
import { Metadata } from "next";
import LandingPage from "@/components/layout/LandingPage";
import { getLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getLocalizedMetadata(
    "إنشاء Companies في المغرب | تأسيس المقاولات | TAW10",
    "أسس شركتك في المغرب بأمان وسرعة مع خبراء TAW10. نهتم بكافة الإجراءات القانونية والإدارية من البداية وحتى الحصول على السجل التجاري."
  );
  return {
    ...meta,
    keywords: ["انشاء شركة المغرب", "تأسيس شركة مراكش", "سجل تجاري المغرب", "شهادة سلبية مراكش"],
  };
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TAW 10 - إنشاء الشركات في المغرب",
    "description": "مواكبة قانونية وإدارية متكاملة لتأسيس المقاولات والشركات في المغرب.",
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
      question: "ما هي المتطلبات الأساسية لتأسيس شركة SARL بالمغرب؟",
      answer: "لتأسيس شركة ذات مسؤولية محدودة (SARL)، تحتاج إلى شهادة سلبية لاسم الشركة، صياغة النظام الأساسي، تحديد المقر الاجتماعي (عن طريق التوطين مثلاً)، وإيداع ملف التأسيس لدى المحكمة التجارية."
    },
    {
      question: "ما هي المدة الزمنية المطلوبة لإنشاء الشركة؟",
      answer: "مع مرافقة فريق TAW10، تستغرق عملية التأسيس واستلام السجل التجاري وباقي الوثائق القانونية عادة ما بين 7 إلى 15 يوماً فقط."
    }
  ];

  return (
    <LandingPage
      language="AR"
      title="إنشاء شركة في المغرب"
      subtitle="تأسيس ومواكبة قانونية من البداية للنهاية"
      description="يتولى خبراؤنا القانونيون والمحاسبون إدارة جميع معاملات وإجراءات تأسيس شركم في المغرب. احصل على سجلكم التجاري والتعريف الموحد للمقاولة (ICE) بسرعة."
      h1="تأسيس وإنشاء الشركات في المغرب بكل يسر"
      h2="مشروعكم المقاولاتي في أيدي خبراء ومحترفين"
      ctaText="ابدأ تأسيس شركتك الآن"
      ctaLink="/ar#contact"
      faqs={faqs}
      localBusinessSchema={schema}
      content={
        <div className="space-y-6 text-right">
          <p>
            تأسيس نشاط تجاري جديد قد يبدو معقداً نتيجة المتطلبات الإدارية المتعددة. تسعى TAW10 لتسهيل كل هذه الخطوات عبر التكفل التام بكافة الجوانب القانونية والضريبية اللازمة لإطلاق مقاولتكم في المغرب.
          </p>
          <h3 className="text-xl font-bold text-[#1c1c1b] mt-6">مجموعتنا المتكاملة لتأسيس الشركات تشمل:</h3>
          <ul className="list-disc pr-6 space-y-2">
            <li><strong>الشهادة السلبية:</strong> طلب وحجز الاسم التجاري الخاص بشركتكم لدى المكتب المغربي للملكية الصناعية والتجارية (OMPIC).</li>
            <li><strong>صياغة النظام الأساسي:</strong> كتابة وتوثيق القانون الأساسي للشركة بما يتوافق مع القوانين المغربية الجاري بها العمل.</li>
            <li><strong>التسجيلات الإدارية:</strong> التسجيل في الضريبة المهنية (Patente)، رقم التعريف الضريبي، الضمان الاجتماعي (CNSS) والسجل التجاري.</li>
          </ul>
        </div>
      }
    />
  );
}
