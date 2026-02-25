'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, Key, Spinner } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'sonner'

/**
 * Standalone admin login form.
 * Lives at /admin/login (a public route).
 * On success, redirects to /admin (or the `redirect` search-param destination).
 */
export default function AdminLoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast.success('Welcome Rajesh Ji! 🙏', {
          description: 'You have successfully logged into the admin dashboard',
          duration: 4000,
        })
        router.push(redirectTo)
      } else {
        toast.error('Invalid credentials. Please try again.')
      }
    } catch {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md mx-4 w-full">
        <CardHeader className="text-center pb-4">
          <Shield className="mx-auto mb-4 text-primary" size={64} weight="fill" />
          <CardTitle className="font-heading font-bold text-2xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoggingIn}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoggingIn}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Spinner className="mr-2 animate-spin" size={18} />
                  Logging in...
                </>
              ) : (
                <>
                  <Key className="mr-2" size={18} />
                  Login
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground text-center">
              Admin access only. Contact the site owner for credentials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
