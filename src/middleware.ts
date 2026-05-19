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

  const locales = ['fr', 'ar', 'en'];
  const homepageSections = ['/how-it-works', '/expertise', '/pricing', '/lineup', '/contact', '/hero'];

  const parts = pathname.split('/');
  const firstSegment = parts[1]?.toLowerCase();

  const requestHeaders = new Headers(request.headers);

  if (locales.includes(firstSegment)) {
    const newPath = '/' + parts.slice(2).join('/');
    
    // Inject the x-locale header into request headers for Server Components
    requestHeaders.set('x-locale', firstSegment.toUpperCase());
    requestHeaders.set('x-base-pathname', newPath);
    
    // Check if it's a homepage section
    const targetPath = homepageSections.includes(newPath) ? '/' : newPath;
    
    const response = NextResponse.rewrite(new URL(targetPath, request.url), {
      request: {
        headers: requestHeaders,
      },
    });
    
    // Sync the cookie for backwards compatibility
    response.cookies.set('language', firstSegment.toUpperCase(), { path: '/' });
    return response;
  }

  // If no locale prefix, read the cookie or default to FR
  const cookieLang = request.cookies.get('language')?.value?.toUpperCase();
  const finalLang = (cookieLang && ['FR', 'AR', 'EN'].includes(cookieLang)) ? cookieLang : 'FR';
  
  requestHeaders.set('x-locale', finalLang);
  requestHeaders.set('x-base-pathname', pathname);

  // If the path is a homepage section, rewrite to / and inject headers
  if (homepageSections.includes(pathname)) {
    const response = NextResponse.rewrite(new URL('/', request.url), {
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.set('language', finalLang, { path: '/' });
    return response;
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)'],
};
