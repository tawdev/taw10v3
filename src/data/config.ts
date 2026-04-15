export const CONFIG = {
  brandName: "TAW 10",
  contact: {
    email: "Contact@taw10.com",
    phone: "+212 5 24 30 80 38", // Fixer business phone
    mobile: "+212 6 07 79 09 56", // Fixer mobile
    whatsapp: "+212607790956", 
    address: "48 Lot IGUIDER, Allal El Fassi, Marrakech",
    mapLink: "https://www.google.com/maps/search/?api=1&query=48+Lot+IGUIDER+Allal+El+Fassi+Marrakech",
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
