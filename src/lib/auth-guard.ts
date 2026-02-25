/**
 * Server-side authentication guard for Next.js API route handlers.
 *
 * Usage in any Route Handler (app/api/[route]/route.ts):
 *
 *   import { requireAuth } from "@/lib/auth-guard"
 *
 *   export async function GET(request: NextRequest) {
 *     const authResult = await requireAuth(request)
 *     if (authResult instanceof NextResponse) return authResult  // 401 early exit
 *     const { user } = authResult
 *     // ... your protected logic
 *   }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from './supabase-server'
import type { User } from '@supabase/supabase-js'

interface AuthSuccess {
  user: User
}

/**
 * Validates the caller's Supabase session from cookies.
 * Returns the authenticated User on success, or a 401 NextResponse on failure.
 * The caller MUST return the NextResponse immediately when it is returned.
 */
export async function requireAuth(
  _request: NextRequest
): Promise<AuthSuccess | NextResponse> {
  try {
    const supabase = await createServerSupabaseClient()

    // getUser() re-validates the session token with Supabase — it is more
    // authoritative than getSession() which only reads the cookie value.
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. A valid session is required.' },
        { status: 401 }
      )
    }

    return { user }
  } catch (err) {
    console.error('[requireAuth] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error during authentication.' },
      { status: 500 }
    )
  }
}
