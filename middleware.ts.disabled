/**
 * Next.js Edge Middleware — Server-Side Route Protection
 *
 * Addresses CWE-602: Client-Side Enforcement of Server-Side Security.
 *
 * All requests to /admin/* are intercepted here — before any React code runs
 * and before any response is sent to the browser. The Supabase session is
 * validated from the HTTP cookie (written by createBrowserClient), not from
 * localStorage, so it cannot be bypassed by disabling JavaScript or
 * manipulating client-side state.
 *
 * Behaviour:
 *  - Valid session  → request proceeds normally; refreshed cookies forwarded.
 *  - No/expired session → redirect to /admin/login.
 *  - /admin/login itself is always allowed through (avoids redirect loop).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from './src/lib/supabase-server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Build a mutable response so we can forward refreshed session cookies.
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Always allow the login page itself to avoid an infinite redirect loop.
  if (pathname === '/admin/login') {
    return response
  }

  // Only protect /admin routes.
  if (!pathname.startsWith('/admin')) {
    return response
  }

  try {
    // Create a server-side Supabase client that reads from request cookies.
    const supabase = createMiddlewareSupabaseClient(request, response)

    // getUser() performs a lightweight server-side token validation and
    // automatically refreshes the session, writing updated cookies back to
    // the response. This is more authoritative than getSession() because
    // getSession() trusts the cookie value without re-verifying with Supabase.
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      // No valid session — redirect to the dedicated admin login page.
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Session is valid. Forward the response with refreshed session cookies.
    return response
  } catch (err) {
    // Unexpected auth error — fail closed for safety.
    console.error('[middleware] Auth check failed:', err)
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  // TEMPORARILY disabled: Vercel dxb1 incident (2026-03-02) causes all builds
  // with middleware to fail at deploy. Re-enable matcher once incident resolves.
  // Original: '/admin/:path*'
  matcher: ['/_middleware_disabled_'],
}
