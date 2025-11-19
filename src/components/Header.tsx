import { useState, useEffect } from 'react'
import { Page } from '../App'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { List, X, FlowerLotus, Shield } from '@phosphor-icons/react'

interface HeaderProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const navItems: { page: Page; label: string }[] = [
  { page: 'home', label: 'Home' },
  { page: 'services', label: 'Services' },
  { page: 'about', label: 'About' },
  { page: 'gallery', label: 'Gallery' },
  { page: 'blog', label: 'Blog' },
  { page: 'charity', label: 'Charity Work' },
  { page: 'testimonials', label: 'Testimonials' },
  { page: 'contact', label: 'Contact' }
]

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const user = await window.spark.user()
        if (user) {
          setIsOwner(user.isOwner)
        }
      } catch (error) {
        setIsOwner(false)
      }
    }
    checkOwner()
  }, [])

  const handleNavClick = (page: Page) => {
    onNavigate(page)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <FlowerLotus className="text-primary" size={32} weight="fill" />
          <div className="flex flex-col items-start">
            <span className="font-heading font-bold text-xl text-primary">Pandit Rajesh Joshi</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Hindu Priest & Spiritual Guide</span>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Button
              key={item.page}
              variant={currentPage === item.page ? 'default' : 'ghost'}
              onClick={() => handleNavClick(item.page)}
              className={currentPage === item.page ? 'bg-primary text-primary-foreground' : ''}
            >
              {item.label}
            </Button>
          ))}
          {isOwner && (
            <Button
              variant={currentPage === 'admin' ? 'default' : 'ghost'}
              onClick={() => handleNavClick('admin')}
              className={`gap-2 ${currentPage === 'admin' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Shield size={16} weight="fill" />
              Admin
            </Button>
          )}
        </nav>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <List size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-2 mb-4">
                <FlowerLotus className="text-primary" size={28} weight="fill" />
                <span className="font-heading font-bold text-lg text-primary">Navigation</span>
              </div>
              {navItems.map(item => (
                <Button
                  key={item.page}
                  variant={currentPage === item.page ? 'default' : 'ghost'}
                  onClick={() => handleNavClick(item.page)}
                  className={`justify-start text-left ${currentPage === item.page ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  {item.label}
                </Button>
              ))}
              {isOwner && (
                <Button
                  variant={currentPage === 'admin' ? 'default' : 'ghost'}
                  onClick={() => handleNavClick('admin')}
                  className={`justify-start text-left gap-2 ${currentPage === 'admin' ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  <Shield size={16} weight="fill" />
                  Admin
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
