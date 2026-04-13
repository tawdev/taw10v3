export const CONFIG = {
  brandName: "TAW 10",
  contact: {
    email: "Contact@taw10.com",
    phone: "+212 52430-8038", // Business Phone
    whatsapp: "+212607790956", // Direct WhatsApp
    address: "Marrakech, Maroc", // Placeholder if needed
  },
  socials: {
    facebook: "https://www.facebook.com/taw10.ma/",
    instagram: "https://www.instagram.com/tawteen_10/",
  },
  analytics: {
    gtm: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-PTB5JFRG',
    ga: process.env.NEXT_PUBLIC_GA_ID || '', // Fallback or empty
  },
};
