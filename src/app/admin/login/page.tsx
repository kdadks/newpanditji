import { Suspense } from 'react'
import AdminLoginForm from '../../../components/admin/AdminLoginForm'

/**
 * /admin/login — public route, excluded from admin middleware protection.
 * Serves the login form; on success redirects to /admin (or `?redirect=…`).
 */
export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  )
}
