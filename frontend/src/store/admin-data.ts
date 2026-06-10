import {
  AdminDocument,
  AdminUser,
  BlogArticle,
  ContactRequest,
  Customer,
  FaqItem,
  Order,
  PlatformSettings,
  PricingPlan,
} from '@/types/admin';

const fallbackFeatures = [
  { name_fr: 'Certificat Négatif', name_ar: 'الشهادة السلبية', name_en: 'Negative Certificate' },
  { name_fr: 'Rédaction des Statuts', name_ar: 'القانون الأساسي', name_en: 'Registration of Statutes' },
  { name_fr: 'Inscription Taxe Professionnelle', name_ar: 'التعريف الضريبي', name_en: 'Professional Tax Registration' },
  { name_fr: 'Registre de Commerce', name_ar: 'السجل التجاري', name_en: 'Commercial Register' },
  { name_fr: "Demande d'identification fiscale", name_ar: 'طلب شهادة التعريف الجبائي', name_en: 'Tax Identification Request' },
  { name_fr: 'Affiliation CNSS', name_ar: 'الانخراط في CNSS', name_en: 'CNSS Affiliation' },
  { name_fr: 'Annonce Légale', name_ar: 'الإعلان القانوني', name_en: 'Legal Announcement' },
  { name_fr: 'Domiciliation adresse prestigieuse (12 mois)', name_ar: 'التوطين في عنوان مرموق (12 شهر)', name_en: 'Domiciliation in prestigious address (12 months)' },
  { name_fr: 'Modèle J', name_ar: 'النموذج J', name_en: 'Model J' },
  { name_fr: 'Accès Service E-déclaration DGI', name_ar: 'الوصول لخدمة DGI الإلكترونية', name_en: 'DGI E-filing Service Access' },
  { name_fr: 'Accès Service DAMANCOM', name_ar: 'الوصول لخدمة DAMANCOM', name_en: 'DAMANCOM Service Access' },
  { name_fr: 'Timbre', name_ar: 'الطابع', name_en: 'Stamp' },
  { name_fr: 'Accompagnement Ouverture Compte', name_ar: 'الدعم في فتح حساب بنكي', name_en: 'Bank Account Opening Support' },
  { name_fr: 'Site Web', name_ar: 'الموقع الإلكتروني', name_en: 'Website' },
];

const getFeaturesForPlan = (planName: string, includedUntil: number) => {
  return fallbackFeatures.map((item, index) => {
    let name_fr = item.name_fr;
    let name_ar = item.name_ar;
    let name_en = item.name_en;
    if (planName.includes('PLUS') || planName.includes('PREMIUM')) {
      name_fr = name_fr.replace('(12 mois)', '(24 mois)');
      name_ar = name_ar.replace('(12 شهر)', '(24 شهر)');
      name_en = name_en.replace('(12 months)', '(24 months)');
    }
    return {
      id: `${planName.toLowerCase().replace(/\s+/g, '-')}-feature-${index + 1}`,
      name_fr,
      name_ar,
      name_en,
      isIncluded: index < includedUntil,
      sortOrder: index + 1,
    };
  });
};

export const pricingPlans: PricingPlan[] = [
  {
    id: 'plan-1',
    name: 'INTILAQA',
    price: 2499,
    description: 'Transparence et simplicite pour demarrer.',
    theme: 'DEFAULT',
    isPopular: false,
    isActive: true,
    sortOrder: 1,
    features: getFeaturesForPlan('INTILAQA', 7),
  },
  {
    id: 'plan-2',
    name: 'INTILAQA PRO',
    price: 4699,
    description: 'La formule recommandee pour creer votre societe.',
    theme: 'FEATURED',
    isPopular: true,
    isActive: true,
    sortOrder: 2,
    features: getFeaturesForPlan('INTILAQA PRO', 13),
  },
  {
    id: 'plan-3',
    name: 'INTILAQA PLUS',
    price: 5999,
    description: 'Pack avance avec domiciliation 24 mois.',
    theme: 'DEFAULT',
    isPopular: false,
    isActive: true,
    sortOrder: 3,
    features: getFeaturesForPlan('INTILAQA PLUS', 13),
  },
  {
    id: 'plan-4',
    name: 'INTILAQA PREMIUM',
    price: 8999,
    description: 'L’offre complete incluant le site web.',
    theme: 'PREMIUM',
    isPopular: false,
    isActive: true,
    sortOrder: 4,
    features: getFeaturesForPlan('INTILAQA PREMIUM', 14),
  },
];

