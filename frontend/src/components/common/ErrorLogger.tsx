"use client";

import { useEffect } from 'react';

export default function ErrorLogger() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Captured Global Error:', event.error);
      // Here you would typically send this to Sentry or a custom endpoint
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Captured Unhandled Rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
