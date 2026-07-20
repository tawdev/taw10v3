'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CONFIG } from '@/data/config';

export interface Settings {
  companyName: string;
  phoneNumber: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  logoUrl: string;
  faviconUrl: string;
  mobile: string;
  whatsapp: string;
}

const defaultSettings: Settings = {
  companyName: CONFIG.brandName,
  phoneNumber: CONFIG.contact.phone,
  email: CONFIG.contact.email,
  address: CONFIG.contact.address,
  facebook: CONFIG.socials.facebook,
  instagram: CONFIG.socials.instagram,
  linkedin: 'https://linkedin.com/company/taw10',
  logoUrl: '/logo.jpeg',
  faviconUrl: '/favicon.ico',
  mobile: CONFIG.contact.mobile,
  whatsapp: CONFIG.contact.whatsapp,
};

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
      const response = await fetch(`${apiUrl}/settings`);
      if (response.ok) {
        const data = await response.json();
        
        const resolveUrl = (url: string | null) => {
          if (!url) return '';
          if (url.startsWith('/uploads/')) {
            return `${apiUrl}${url}`;
          }
          return url;
        };

        setSettings({
          companyName: data.companyName || defaultSettings.companyName,
          phoneNumber: data.phoneNumber || defaultSettings.phoneNumber,
          email: data.email || defaultSettings.email,
          address: data.address || defaultSettings.address,
          facebook: data.facebook || defaultSettings.facebook,
          instagram: data.instagram || defaultSettings.instagram,
          linkedin: data.linkedin || defaultSettings.linkedin,
          logoUrl: resolveUrl(data.logoUrl) || defaultSettings.logoUrl,
          faviconUrl: resolveUrl(data.faviconUrl) || defaultSettings.faviconUrl,
          // Map whatsapp / mobile to match the custom formats or use default
          mobile: defaultSettings.mobile,
          whatsapp: data.phoneNumber ? data.phoneNumber.replace(/[^0-9]/g, '') : defaultSettings.whatsapp,
        });
      }
    } catch (error) {
      console.warn('Could not load settings from backend, falling back to CONFIG defaults', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
