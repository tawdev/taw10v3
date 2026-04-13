import type { Metadata, ResolvingMetadata } from "next";
import { cookies } from "next/headers";
import { Playfair_Display, Plus_Jakarta_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsappContact from "@/components/layout/WhatsappContact";
import CookieConsent from "@/components/layout/CookieConsent";
import SchemaMarkup from "@/components/common/SchemaMarkup";
import { CONFIG } from "@/data/config";
import ConsentWrapper from "@/components/common/ConsentWrapper";
import ErrorLogger from "@/components/common/ErrorLogger";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  preload: true,
});

export async function generateMetadata(
  { params }: { params: { lang?: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get("language")?.value?.toUpperCase() || "FR";
  const language = ["FR", "AR", "EN"].includes(rawLang) ? rawLang : "FR";

  const titles: Record<string, string> = {
    FR: "Domiciliation Maroc & Création Entreprise Marrakech | TAW 10",
    AR: "توطين الشركات وإنشاء المقاولات في المغرب | TAW 10",
    EN: "Business Domiciliation & Company Creation Morocco | TAW 10",
  };

  const descriptions: Record<string, string> = {
    FR: "TAW 10 offre les meilleures solutions de domiciliation au Maroc, création d'entreprise à Marrakech et accompagnement juridique premium pour entrepreneurs.",
    AR: "تقدم TAW 10 أفضل حلول توطين الشركات في المغرب، وإنشاء المقاولات في مراكش، والمواكبة القانونية المتميزة للمقاولين.",
    EN: "TAW 10 provides premium business domiciliation in Morocco, company formation in Marrakech, and strategic legal support for entrepreneurs.",
  };

  return {
    metadataBase: new URL("https://taw10.com"),
    title: {
      default: titles[language] || titles.FR,
      template: `%s | TAW 10`
    },
    description: descriptions[language] || descriptions.FR,
    keywords: [
      "domiciliation maroc", 
      "création entreprise maroc", 
      "domiciliation marrakech", 
      "création entreprise marrakech",
      "bureau virtuel maroc",
      "accompagnement juridique maroc", 
      "TAW 10"
    ],
    alternates: {
      canonical: "https://taw10.ma",
      languages: {
        "fr-MA": "https://taw10.ma",
        "ar-MA": "https://taw10.ma",
        "en-MA": "https://taw10.ma",
        "x-default": "https://taw10.ma",
      },
    },
    openGraph: {
      title: titles[language],
      description: descriptions[language],
      url: "https://taw10.com",
      siteName: "TAW 10",
      images: [
        {
          url: "/og-image.png", // Ensure this exists
          width: 1200,
          height: 630,
          alt: "TAW 10 — Premium Business Domiciliation Morocco",
        },
      ],
      locale: language === "AR" ? "ar_MA" : language === "EN" ? "en_US" : "fr_MA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[language],
      description: descriptions[language],
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get("language")?.value?.toUpperCase() || "FR";
  const initialLanguage = ["FR", "AR", "EN"].includes(rawLang) ? rawLang : "FR";
  const direction = initialLanguage === "AR" ? "rtl" : "ltr";

  return (
    <html lang={initialLanguage.toLowerCase()} dir={direction} className="light">
      <LanguageProvider initialLanguage={initialLanguage}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap" rel="stylesheet" />
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
            rel="stylesheet"
          />
          <link 
            rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          />
          <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        </head>
        <body className={`${plusJakarta.variable} ${playfair.variable} ${montserrat.variable} bg-background text-on-background antialiased font-body theme-premium`}>
          <ConsentWrapper>
            <ErrorLogger />
            <Header />
            <main>{children}</main>
            <Footer />
            <SchemaMarkup />
            <div id="language-direction-sync" />
            <WhatsappContact />
            <CookieConsent />
          </ConsentWrapper>
        </body>
      </LanguageProvider>
    </html>
  );
}