export const orders: Order[] = [
  { id: 'ord-1', orderNumber: 'TAW-2026-001', customerName: 'Sara El Amrani', email: 'sara@example.com', phone: '+212 600 111 222', selectedPlan: 'INTILAQA PRO', status: 'PENDING', createdAt: '2026-06-01', revenue: 349 },
  { id: 'ord-2', orderNumber: 'TAW-2026-002', customerName: 'Youssef Ait Ali', email: 'youssef@example.com', phone: '+212 600 222 333', selectedPlan: 'INTILAQA PLUS', status: 'IN_PROGRESS', createdAt: '2026-06-02', revenue: 499 },
  { id: 'ord-3', orderNumber: 'TAW-2026-003', customerName: 'Nora Bennis', email: 'nora@example.com', phone: '+212 600 333 444', selectedPlan: 'INTILAQA', status: 'WAITING_DOCUMENTS', createdAt: '2026-06-02', revenue: 199 },
  { id: 'ord-4', orderNumber: 'TAW-2026-004', customerName: 'Mehdi Idrissi', email: 'mehdi@example.com', phone: '+212 600 444 555', selectedPlan: 'INTILAQA PREMIUM', status: 'COMPLETED', createdAt: '2026-06-03', revenue: 799 },
];

export const customers: Customer[] = [
  { id: 'cus-1', fullName: 'Sara El Amrani', email: 'sara@example.com', phone: '+212 600 111 222', companyName: 'Atlas Digital', createdAt: '2026-05-28' },
  { id: 'cus-2', fullName: 'Youssef Ait Ali', email: 'youssef@example.com', phone: '+212 600 222 333', companyName: 'Marrakech Supply', createdAt: '2026-05-29' },
  { id: 'cus-3', fullName: 'Nora Bennis', email: 'nora@example.com', phone: '+212 600 333 444', companyName: 'Nora Consulting', createdAt: '2026-06-01' },
];

export const documents: AdminDocument[] = [
  { id: 'doc-1', name: 'cin-sara.pdf', customerName: 'Sara El Amrani', type: 'CIN', size: '1.4 MB', uploadedAt: '2026-06-01' },
  { id: 'doc-2', name: 'passport-youssef.pdf', customerName: 'Youssef Ait Ali', type: 'PASSPORT', size: '2.1 MB', uploadedAt: '2026-06-02' },
  { id: 'doc-3', name: 'statuts-atlas.pdf', customerName: 'Sara El Amrani', type: 'COMPANY_DOCUMENTS', size: '3.8 MB', uploadedAt: '2026-06-02' },
  { id: 'doc-4', name: 'contrat-domiciliation.pdf', customerName: 'Mehdi Idrissi', type: 'CONTRACTS', size: '860 KB', uploadedAt: '2026-06-03' },
];

export const contacts: ContactRequest[] = [
  { id: 'msg-1', name: 'Imane Farah', email: 'imane@example.com', phone: '+212 600 555 666', subject: 'Creation SARL', message: 'Je souhaite connaitre les delais de creation.', isRead: false, createdAt: '2026-06-03' },
  { id: 'msg-2', name: 'Omar Saidi', email: 'omar@example.com', phone: '+212 600 777 888', subject: 'Domiciliation', message: 'Avez-vous une offre annuelle ?', isRead: true, createdAt: '2026-06-02' },
];

export const blogArticles: BlogArticle[] = [
  { id: 'post-1', title: 'Creer son entreprise au Maroc', slug: 'creer-entreprise-maroc', featuredImage: '/blog-avantage.jpg', excerpt: 'Les etapes cles pour creer une entreprise.', content: 'Guide pratique pour demarrer.', metaTitle: 'Creation entreprise Maroc', metaDescription: 'Les etapes cles pour creer une entreprise.', status: 'PUBLISHED', publishedAt: '2026-05-20', createdAt: '2026-05-20' },
  { id: 'post-2', title: 'Pourquoi choisir la domiciliation', slug: 'choisir-domiciliation', featuredImage: '/blog-avantage.jpg', excerpt: 'Comprendre les benefices de la domiciliation.', content: 'Les avantages de la domiciliation.', metaTitle: 'Domiciliation entreprise', metaDescription: 'Comprendre les benefices de la domiciliation.', status: 'DRAFT', publishedAt: null, createdAt: '2026-05-30' },
];

export const faqs: FaqItem[] = [
  { id: 'faq-1', question: 'Quels documents sont necessaires ?', answer: 'Une CIN ou passeport, justificatifs et informations de la societe.', sortOrder: 1, isActive: true },
  { id: 'faq-2', question: 'Combien de temps prend la creation ?', answer: 'Le delai depend du dossier, generalement quelques jours ouvrables.', sortOrder: 2, isActive: true },
];

export const administrators: AdminUser[] = [
  { id: 'adm-1', fullName: 'TAW10 Super Admin', email: 'admin@taw10.com', role: 'SUPER_ADMIN', isActive: true, createdAt: '2026-06-03' },
  { id: 'adm-2', fullName: 'Operations Admin', email: 'ops@taw10.com', role: 'ADMIN', isActive: true, createdAt: '2026-06-03' },
];

export const settings: PlatformSettings = {
  companyName: 'TAW10',
  phoneNumber: '+212 600 000 000',
  email: 'contact@taw10.com',
  address: 'Marrakech, Maroc',
  facebook: 'https://facebook.com/taw10',
  instagram: 'https://instagram.com/taw10',
  linkedin: 'https://linkedin.com/company/taw10',
  logoUrl: '/logo.jpeg',
  faviconUrl: '/favicon.ico',
};
