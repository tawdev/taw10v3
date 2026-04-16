"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import frCommon from "../translations/fr/common.json";
import frSections from "../translations/fr/sections.json";
import frServices from "../translations/fr/services.json";
import arCommon from "../translations/ar/common.json";
import arSections from "../translations/ar/sections.json";
import arServices from "../translations/ar/services.json";
import enCommon from "../translations/en/common.json";
import enSections from "../translations/en/sections.json";
import enServices from "../translations/en/services.json";

type Language = "FR" | "AR" | "EN";

const translations: Record<Language, Record<string, string>> = {
  FR: { ...frCommon, ...frSections, ...frServices },
  AR: { ...arCommon, ...arSections, ...arServices },
  EN: { ...enCommon, ...enSections, ...enServices },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode, initialLanguage?: string }> = ({ children, initialLanguage = "FR" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const normalizedInitial = (initialLanguage?.toUpperCase() || "FR") as Language;
  const validInitial = ["FR", "AR", "EN"].includes(normalizedInitial) ? normalizedInitial : "FR";
  
  const [language, setLanguageState] = useState<Language>(validInitial);

  useEffect(() => {
    // Sync with localStorage on mount if exists, otherwise use initialLanguage
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && ["FR", "AR", "EN"].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.cookie = `language=${lang}; path=/; max-age=31536000`; // Sync with cookie for SSR
    
    // Replace the locale in the current path
    const pathParts = pathname.split('/');
    const locales = ['fr', 'ar', 'en'];
    
    // Check if the first part is a locale
    if (pathParts[1] && locales.includes(pathParts[1].toLowerCase())) {
      pathParts[1] = lang.toLowerCase();
    } else {
      // If no locale prefix, prepend it (though middleware should handle this)
      pathParts.splice(1, 0, lang.toLowerCase());
    }
    
    const newPath = pathParts.join('/') || '/';
    router.push(newPath);
  };

  useEffect(() => {
    if (language === "AR") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = language.toLowerCase();
    }
  }, [language]);

  const t = (key: string) => {
    const langKey = (language || "FR") as Language;
    const langDict = translations[langKey] || translations["FR"];
    return langDict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
