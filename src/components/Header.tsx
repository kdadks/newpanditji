'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AppPage, AppNavigationData } from '../lib/types'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { List, X, FlowerLotus, Shield, CaretDown } from '@phosphor-icons/react'
import { authService } from '../services/auth'

interface HeaderProps {
  currentPage?: AppPage
}

const navItems: { page: AppPage; label: string; submenu?: { page: AppPage; label: string }[] }[] = [
  { page: 'home', label: 'Home' },
  {
    page: 'about',
    label: 'About',
    submenu: [
      { page: 'about', label: 'About Us' },
      { page: 'why-choose-us', label: 'Why Choose Us' },
      { page: 'books', label: 'Books' },
      { page: 'charity', label: 'Charity Work' }
    ]
  },
  { page: 'services', label: 'Services' },
  { page: 'dakshina', label: 'Dakshina' },
  { page: 'gallery', label: 'Gallery' },
  { page: 'blog', label: 'Blog' },
  { page: 'testimonials', label: 'Testimonials' },
  { page: 'contact', label: 'Contact' }
]

export default function Header({ currentPage: propCurrentPage }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  // Determine current page from pathname if not provided
  const currentPage = propCurrentPage || (() => {
    if (pathname === '/') return 'home'
    const path = pathname.slice(1) // Remove leading slash
    // Handle blog detail pages
    if (path.startsWith('blog/')) return 'blog-detail'
    return path as AppPage
  })()

  const handleNavigate = (pageOrData: AppPage | AppNavigationData) => {
    if (typeof pageOrData === 'string') {
      router.push(pageOrData === 'home' ? '/' : `/${pageOrData}`)
    } else {
      // Handle AppNavigationData object
      const { page, blogSlug } = pageOrData
      if (page === 'blog-detail' && blogSlug) {
        router.push(`/blog/${blogSlug}`)
      } else {
        router.push(page === 'home' ? '/' : `/${page}`)
      }
    }
  }

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const user = authService.user()
        if (user) {
          setIsOwner(user.role === 'owner')
        }
      } catch (error) {
        setIsOwner(false)
      }
    }
    checkOwner()

    // Recheck auth status when page changes (to update after login/logout)
    const interval = setInterval(checkOwner, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleNavClick = (page: AppPage) => {
    handleNavigate(page)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl shadow-2xl shadow-orange-900/30 bg-linear-to-r from-slate-100 via-amber-100 to-slate-100">
      {/* Unified gradient overlay for entire header */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-slate-50/80 via-orange-50/70 to-slate-50/80"></div>
        <div className="absolute inset-0 bg-linear-to-b from-amber-50/40 via-transparent to-orange-50/20"></div>
        {/* Subtle center glow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-full bg-linear-to-r from-transparent via-amber-100/30 to-transparent"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        <div className="flex items-center justify-between gap-4 py-0.5">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="group relative flex items-center gap-3 hover:opacity-90 transition-opacity duration-300"
            >
              {/* Logo Container with enhanced gradient */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-linear-to-br from-primary/30 via-accent/20 to-primary/30 border-2 border-primary/40 group-hover:border-primary/60 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/30 overflow-hidden shrink-0">
                <img
                  src="/images/Logo/Raj ji.png"
                  alt="Pandit Rajesh Joshi"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  loading="eager"
                />
                {/* Enhanced overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-primary/20 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Sacred symbol with enhanced styling */}
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-linear-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background group-hover:scale-110 transition-transform duration-300">
                  <FlowerLotus size={10} weight="fill" className="text-primary-foreground drop-shadow-sm" />
                </div>
                {/* Floating particles effect */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-accent/60 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-primary/60 rounded-full animate-ping animation-delay-1000 opacity-0 group-hover:opacity-100"></div>
              </div>

              {/* Title in chocolate color */}
              <div className="flex flex-col items-start">
                <h1 className="font-heading font-bold text-sm sm:text-base lg:text-lg text-[#6B4423] leading-tight">
                  Pandit Rajesh Joshi
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                  Hindu Priest & Spiritual Guide
                </p>
              </div>
            </button>
          </div>

          {/* Center: Navigation Bar (Desktop) with enhanced gradient */}
          <div className="hidden lg:flex flex-1 justify-center max-w-3xl">
            <nav className="bg-white/40 backdrop-blur-md rounded-full border-2 border-orange-800/50 shadow-xl shadow-orange-900/25 px-3 py-3 flex items-center gap-1.5 relative">
              {/* Navigation background glow */}
              <div className="absolute inset-0 bg-linear-to-r from-orange-50/30 via-amber-50/20 to-orange-50/30 rounded-full"></div>
              {navItems.map(item => {
                if (item.submenu) {
                  const isActive = item.submenu.some(sub => sub.page === currentPage) || currentPage === item.page
                  return (
                    <DropdownMenu key={item.page}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={isActive ? 'default' : 'ghost'}
                          size="sm"
                          className={`gap-1 px-4 py-2.5 rounded-full transition-all duration-300 hover:scale-105 text-sm font-medium relative z-10 ${
                            isActive
                              ? 'bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white shadow-lg shadow-orange-800/30 border border-orange-600/40 hover:from-orange-800 hover:via-amber-800 hover:to-orange-900'
                              : 'hover:bg-linear-to-r hover:from-orange-200/60 hover:via-amber-100/50 hover:to-orange-200/60 hover:text-orange-900 hover:shadow-md hover:shadow-orange-300/20'
                          }`}
                          suppressHydrationWarning
                        >
                          {item.label}
                          <CaretDown size={12} className="transition-transform duration-200" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="rounded-xl border-orange-200/40 shadow-xl bg-white/98 backdrop-blur-xl">
                        {item.submenu.map(subItem => (
                          <DropdownMenuItem
                            key={subItem.page}
                            onClick={() => handleNavClick(subItem.page)}
                            className={`cursor-pointer rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                              currentPage === subItem.page
                                ? 'bg-linear-to-r from-orange-200 via-amber-100 to-orange-200 text-orange-900 font-semibold shadow-sm'
                                : 'hover:bg-linear-to-r hover:from-orange-100/60 hover:via-amber-50/60 hover:to-orange-100/60 hover:text-orange-800'
                            }`}
                          >
                            {subItem.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }
                // Check if this nav item should be active (including blog-detail for blog)
                const isItemActive = currentPage === item.page || (item.page === 'blog' && currentPage === 'blog-detail')
                return (
                  <Button
                    key={item.page}
                    variant={isItemActive ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleNavClick(item.page)}
                    className={`px-4 py-2.5 rounded-full transition-all duration-300 hover:scale-105 text-sm font-medium relative z-10 ${
                      isItemActive
                        ? 'bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white shadow-lg shadow-orange-800/30 border border-orange-600/40 hover:from-orange-800 hover:via-amber-800 hover:to-orange-900'
                        : 'hover:bg-linear-to-r hover:from-orange-200/60 hover:via-amber-100/50 hover:to-orange-200/60 hover:text-orange-900 hover:shadow-md hover:shadow-orange-300/20'
                    }`}
                  >
                    {item.label}
                  </Button>
                )
              })}
              {isOwner && (
                <Button
                  variant={currentPage === 'admin' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleNavClick('admin')}
                  className={`gap-1.5 px-4 py-2.5 rounded-full transition-all duration-300 hover:scale-105 text-sm font-medium relative z-10 ${
                    currentPage === 'admin'
                      ? 'bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white shadow-lg shadow-orange-800/30 border border-orange-600/40 hover:from-orange-800 hover:via-amber-800 hover:to-orange-900'
                      : 'hover:bg-linear-to-r hover:from-orange-200/60 hover:via-amber-100/50 hover:to-orange-200/60 hover:text-orange-900 hover:shadow-md hover:shadow-orange-300/20'
                  }`}
                >
                  <Shield size={14} weight="fill" />
                  Admin
                </Button>
              )}
            </nav>
          </div>

          {/* Right: Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl hover:shadow-primary/20 border border-primary/20"
                  suppressHydrationWarning
                >
                  <List size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-xs sm:w-[400px] bg-linear-to-br from-card via-card/98 to-card border-l border-primary/30 shadow-2xl"
              >
                {/* Mobile Header with enhanced gradient */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-linear-to-br from-primary/25 to-accent/20 border-2 border-primary/40 overflow-hidden">
                        <img 
                          src="/images/Logo/Raj ji.png" 
                          alt="Pandit Rajesh Joshi" 
                          className="w-full h-full object-cover object-center"
                          loading="eager"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-linear-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-lg border-2 border-card">
                        <FlowerLotus size={8} weight="fill" className="text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading font-bold text-base bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                        Pandit Rajesh Joshi
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        Hindu Priest & Spiritual Guide
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  >
                    <X size={20} />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <div className="flex flex-col gap-3 overflow-y-auto">
                  {navItems.map(item => {
                    if (item.submenu) {
                      return (
                        <div key={item.page} className="space-y-2">
                          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-linear-to-r from-primary/10 to-accent/8 border border-primary/20 shadow-sm">
                            <span className="text-sm font-semibold text-primary">{item.label}</span>
                            <CaretDown size={14} className="text-primary/70" />
                          </div>
                          <div className="ml-4 space-y-1">
                            {item.submenu.map(subItem => (
                              <Button
                                key={subItem.page}
                                variant={currentPage === subItem.page ? 'default' : 'ghost'}
                                onClick={() => handleNavClick(subItem.page)}
                                className={`justify-start text-left w-full rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                                  currentPage === subItem.page
                                    ? 'bg-linear-to-r from-primary via-primary/95 to-accent text-primary-foreground shadow-lg shadow-primary/30 border border-primary/20'
                                    : 'hover:bg-primary/15 hover:text-primary hover:shadow-md'
                                }`}
                              >
                                {subItem.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    // Check if this nav item should be active (including blog-detail for blog)
                    const isItemActive = currentPage === item.page || (item.page === 'blog' && currentPage === 'blog-detail')
                    return (
                      <Button
                        key={item.page}
                        variant={isItemActive ? 'default' : 'ghost'}
                        onClick={() => handleNavClick(item.page)}
                        className={`justify-start text-left rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                          isItemActive
                            ? 'bg-linear-to-r from-primary via-primary/95 to-accent text-primary-foreground shadow-lg shadow-primary/30 border border-primary/20'
                            : 'hover:bg-primary/15 hover:text-primary hover:shadow-md'
                        }`}
                      >
                        {item.label}
                      </Button>
                    )
                  })}
                  {isOwner && (
                    <Button
                      variant={currentPage === 'admin' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('admin')}
                      className={`justify-start text-left gap-2 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                        currentPage === 'admin'
                          ? 'bg-linear-to-r from-primary via-primary/95 to-accent text-primary-foreground shadow-lg shadow-primary/30 border border-primary/20'
                          : 'hover:bg-primary/15 hover:text-primary hover:shadow-md'
                        }`}
                    >
                      <Shield size={16} weight="fill" />
                      Admin
                    </Button>
                  )}
                </div>

                {/* Mobile Footer */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-center text-xs text-muted-foreground">
                    <p>Experience divine guidance with</p>
                    <p className="font-medium text-primary mt-1">traditional Hindu ceremonies</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

