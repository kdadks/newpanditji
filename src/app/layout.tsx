'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from "react-error-boundary"
import { ThemeProvider } from 'next-themes'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import { Toaster } from '../components/ui/sonner'
import { ErrorFallback } from '../ErrorFallback'
import { AppPage, AppNavigationData } from '../lib/types'

import "../main.css"
import "../styles/theme.css"
import "../index.css"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        {/* DNS prefetch and preconnect for faster image loading */}
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="preconnect" href="https://supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://storage.googleapis.com" />
        <link rel="preconnect" href="https://storage.googleapis.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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