'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from "react-error-boundary"
import { ThemeProvider } from 'next-themes'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import { Toaster } from '../components/ui/sonner'
import { ErrorFallback } from '../ErrorFallback'
import { AppPage, AppNavigationData } from '../lib/types'
import { supabase } from '../lib/supabase'

import "../main.css"
import "../styles/theme.css"
import "../index.css"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [siteMetadata, setSiteMetadata] = useState({
    title: 'Pandit Rajesh Joshi - Hindu Priest & Spiritual Guide',
    description: 'Experience authentic Hindu rituals, puja ceremonies, and spiritual guidance with Pandit Rajesh Joshi in Ireland.',
    keywords: 'hindu priest ireland, pandit ireland, puja services ireland'
  })

  // Fetch site metadata from database
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const { data, error } = await supabase
          .from('site_metadata')
          .select('setting_key, setting_value')
          .eq('category', 'metadata')
          .in('setting_key', ['site_title', 'site_description', 'site_keywords'])

        if (error) throw error

        const settings: Record<string, string> = {}
        data?.forEach((item) => {
          settings[item.setting_key] = item.setting_value
        })

        if (settings.site_title || settings.site_description || settings.site_keywords) {
          setSiteMetadata({
            title: settings.site_title || siteMetadata.title,
            description: settings.site_description || siteMetadata.description,
            keywords: settings.site_keywords || siteMetadata.keywords
          })

          // Update document metadata
          if (typeof document !== 'undefined') {
            document.title = settings.site_title || siteMetadata.title
            const metaDesc = document.querySelector('meta[name="description"]')
            if (metaDesc) metaDesc.setAttribute('content', settings.site_description || siteMetadata.description)
            const metaKeywords = document.querySelector('meta[name="keywords"]')
            if (metaKeywords) metaKeywords.setAttribute('content', settings.site_keywords || siteMetadata.keywords)
          }
        }
      } catch (error) {
        console.error('Error fetching site metadata:', error)
      }
    }

    fetchMetadata()
  }, [])

  // Handle auth errors globally
  useEffect(() => {
    // Listen for unhandled promise rejections (like auth errors)
    const handleRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      // Check if it's a Supabase auth error
      if (error?.message?.includes('Refresh Token') || error?.name === 'AuthApiError') {
        console.warn('Clearing invalid auth session')
        // Clear the invalid session data
        if (typeof window !== 'undefined') {
          const keysToRemove = Object.keys(localStorage).filter(key => 
            key.startsWith('sb-') || key.includes('supabase')
          )
          keysToRemove.forEach(key => localStorage.removeItem(key))
        }
        // Prevent the error from showing in console
        event.preventDefault()
      }
    }

    window.addEventListener('unhandledrejection', handleRejection)
    return () => window.removeEventListener('unhandledrejection', handleRejection)
  }, [])

  // Create QueryClient once and memoize it - CRITICAL for performance!
  // Recreating on every render causes massive slowdowns
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false, // Disable refetch on focus for mobile performance
      },
    },
  }))

  const router = useRouter()
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{siteMetadata.title}</title>
        <meta name="description" content={siteMetadata.description} />
        <meta name="keywords" content={siteMetadata.keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        {/* DNS prefetch and preconnect for faster image loading */}
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="preconnect" href="https://supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://storage.googleapis.com" />
        <link rel="preconnect" href="https://storage.googleapis.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                {!isAdminRoute && <Footer />}
                {!isAdminRoute && <WhatsAppButton />}
                <Toaster />
              </div>
            </ThemeProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}