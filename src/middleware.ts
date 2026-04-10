import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const cookieLang = request.cookies.get('language')?.value
  
  if (!cookieLang) {
    // Detect from header
    const acceptLanguage = request.headers.get('accept-language')
    let defaultLang = 'FR'
    
    if (acceptLanguage?.includes('ar')) {
      defaultLang = 'AR'
    } else if (acceptLanguage?.includes('en')) {
      defaultLang = 'EN'
    }
    
    const response = NextResponse.next()
    response.cookies.set('language', defaultLang, { path: '/' })
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - JS, CSS, fonts, and images at the root
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:js|css|woff|woff2|jpg|jpeg|png|webp|avif|svg|ico)$).*)',
  ],
}
