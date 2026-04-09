import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://taw10.com"),
  title: {
    default: "TAW 10 — Domiciliation Premium à Marrakech",
    template: "%s | TAW 10"
  },
  description: "L'excellence de la domiciliation, création d'entreprise et accompagnement stratégique au cœur de Marrakech. Plus de 500 entrepreneurs nous font confiance.",
  keywords: ["domiciliation Marrakech", "création entreprise Maroc", "secrétariat virtuel", "accompagnement juridique", "TAW 10"],
  authors: [{ name: "TAW 10" }],
  creator: "TAW 10",
  openGraph: {
    type: "website",
    locale: "fr_MA",
    alternateLocale: ["ar_MA", "en_US"],
    url: "https://taw10.com",
    siteName: "TAW 10",
    title: "TAW 10 — Domiciliation Premium à Marrakech",
    description: "L'excellence de la domiciliation et création d'entreprise au cœur de Marrakech.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TAW 10 - Domiciliation Premium"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TAW 10 — Domiciliation Premium à Marrakech",
    description: "L'excellence de la domiciliation et création d'entreprise au cœur de Marrakech.",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "your-google-verification-code"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="fr" className="light">
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
      </html>
    </LanguageProvider>
  );
}
