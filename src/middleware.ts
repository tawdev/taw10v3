import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static assets, manifest, api, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json'
  ) {
    return NextResponse.next();
  }

  const locale = pathname.split('/')[1]?.toLowerCase();
  const locales = ['fr', 'ar', 'en'];

  const requestHeaders = new Headers(request.headers);

  if (locales.includes(locale)) {
    // Strip the locale prefix (e.g., "/fr/blog" -> "/blog", "/fr" -> "/")
    const newPath = pathname.substring(3) || '/';
    
    // Inject the x-locale header into request headers for Server Components
    requestHeaders.set('x-locale', locale.toUpperCase());
    requestHeaders.set('x-base-pathname', newPath);
    
    const response = NextResponse.rewrite(new URL(newPath, request.url), {
      request: {
        headers: requestHeaders,
      },
    });
    
    // Sync the cookie for backwards compatibility
    response.cookies.set('language', locale.toUpperCase(), { path: '/' });
    return response;
  }

  // If no locale prefix, read the cookie or default to FR
  const cookieLang = request.cookies.get('language')?.value?.toUpperCase();
  const finalLang = (cookieLang && ['FR', 'AR', 'EN'].includes(cookieLang)) ? cookieLang : 'FR';
  
  requestHeaders.set('x-locale', finalLang);
  requestHeaders.set('x-base-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)'],
};
