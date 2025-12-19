'use client'

import { useEffect } from 'react'
import { updateMetaTags, generateOrganizationSchema } from '../utils/seo'

interface PageSEOProps {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  canonicalUrl?: string
  schema?: Record<string, any>
}

/**
 * Hook for updating SEO meta tags on page mount
 * Usage: usePageSEO({ title: '...', description: '...', keywords: '...' })
 */
export function usePageSEO(config: PageSEOProps) {
  useEffect(() => {
    updateMetaTags({
      ...config,
      schema: config.schema || generateOrganizationSchema(),
      robots: 'index, follow'
    })

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [config.title])
}

export default usePageSEO
