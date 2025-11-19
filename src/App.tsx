import { useKV } from '@github/spark/hooks'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './components/pages/HomePage'
import ServicesPage from './components/pages/ServicesPage'
import AboutPage from './components/pages/AboutPage'
import GalleryPage from './components/pages/GalleryPage'
import BlogPage from './components/pages/BlogPage'
import CharityPage from './components/pages/CharityPage'
import TestimonialsPage from './components/pages/TestimonialsPage'
import ContactPage from './components/pages/ContactPage'
import WhatsAppButton from './components/WhatsAppButton'
import { Toaster } from './components/ui/sonner'

export type Page = 'home' | 'services' | 'about' | 'gallery' | 'blog' | 'charity' | 'testimonials' | 'contact'

function App() {
  const [currentPage, setCurrentPage] = useKV<Page>('currentPage', 'home')
  
  const handleNavigate = (page: Page) => {
    setCurrentPage(page)
  }

  const renderPage = () => {
    const page = currentPage || 'home'
    switch (page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />
      case 'services':
        return <ServicesPage />
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
      default:
        return <HomePage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentPage={currentPage || 'home'} onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
      <WhatsAppButton />
      <Toaster />
    </div>
  )
}

export default App