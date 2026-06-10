export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';
export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'WAITING_DOCUMENTS' | 'COMPLETED' | 'CANCELLED';
export type DocumentType = 'CIN' | 'PASSPORT' | 'COMPANY_DOCUMENTS' | 'CONTRACTS';
export type PublishStatus = 'DRAFT' | 'PUBLISHED';
export type PricingTheme = 'DEFAULT' | 'FEATURED' | 'PREMIUM';

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  description: string;
  theme: PricingTheme;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  features: PricingFeature[];
};

export type PricingFeature = {
  id: string;
  planId?: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  isIncluded: boolean;
  sortOrder: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  selectedPlan: string;
  status: OrderStatus;
  createdAt: string;
  revenue: number;
};

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  createdAt: string;
};

export type AdminDocument = {
  id: string;
  name: string;
  customerName: string;
  type: DocumentType;
  size: string;
  uploadedAt: string;
};

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type BlogArticle = {
  id: string;
  title: string;
  title_fr?: string | null;
  title_en?: string | null;
  title_ar?: string | null;
  slug: string;
  featuredImage: string;
  excerpt: string;
  excerpt_fr?: string | null;
  excerpt_en?: string | null;
  excerpt_ar?: string | null;
  content: string;
  content_fr?: string | null;
  content_en?: string | null;
  content_ar?: string | null;
  metaTitle: string;
  metaTitle_fr?: string | null;
  metaTitle_en?: string | null;
  metaTitle_ar?: string | null;
  metaDescription: string;
  metaDescription_fr?: string | null;
  metaDescription_en?: string | null;
  metaDescription_ar?: string | null;
  status: PublishStatus;
  publishedAt?: string | null;
  createdAt: string;
};

export type TeamMember = {
  id: string;
  name_fr: string;
  name_en: string;
  name_ar: string;
  role_fr: string;
  role_en: string;
  role_ar: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
};

export type ServiceOffering = {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  icon: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  likeCount?: number;
  dislikeCount?: number;
};

export type PlatformSettings = {
  companyName: string;
  phoneNumber: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  logoUrl: string;
  faviconUrl: string;
};
