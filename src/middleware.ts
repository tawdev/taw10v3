
import type { NextRequest } from 'next/server'

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
    
    // polyfill for NextResponse.next() using standard Web API
    const response = new Response(null, {
      headers: {
        'x-middleware-next': '1'
      }
    })
    response.headers.append('Set-Cookie', `language=${defaultLang}; Path=/`)
    return response
  }
  
  return new Response(null, {
    headers: {
      'x-middleware-next': '1'
    }
  })
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
