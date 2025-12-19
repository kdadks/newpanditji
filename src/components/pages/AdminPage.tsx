'use client'

import { useState } from 'react'
import { Shield, Key, Spinner } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import AdminLayout from '../admin/AdminLayout'
import AdminAnalytics from '../admin/AdminAnalytics'
import AdminServices from '../admin/AdminServices'
import AdminMedia from '../admin/AdminMedia'
import AdminBooks from '../admin/AdminBooks'
import AdminBlogs from '../admin/AdminBlogs'
import AdminTestimonials from '../admin/AdminTestimonials'
import AdminCharity from '../admin/AdminCharity'
import AdminProfile from '../admin/AdminProfile'
import AdminContent from '../admin/AdminContent'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'sonner'

export default function AdminPage() {
  const { user, loading, isAuthenticated, login, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [currentSection, setCurrentSection] = useState('analytics')

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
      } else {
        toast.error('Invalid credentials. Please try again.')
      }
    } catch {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    setEmail('')
    setPassword('')
    setCurrentSection('analytics')
    toast.success('Logged out successfully')
  }

  const renderContent = () => {
    switch (currentSection) {
      case 'analytics':
        return <AdminAnalytics />
      case 'services':
        return <AdminServices />
      case 'media':
        return <AdminMedia />
      case 'books':
        return <AdminBooks />
      case 'blogs':
        return <AdminBlogs />
      case 'testimonials':
        return <AdminTestimonials />
      case 'charity':
        return <AdminCharity />
      case 'profile':
        return <AdminProfile />
      case 'content':
        return <AdminContent />
      default:
        return <AdminAnalytics />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-muted-foreground animate-pulse" size={64} />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
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

  return (
    <AdminLayout
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      onLogout={handleLogout}
      userEmail={user?.email}
    >
      {renderContent()}
    </AdminLayout>
  )
}
