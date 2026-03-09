'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '../lib/analytics-tracker'
import { shouldTrackAnalytics } from '../lib/analytics-utils'
import { supabase } from '../lib/supabase'

// Push a page_view event to GA4 (gtag) if it is loaded
function fireGA4PageView(path: string, title: string) {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      page_location: window.location.href,
    })
  }
}

// Inject the GA4 gtag script dynamically (used when no build-time env var is set)
function injectGA4Script(measurementId: string) {
  if (typeof window === 'undefined') return
  if ((window as any).__ga4Injected) return
  ;(window as any).__ga4Injected = true
  ;(window as any).dataLayer = (window as any).dataLayer || []
  ;(window as any).gtag = function () { (window as any).dataLayer.push(arguments) }
  ;(window as any).gtag('js', new Date())
  ;(window as any).gtag('config', measurementId, { page_path: window.location.pathname })
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  script.async = true
  document.head.appendChild(script)
}

/**
 * Analytics Provider Component
 * - Loads GA4 Measurement ID from DB if not already injected via build-time env var
 * - Fires GA4 page_view events on every route change
 * - Tracks custom Supabase analytics with GDPR consent gate
 */
export function AnalyticsProvider() {
  const pathname = usePathname()
  const ga4Loaded = useRef(false)

  // Load GA4 from DB if the build-time env var was not set
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return  // already injected via layout
    if (ga4Loaded.current) return
    ga4Loaded.current = true

    supabase
      .from('site_metadata')
      .select('setting_value')
      .eq('setting_key', 'ga4_measurement_id')
      .maybeSingle()
      .then(({ data }) => {
        const id = data?.setting_value?.trim()
        if (id && id.startsWith('G-')) {
          injectGA4Script(id)
        }
      })
  }, [])

  useEffect(() => {
    // Don't track admin routes
    if (pathname?.startsWith('/admin')) {
      return
    }

    const timer = setTimeout(() => {
      const pageTitle = document.title || 'Unknown Page'
      const pagePath = pathname || '/'

      // GA4 page view (no consent gate — handled by GA4's own consent mode)
      fireGA4PageView(pagePath, pageTitle)

      // Custom Supabase analytics (requires GDPR consent)
      if (!shouldTrackAnalytics()) {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
        if (isLocalhost) {
          console.log('[Analytics] Skipping custom tracking - localhost environment')
        }
        return
      }

      trackPageView(pagePath, pageTitle).catch(err => {
        console.error('Analytics tracking failed:', err)
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
