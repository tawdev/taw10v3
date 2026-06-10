'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type RouteChromeProps = {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  schema: ReactNode;
  floating: ReactNode;
};

const adminRoutes = ['/portal-taw10-x92-admin', '/dashboard'];

export default function RouteChrome({ children, header, footer, schema, floating }: RouteChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = adminRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isAdminRoute) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      {header}
      <main id="main-content">{children}</main>
      {footer}
      {schema}
      <div id="language-direction-sync" />
      {floating}
    </>
  );
}
