import frCommon from "../translations/fr/common.json";
import frSections from "../translations/fr/sections.json";
import frServices from "../translations/fr/services.json";
import arCommon from "../translations/ar/common.json";
import arSections from "../translations/ar/sections.json";
import arServices from "../translations/ar/services.json";
import enCommon from "../translations/en/common.json";
import enSections from "../translations/en/sections.json";
import enServices from "../translations/en/services.json";

export type Language = "FR" | "AR" | "EN";

const translations: Record<Language, Record<string, string>> = {
  FR: { ...frCommon, ...frSections, ...frServices },
  AR: { ...arCommon, ...arSections, ...arServices },
  EN: { ...enCommon, ...enSections, ...enServices },
};

export function getTranslations(lang: Language) {
  const dictionary = translations[lang] || translations.FR;
  return (key: string) => dictionary[key] || key;
}
