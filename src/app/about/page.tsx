'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WhatsAppButton from '../../components/WhatsAppButton'
import AboutPage from '../../components/pages/AboutPage'

type Page = 'home' | 'services' | 'about' | 'why-choose-us' | 'gallery' | 'blog' | 'blog-detail' | 'books' | 'charity' | 'testimonials' | 'dakshina' | 'contact' | 'admin' | 'terms' | 'privacy' | 'terms-and-conditions' | 'privacy-policy'

type NavigationData = {
  page: Page
  category?: string
  blogSlug?: string
}

export default function About() {
  const handleNavigate = (pageOrData: Page | NavigationData) => {
    if (typeof pageOrData === 'string') {
      window.location.href = pageOrData === 'home' ? '/' : `/${pageOrData}`
    } else {
      // Handle NavigationData object
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
      <Header currentPage="about" onNavigate={handleNavigate} />
      <main className="flex-1">
        <AboutPage />
      </main>
      <Footer onNavigate={handleNavigate} />
      <WhatsAppButton />
    </div>
  )
}