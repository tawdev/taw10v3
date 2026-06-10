import { headers } from "next/headers";
import { Metadata } from "next";
import { Language } from "./translations";

export async function getLocalizedMetadata(
  pageTitle?: string,
  pageDescription?: string
): Promise<Metadata> {
  const headersList = await headers();
  const rawLang = headersList.get("x-locale")?.toUpperCase() || "FR";
  const language = ["FR", "AR", "EN"].includes(rawLang) ? rawLang as Language : "FR";
  const basePathname = headersList.get("x-base-pathname") || "/";

  // Ensure leading slash and remove trailing slash if any
  let formattedPath = basePathname.startsWith("/") ? basePathname : `/${basePathname}`;
  if (formattedPath.endsWith("/") && formattedPath.length > 1) {
    formattedPath = formattedPath.slice(0, -1);
  }
  
  const host = headersList.get("host") || "taw10.ma";
  const cleanHost = host.split(":")[0];
  // Dynamic host resolution supporting both taw10.com and taw10.ma seamlessly
  const siteUrl = cleanHost.includes("localhost") || cleanHost.includes("127.0.0.1")
    ? "https://taw10.ma" 
    : `https://${cleanHost}`;
  
  // Construct localized URLs
  // For homepage (formattedPath === "/"), the localized URL is domain/locale
  // For subpages, the localized URL is domain/locale/subpage
  const getUrlForLang = (lang: string) => {
    const lowerLang = lang.toLowerCase();
    return formattedPath === "/" 
      ? `${siteUrl}/${lowerLang}`
      : `${siteUrl}/${lowerLang}${formattedPath}`;
  };

  const alternates = {
    canonical: getUrlForLang(language),
    languages: {
      "fr-MA": getUrlForLang("FR"),
      "ar-MA": getUrlForLang("AR"),
      "en-MA": getUrlForLang("EN"),
      "x-default": getUrlForLang("FR"),
    },
  };

  return {
    title: pageTitle,
    description: pageDescription,
    alternates,
  };
}
