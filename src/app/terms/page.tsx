'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WhatsAppButton from '../../components/WhatsAppButton'
import TermsPage from '../../components/pages/TermsPage'
import { AppPage, AppNavigationData } from '../../lib/types'

export default function Terms() {
  const handleNavigate = (pageOrData: AppPage | AppNavigationData) => {
    if (typeof pageOrData === 'string') {
      window.location.href = pageOrData === 'home' ? '/' : `/${pageOrData}`
    } else {
      // Handle AppNavigationData object
      const { page, blogSlug } = pageOrData
      if (page === 'blog-detail' && blogSlug) {
        window.location.href = `/blog/${blogSlug}`
      } else {
        window.location.href = page === 'home' ? '/' : `/${page}`
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentPage="terms" onNavigate={handleNavigate} />
      <main className="flex-1">
        <TermsPage />
      </main>
      <Footer onNavigate={handleNavigate} />
      <WhatsAppButton />
    </div>
  )
}