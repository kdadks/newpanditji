'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { updateMetaTags, generateOrganizationSchema } from '../utils/seo'

interface PageMetadata {
  id: string
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  og_title: string | null
  og_description: string | null
  og_image_url: string | null
  canonical_url: string | null
}

/**
 * Hook for fetching and applying page metadata from database
 * Usage: usePageMetadata('home') - fetches metadata for the 'home' page from database
 */
export function usePageMetadata(pageSlug: string) {
  const [isApplied, setIsApplied] = useState(false)

  // Fetch page metadata from database
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['page-metadata', pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('id, slug, title, meta_title, meta_description, meta_keywords, og_title, og_description, og_image_url, canonical_url')
        .eq('slug', pageSlug)
        .single()

      if (error) {
        console.error(`Error fetching metadata for ${pageSlug}:`, error)
        return null
      }

      return data as PageMetadata
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch site-wide defaults
  const { data: siteDefaults } = useQuery({
    queryKey: ['site-metadata-defaults'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_metadata')
        .select('setting_key, setting_value')
        .in('setting_key', ['site_title', 'site_description', 'site_keywords'])

      if (error) return null

      const settings: Record<string, string> = {}
      data?.forEach((item) => {
        settings[item.setting_key] = item.setting_value
      })

      return {
        title: settings.site_title || 'Pandit Rajesh Joshi - Hindu Priest & Spiritual Guide',
        description: settings.site_description || 'Professional Hindu priest services',
        keywords: settings.site_keywords || 'hindu priest, pandit, spiritual guide'
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  // Apply metadata when data is loaded
  useLayoutEffect(() => {
    if (!isLoading && !isApplied && (pageData || siteDefaults)) {
      const title = pageData?.meta_title || pageData?.title || siteDefaults?.title || 'Pandit Rajesh Joshi'
      const description = pageData?.meta_description || siteDefaults?.description || ''
      const keywords = pageData?.meta_keywords?.join(', ') || siteDefaults?.keywords || ''

      updateMetaTags({
        title,
        description,
        keywords,
        ogTitle: pageData?.og_title || title,
        ogDescription: pageData?.og_description || description,
        ogImage: pageData?.og_image_url || undefined,
        canonicalUrl: pageData?.canonical_url || undefined,
        schema: generateOrganizationSchema(),
        robots: 'index, follow'
      })

      setIsApplied(true)
    }
  }, [pageData, siteDefaults, isLoading, isApplied])

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pageSlug])

  return {
    isLoading,
    pageData,
    siteDefaults
  }
}

export default usePageMetadata
