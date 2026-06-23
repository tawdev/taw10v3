import type { Metadata, ResolvingMetadata } from "next";
import { cookies, headers } from "next/headers";
import { Playfair_Display, Plus_Jakarta_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { getLocalizedMetadata } from "@/lib/metadata";
import { LanguageProvider } from "@/context/LanguageContext";
import { SettingsProvider } from "@/context/SettingsContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsappContact from "@/components/layout/WhatsappContact";
import CookieConsent from "@/components/layout/CookieConsent";
import RouteChrome from "@/components/layout/RouteChrome";
import SchemaMarkup from "@/components/common/SchemaMarkup";
import { CONFIG } from "@/data/config";
import ConsentWrapper from "@/components/common/ConsentWrapper";
import ErrorLogger from "@/components/common/ErrorLogger";

import CustomCursor from "@/components/common/CustomCursor";

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

export const viewport = {
  themeColor: "#dab055",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export async function generateMetadata(
  { params }: { params: { lang?: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const headersList = await headers();
  const rawLang = headersList.get("x-locale")?.toUpperCase() || "FR";
  const language = ["FR", "AR", "EN"].includes(rawLang) ? rawLang : "FR";

  const titles: Record<string, string> = {
    FR: "TAW 10 | Domiciliation & Création d'Entreprise à Marrakech",
    AR: "TAW 10 | توطين وإنشاء الشركات في مراكش",
    EN: "TAW 10 | Domiciliation & Company Creation in Marrakech",
  };

  const descriptions: Record<string, string> = {
    FR: "TAW 10 vous accompagne dans la domiciliation et la création de votre entreprise à Marrakech. Profitez d'une adresse prestigieuse et d'un secrétariat virtuel.",
    AR: "ترافقكم TAW 10 في توطين وإنشاء شركتكم في مراكش. استفد من عنوان مرموق وسكرتارية افتراضية.",
    EN: "TAW 10 supports you in the domiciliation and creation of your company in Marrakech. Benefit from a prestigious address and a virtual secretariat.",
  };

  const localizedMeta = await getLocalizedMetadata(titles[language], descriptions[language]);

  return {
    metadataBase: new URL("https://taw10.ma"),
    title: {
      default: titles[language],
      template: `%s | ${titles[language]}`,
    },
    description: descriptions[language],
    keywords: ["domiciliation marrakech", "creation entreprise maroc", "domiciliation maroc", "secretariat virtuel marrakech", "business center marrakech", "creation societe marrakech"],
    authors: [{ name: "TAW 10 Consulting" }],
    creator: "TAW 10 Consulting",
    publisher: "TAW 10 Consulting",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: titles[language],
      description: descriptions[language],
      url: (localizedMeta.alternates?.canonical as string) || "https://taw10.ma",
      siteName: "TAW 10 Consulting",
      images: [
        {
          url: "/icon-512.png",
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
      images: ["/icon-512.png"],
    },
    icons: {
      icon: "/logoo.png",
      shortcut: "/logoo.png",
      apple: "/logoo.png",
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
    ...localizedMeta,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const rawLang = headersList.get("x-locale")?.toUpperCase() || "FR";
  const initialLanguage = ["FR", "AR", "EN"].includes(rawLang) ? rawLang : "FR";
  const direction = initialLanguage === "AR" ? "rtl" : "ltr";

  return (
    <html lang={initialLanguage.toLowerCase()} dir={direction} className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        />
        <link rel="icon" href="/logoo.png" type="image/png" />
        <link rel="shortcut icon" href="/logoo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logoo.png" />
      </head>
      <body className={`${plusJakarta.variable} ${playfair.variable} ${montserrat.variable} bg-background text-on-background antialiased font-body theme-premium`}>
        <LanguageProvider initialLanguage={initialLanguage}>
          <SettingsProvider>
            <ConsentWrapper>
              <CustomCursor />
              <ErrorLogger />
              <RouteChrome
                header={<Header />}
                footer={<Footer />}
                schema={<SchemaMarkup language={initialLanguage as "FR" | "AR" | "EN"} />}
                floating={
                  <>
                    <WhatsappContact />
                    <CookieConsent />
                  </>
                }
              >
                {children}
              </RouteChrome>
            </ConsentWrapper>
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
