import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split('/')[1]?.toLowerCase();
  const locales = ['fr', 'ar', 'en'];

  if (locales.includes(locale)) {
    const response = NextResponse.rewrite(new URL('/', request.url));
    response.cookies.set('language', locale.toUpperCase(), { path: '/' });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/fr', '/ar', '/en', '/fr/:path*', '/ar/:path*', '/en/:path*'],
};
