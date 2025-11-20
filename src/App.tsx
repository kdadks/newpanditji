import { useLocalStorage } from './hooks/useLocalStorage'
import { lazy, Suspense, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import { Toaster } from './components/ui/sonner'
import { updateMetaTags, pageSEOConfig, generateOrganizationSchema } from './utils/seo'

// Lazy load all pages for code splitting
const HomePage = lazy(() => import('./components/pages/HomePage'))
const ServicesPage = lazy(() => import('./components/pages/ServicesPage'))
const AboutPage = lazy(() => import('./components/pages/AboutPage'))
const GalleryPage = lazy(() => import('./components/pages/GalleryPage'))
const BlogPage = lazy(() => import('./components/pages/BlogPage'))
const CharityPage = lazy(() => import('./components/pages/CharityPage'))
const TestimonialsPage = lazy(() => import('./components/pages/TestimonialsPage'))
const ContactPage = lazy(() => import('./components/pages/ContactPage'))
const AdminPage = lazy(() => import('./components/pages/AdminPage'))
const TermsPage = lazy(() => import('./components/pages/TermsPage'))
const PrivacyPage = lazy(() => import('./components/pages/PrivacyPage'))

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
)

export type Page = 'home' | 'services' | 'about' | 'gallery' | 'blog' | 'charity' | 'testimonials' | 'contact' | 'admin' | 'terms' | 'privacy'

export type NavigationData = {
  page: Page
  category?: string
}

function App() {
  const [currentPage, setCurrentPage] = useLocalStorage<Page>('currentPage', 'home')
  const [currentCategory, setCurrentCategory] = useLocalStorage<string>('currentCategory', 'all')

  // Check URL path on mount and when URL changes
  useEffect(() => {
    const checkURLPath = () => {
      const path = window.location.pathname.slice(1) // Remove leading slash
      if (path === 'admin') {
        setCurrentPage('admin')
      } else if (path && ['home', 'services', 'about', 'gallery', 'blog', 'charity', 'testimonials', 'contact', 'terms', 'privacy'].includes(path)) {
        setCurrentPage(path as Page)
      }
    }

    checkURLPath()

    // Listen for popstate (back/forward button)
    window.addEventListener('popstate', checkURLPath)
    return () => window.removeEventListener('popstate', checkURLPath)
  }, [])

  // Update SEO meta tags whenever page changes
  useEffect(() => {
    const page = currentPage || 'home'
    const seoConfig = pageSEOConfig[page as keyof typeof pageSEOConfig] || pageSEOConfig.home

    updateMetaTags({
      ...seoConfig,
      canonicalUrl: `https://panditrajesh.com/${page === 'home' ? '' : page}`,
      schema: generateOrganizationSchema(),
      robots: 'index, follow'
    })

    // Update URL without page reload (for deep linking)
    const newPath = page === 'home' ? '/' : `/${page}`
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath)
    }
  }, [currentPage])
  
  const handleNavigate = (pageOrData: Page | NavigationData) => {
    if (typeof pageOrData === 'string') {
      setCurrentPage(pageOrData)
      if (pageOrData !== 'services') {
        setCurrentCategory('all')
      }
    } else {
      setCurrentPage(pageOrData.page)
      if (pageOrData.category) {
        setCurrentCategory(pageOrData.category)
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
    const page = currentPage || 'home'
    switch (page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />
      case 'services':
        return <ServicesPage initialCategory={currentCategory} />
      case 'about':
        return <AboutPage />
      case 'gallery':
        return <GalleryPage />
      case 'blog':
        return <BlogPage />
      case 'charity':
        return <CharityPage />
      case 'testimonials':
        return <TestimonialsPage />
      case 'contact':
        return <ContactPage />
      case 'admin':
        return <AdminPage />
      case 'terms':
        return <TermsPage />
      case 'privacy':
        return <PrivacyPage />
      default:
        return <HomePage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentPage={currentPage || 'home'} onNavigate={handleNavigate} />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </main>
      <Footer onNavigate={handleNavigate} />
      <WhatsAppButton />
      <Toaster />
    </div>
  )
}

export default App