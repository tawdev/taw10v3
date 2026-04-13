"use client";

import React, { useState, useEffect } from 'react';
import { GTMHead, GTMBody } from './GoogleTagManager';
import { CONFIG } from '@/data/config';

export default function ConsentWrapper({ children }: { children: React.ReactNode }) {
  const [hasConsent, setHasConsent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkConsent = () => {
      const raw = localStorage.getItem("cookie_consent_v1");
      if (raw) {
        const prefs = JSON.parse(raw);
        // Only load analytics if statistics preference is true
        setHasConsent(prefs.statistics === true);
      }
    };

    checkConsent();
    
    // Watch for changes (Custom Event or simple interval for robustness)
    const interval = setInterval(checkConsent, 2000);
    return () => clearInterval(interval);
  }, []);

  const gtmId = CONFIG.analytics.gtm;

  return (
    <>
      {mounted && hasConsent && <GTMHead gtmId={gtmId} />}
      {children}
      {mounted && hasConsent && <GTMBody gtmId={gtmId} />}
    </>
  );
}
