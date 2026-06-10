'use client';

import { create } from 'zustand';
import {
  administrators as initialAdmins,
  blogArticles as initialBlog,
  contacts as initialContacts,
  customers as initialCustomers,
  documents as initialDocuments,
  faqs as initialFaqs,
  orders as initialOrders,
  pricingPlans as initialPricing,
  settings as initialSettings,
} from './admin-data';
import {
  AdminDocument,
  AdminUser,
  BlogArticle,
  ContactRequest,
  Customer,
  DocumentType,
  FaqItem,
  Order,
  OrderStatus,
  PlatformSettings,
  PricingPlan,
} from '@/types/admin';

type AdminState = {
  pricing: PricingPlan[];
  orders: Order[];
  customers: Customer[];
  documents: AdminDocument[];
  contacts: ContactRequest[];
  blog: BlogArticle[];
  faq: FaqItem[];
  administrators: AdminUser[];
  settings: PlatformSettings;
  setPricing: (plans: PricingPlan[]) => void;
  setOrders: (orders: Order[]) => void;
  setCustomers: (customers: Customer[]) => void;
  setDocuments: (documents: AdminDocument[]) => void;
  setContacts: (contacts: ContactRequest[]) => void;
  setFaq: (faq: FaqItem[]) => void;
  upsertPlan: (plan: PricingPlan) => void;
  removePlan: (id: string) => void;
  togglePlan: (id: string) => void;
  movePlan: (id: string, direction: 'up' | 'down') => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  removeOrder: (id: string) => void;
  upsertCustomer: (customer: Customer) => void;
  removeCustomer: (id: string) => void;
  removeDocument: (id: string) => void;
  filterDocuments: (type: DocumentType | 'ALL') => AdminDocument[];
  markContactRead: (id: string) => void;
  removeContact: (id: string) => void;
  upsertArticle: (article: BlogArticle) => void;
  removeArticle: (id: string) => void;
  toggleArticleStatus: (id: string) => void;
  upsertFaq: (faq: FaqItem) => void;
  removeFaq: (id: string) => void;
  toggleFaq: (id: string) => void;
  upsertAdmin: (admin: AdminUser) => void;
  toggleAdmin: (id: string) => void;
  updateSettings: (settings: PlatformSettings) => void;
};

const sortPricing = (plans: PricingPlan[]) => [...plans].sort((a, b) => a.sortOrder - b.sortOrder);

export const useAdminStore = create<AdminState>((set, get) => ({
  pricing: initialPricing,
  orders: initialOrders,
  customers: initialCustomers,
  documents: initialDocuments,
  contacts: initialContacts,
  blog: initialBlog,
  faq: initialFaqs,
  administrators: initialAdmins,
  settings: initialSettings,
  setPricing: (plans) => set({ pricing: sortPricing(plans) }),
  setOrders: (orders) => set({ orders }),
  setCustomers: (customers) => set({ customers }),
  setDocuments: (documents) => set({ documents }),
  setContacts: (contacts) => set({ contacts }),
  setFaq: (faq) => set({ faq: [...faq].sort((a, b) => a.sortOrder - b.sortOrder) }),
  upsertPlan: (plan) => set((state) => ({ pricing: sortPricing([...state.pricing.filter((item) => item.id !== plan.id), plan]) })),
  removePlan: (id) => set((state) => ({ pricing: state.pricing.filter((plan) => plan.id !== id) })),
  togglePlan: (id) => set((state) => ({ pricing: state.pricing.map((plan) => plan.id === id ? { ...plan, isActive: !plan.isActive } : plan) })),
  movePlan: (id, direction) => set((state) => {
    const plans = sortPricing(state.pricing);
    const index = plans.findIndex((plan) => plan.id === id);
    const target = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= plans.length) return state;
    [plans[index].sortOrder, plans[target].sortOrder] = [plans[target].sortOrder, plans[index].sortOrder];
    return { pricing: sortPricing(plans) };
  }),
  updateOrderStatus: (id, status) => set((state) => ({ orders: state.orders.map((order) => order.id === id ? { ...order, status } : order) })),
  removeOrder: (id) => set((state) => ({ orders: state.orders.filter((order) => order.id !== id) })),
  upsertCustomer: (customer) => set((state) => ({ customers: [customer, ...state.customers.filter((item) => item.id !== customer.id)] })),
  removeCustomer: (id) => set((state) => ({ customers: state.customers.filter((customer) => customer.id !== id) })),
  removeDocument: (id) => set((state) => ({ documents: state.documents.filter((document) => document.id !== id) })),
  filterDocuments: (type) => type === 'ALL' ? get().documents : get().documents.filter((document) => document.type === type),
  markContactRead: (id) => set((state) => ({ contacts: state.contacts.map((contact) => contact.id === id ? { ...contact, isRead: true } : contact) })),
  removeContact: (id) => set((state) => ({ contacts: state.contacts.filter((contact) => contact.id !== id) })),
  upsertArticle: (article) => set((state) => ({ blog: [article, ...state.blog.filter((item) => item.id !== article.id)] })),
  removeArticle: (id) => set((state) => ({ blog: state.blog.filter((article) => article.id !== id) })),
  toggleArticleStatus: (id) => set((state) => ({ blog: state.blog.map((article) => article.id === id ? { ...article, status: article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' } : article) })),
  upsertFaq: (faq) => set((state) => ({ faq: [...state.faq.filter((item) => item.id !== faq.id), faq].sort((a, b) => a.sortOrder - b.sortOrder) })),
  removeFaq: (id) => set((state) => ({ faq: state.faq.filter((item) => item.id !== id) })),
  toggleFaq: (id) => set((state) => ({ faq: state.faq.map((item) => item.id === id ? { ...item, isActive: !item.isActive } : item) })),
  upsertAdmin: (admin) => set((state) => ({ administrators: [admin, ...state.administrators.filter((item) => item.id !== admin.id)] })),
  toggleAdmin: (id) => set((state) => ({ administrators: state.administrators.map((admin) => admin.id === id ? { ...admin, isActive: !admin.isActive } : admin) })),
  updateSettings: (settings) => set({ settings }),
}));
