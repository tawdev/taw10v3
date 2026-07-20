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

  // Custom paths mapping for localized landing pages
  const alternatePathsMap: Record<string, Record<string, string>> = {
    "/domiciliation-entreprise-marrakech": {
      "FR": "/domiciliation-entreprise-marrakech",
      "EN": "/business-domiciliation-marrakech",
      "AR": "/توطين-الشركات-مراكش"
    },
    "/business-domiciliation-marrakech": {
      "FR": "/domiciliation-entreprise-marrakech",
      "EN": "/business-domiciliation-marrakech",
      "AR": "/توطين-الشركات-مراكش"
    },
    "/توطين-الشركات-مراكش": {
      "FR": "/domiciliation-entreprise-marrakech",
      "EN": "/business-domiciliation-marrakech",
      "AR": "/%D8%AA%D9%88%D8%B7%D9%8A%D9%86-%D8%A7%D9%84%D8%B4%D8%B1%D9%83%D8%A7%D8%AA-%D9%85%D8%B1%D8%A7%D9%83%D8%B4"
    },
    "/%D8%AA%D9%88%D8%B7%D9%8A%D9%86-%D8%A7%D9%84%D8%B4%D8%B1%D9%83%D8%A7%D8%AA-%D9%85%D8%B1%D8%A7%D9%83%D8%B4": {
      "FR": "/domiciliation-entreprise-marrakech",
      "EN": "/business-domiciliation-marrakech",
      "AR": "/%D8%AA%D9%88%D8%B7%D9%8A%D9%86-%D8%A7%D9%84%D8%B4%D8%B1%D9%83%D8%A7%D8%AA-%D9%85%D8%B1%D8%A7%D9%83%D8%B4"
    },
    "/creation-entreprise-marrakech": {
      "FR": "/creation-entreprise-marrakech",
      "EN": "/company-formation-morocco",
      "AR": "/انشاء-شركة-في-المغرب"
    },
    "/company-formation-morocco": {
      "FR": "/creation-entreprise-marrakech",
      "EN": "/company-formation-morocco",
      "AR": "/انشاء-شركة-في-المغرب"
    },
    "/انشاء-شركة-في-المغرب": {
      "FR": "/creation-entreprise-marrakech",
      "EN": "/company-formation-morocco",
      "AR": "/%D8%A7%D9%86%D8%B4%D8%A7%D8%A1-%D8%B4%D8%B1%D9%83%D8%A9-%D9%81%D9%8A-%D8%A7%D9%84%D9%85%D8%BA%D8%B1%D8%A8"
    },
    "/%D8%A7%D9%86%D8%B4%D8%A7%D8%A1-%D8%B4%D8%B1%D9%83%D8%A9-%D9%81%D9%8A-%D8%A7%D9%84%D9%85%D8%BA%D8%B1%D8%A8": {
      "FR": "/creation-entreprise-marrakech",
      "EN": "/company-formation-morocco",
      "AR": "/%D8%A7%D9%86%D8%B4%D8%A7%D8%A1-%D8%B4%D8%B1%D9%83%D8%A9-%D9%81%D9%8A-%D8%A7%D9%84%D9%85%D8%BA%D8%B1%D8%A8"
    },
    "/creation-societe-maroc": {
      "FR": "/creation-societe-maroc",
      "EN": "/company-formation-morocco",
      "AR": "/%D8%A7%D9%86%D8%B4%D8%A7%D8%A1-%D8%B4%D8%B1%D9%83%D8%A9-%D9%81%D9%8A-%D8%A7%D9%84%D9%85%D8%BA%D8%B1%D8%A8"
    }
  };
  
  // Construct localized URLs
  // For homepage (formattedPath === "/"), the localized URL is domain/locale
  // For subpages, the localized URL is domain/locale/subpage
  const getUrlForLang = (lang: string) => {
    const lowerLang = lang.toLowerCase();
    const upperLang = lang.toUpperCase();

    if (alternatePathsMap[formattedPath]) {
      const targetPath = alternatePathsMap[formattedPath][upperLang];
      return `${siteUrl}/${lowerLang}${targetPath}`;
    }

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
