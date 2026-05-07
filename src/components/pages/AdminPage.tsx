'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield } from '@phosphor-icons/react'
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
import AdminSEO from '../admin/AdminSEO'
import AdminResourceCenter from '../admin/AdminResourceCenter'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'sonner'

/**
 * Admin dashboard shell.
 *
 * Authentication is enforced server-side by:
 *  1. middleware.ts   — redirects before page is served
 *  2. app/admin/page.tsx — server component double-check via getUser()
 *
 * This component only handles the client-side session lifecycle
 * (monitoring sign-out, section routing, etc.).
 */
export default function AdminPage() {
  const { user, loading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState('analytics')

  // If the client-side session expires or is cleared while the user is on this
  // page, redirect them back to login rather than showing a blank/broken state.
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/admin/login')
    }
  }, [loading, isAuthenticated, router])

  const handleLogout = async () => {
    await logout()
    setCurrentSection('analytics')
    toast.success('Logged out successfully')
    router.replace('/admin/login')
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
      case 'seo':
        return <AdminSEO />
      case 'resourceCenter':
        return <AdminResourceCenter />
      default:
        return <AdminAnalytics />
    }
  }

  // Show a loading spinner while the client-side auth service initialises.
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" suppressHydrationWarning>
        <div className="text-center" suppressHydrationWarning>
          <Shield className="mx-auto mb-4 text-muted-foreground animate-pulse" size={64} />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      onLogout={handleLogout}
      userEmail={user?.email || 'admin@panditji.com'}
    >
      {renderContent()}
    </AdminLayout>
  )
}
