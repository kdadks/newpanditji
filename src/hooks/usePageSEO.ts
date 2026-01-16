'use client'

import { useEffect, useLayoutEffect } from 'react'
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
  // Use useLayoutEffect for synchronous DOM updates before paint
  useLayoutEffect(() => {
    updateMetaTags({
      ...config,
      schema: config.schema || generateOrganizationSchema(),
      robots: 'index, follow'
    })
  }, [config.title, config.description])

  // Separate effect for scroll behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [config.title])
}

export default usePageSEO
