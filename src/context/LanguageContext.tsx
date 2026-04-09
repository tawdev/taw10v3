"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import fr from "../translations/fr.json";
import en from "../translations/en.json";
import ar from "../translations/ar.json";

type Language = "FR" | "AR" | "EN";

const translations: Record<Language, Record<string, string>> = {
  FR: fr,
  EN: en,
  AR: ar,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("FR");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && ["FR", "AR", "EN"].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
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
    return translations[language][key] || key;
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
