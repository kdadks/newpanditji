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
const WhyChooseUsPage = lazy(() => import('./components/pages/WhyChooseUsPage'))
const GalleryPage = lazy(() => import('./components/pages/GalleryPage'))
const BlogPage = lazy(() => import('./components/pages/BlogPage'))
const BlogDetailPage = lazy(() => import('./components/pages/BlogDetailPage'))
const BooksPage = lazy(() => import('./components/pages/BooksPage'))
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

export type Page = 'home' | 'services' | 'about' | 'why-choose-us' | 'gallery' | 'blog' | 'blog-detail' | 'books' | 'charity' | 'testimonials' | 'contact' | 'admin' | 'terms' | 'privacy'

export type NavigationData = {
  page: Page
  category?: string
  blogId?: string
}

function App() {
  const [currentPage, setCurrentPage] = useLocalStorage<Page>('currentPage', 'home')
  const [currentCategory, setCurrentCategory] = useLocalStorage<string>('currentCategory', 'all')
  const [currentBlogId, setCurrentBlogId] = useLocalStorage<string>('currentBlogId', '')

  // Check URL path on mount and when URL changes
  useEffect(() => {
    const checkURLPath = () => {
      const path = window.location.pathname.slice(1) // Remove leading slash
      if (path === '' || path === 'home') {
        setCurrentPage('home')
      } else if (path === 'admin') {
        setCurrentPage('admin')
      } else if (path.startsWith('blog/') && path.length > 5) {
        // Handle blog detail URLs like /blog/some-blog-id
        const blogId = path.slice(5)
        setCurrentBlogId(blogId)
        setCurrentPage('blog-detail')
      } else if (['services', 'about', 'why-choose-us', 'gallery', 'blog', 'books', 'charity', 'testimonials', 'contact', 'terms', 'privacy'].includes(path)) {
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
      canonicalUrl: `https://panditrajesh.com/${page === 'home' ? '' : page === 'blog-detail' ? `blog/${currentBlogId}` : page}`,
      schema: generateOrganizationSchema(),
      robots: 'index, follow'
    })

    // Update URL without page reload (for deep linking)
    let newPath = page === 'home' ? '/' : `/${page}`
    if (page === 'blog-detail' && currentBlogId) {
      newPath = `/blog/${currentBlogId}`
    }
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath)
    }
  }, [currentPage, currentBlogId])
  
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
      if (pageOrData.blogId) {
        setCurrentBlogId(pageOrData.blogId)
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
        return <ServicesPage initialCategory={currentCategory} onNavigate={handleNavigate} />
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />
      case 'why-choose-us':
        return <WhyChooseUsPage />
      case 'gallery':
        return <GalleryPage />
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} />
      case 'blog-detail':
        return <BlogDetailPage blogId={currentBlogId} onNavigate={handleNavigate} />
      case 'books':
        return <BooksPage />
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

  const isAdminPage = currentPage === 'admin'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isAdminPage && <Header currentPage={currentPage || 'home'} onNavigate={handleNavigate} />}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </main>
      {!isAdminPage && <Footer onNavigate={handleNavigate} />}
      {!isAdminPage && <WhatsAppButton />}
      <Toaster />
    </div>
  )
}

export default App
