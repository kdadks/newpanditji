'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from "react-error-boundary"
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation'

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
  // Create a client for React Query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  })

  const router = useRouter()

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
                <Footer />
                <WhatsAppButton />
                <Toaster />
              </div>
            </ThemeProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}