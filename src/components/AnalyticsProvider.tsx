'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '../lib/analytics-tracker'
import { shouldTrackAnalytics } from '../lib/analytics-utils'

/**
 * Analytics Provider Component
 * Automatically tracks page views when the route changes
 * Only tracks in production - excludes localhost/development
 */
export function AnalyticsProvider() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin routes
    if (pathname?.startsWith('/admin')) {
      return
    }

    // Don't track in development/localhost or without consent
    if (!shouldTrackAnalytics()) {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'

      if (isLocalhost) {
        console.log('[Analytics] Skipping tracking - localhost environment')
      } else {
        console.log('[Analytics] Skipping tracking - user has not consented to analytics cookies')
      }
      return
    }

    // Track page view with a small delay to ensure document title is updated
    const timer = setTimeout(() => {
      const pageTitle = document.title || 'Unknown Page'
      const pagePath = pathname || '/'

      trackPageView(pagePath, pageTitle).catch(err => {
        // Silently fail - don't disrupt user experience
        console.error('Analytics tracking failed:', err)
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
