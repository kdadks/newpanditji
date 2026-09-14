/**
 * Server-side Supabase client factory
 * Used in: Server Components, API route handlers, and Next.js middleware
 * Reads session from cookies — never from localStorage
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rhwzwjaqbobmrxmrebht.supabase.co'
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'dummy_key_for_build'

/**
 * Creates a Supabase client for Server Components and API routes.
 * Reads and writes session cookies via next/headers.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // In Server Components cookies are read-only; the middleware
          // handles refreshing, so this is safe to ignore here.
        }
      },
    },
  })
}

/**
 * Creates a lightweight Supabase client for use inside Next.js middleware.
 * Operates directly on the request/response objects — no next/headers.
 */
export function createMiddlewareSupabaseClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })
}
