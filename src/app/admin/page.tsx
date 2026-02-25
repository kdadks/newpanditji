/**
 * /admin — protected Server Component.
 *
 * Defense-in-depth: the Next.js middleware already redirected unauthenticated
 * requests to /admin/login before this code runs. This server-side check is
 * an additional layer — it re-validates the Supabase session from the HTTP
 * cookie so that even if the middleware were somehow bypassed, no admin UI
 * is served to an unauthenticated caller.
 *
 * CWE-602 fix: authentication is no longer enforced only on the client.
 */
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../lib/supabase-server'
import AdminPage from '../../components/pages/AdminPage'

export default async function Admin() {
  const supabase = await createServerSupabaseClient()

  // getUser() validates the token with Supabase's servers — more authoritative
  // than getSession() which trusts the cookie value without re-checking.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return <AdminPage />
}
