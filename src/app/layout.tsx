import type { Metadata, ResolvingMetadata } from "next";
import { cookies } from "next/headers";
import { Playfair_Display, Plus_Jakarta_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsappContact from "@/components/layout/WhatsappContact";
import CookieConsent from "@/components/layout/CookieConsent";

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
  { params }: { params: any },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get("language")?.value?.toUpperCase() || "FR";
  const language = ["FR", "AR", "EN"].includes(rawLang) ? rawLang : "FR";

  const titles: Record<string, string> = {
    FR: "TAW 10 — Domiciliation Premium à Marrakech",
    AR: "TAW 10 — توطين الشركات في مراكش",
    EN: "TAW 10 — Premium Domiciliation in Marrakech",
  };

  const descriptions: Record<string, string> = {
    FR: "L'excellence de la domiciliation, création d'entreprise et accompagnement stratégique au cœur de Marrakech.",
    AR: "التميز في التوطين، إنشاء الشركات والمواكبة الاستراتيجية في قلب مراكش.",
    EN: "Excellence in domiciliation, company formation and strategic support in the heart of Marrakech.",
  };

  return {
    metadataBase: new URL("https://taw10.com"),
    title: {
      default: titles[language] || titles.FR,
      template: `%s | TAW 10`
    },
    description: descriptions[language] || descriptions.FR,
    keywords: ["domiciliation Marrakech", "création entreprise Maroc", "secrétariat virtuel", "accompagnement juridique", "TAW 10"],
    openGraph: {
      title: titles[language],
      description: descriptions[language],
      locale: language === "AR" ? "ar_MA" : language === "EN" ? "en_US" : "fr_MA",
    }
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
          <Header />
          <main>{children}</main>
          <Footer />
          <div id="language-direction-sync" />
          <WhatsappContact />
          <CookieConsent />
        </body>
      </LanguageProvider>
    </html>
  );
}
