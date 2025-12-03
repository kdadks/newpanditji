import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type PageRow, type PageSectionRow, type PageSectionUpdate, type PageUpdate } from '../lib/supabase'
import { toast } from 'sonner'

// Query keys
const PAGES_KEY = ['pages']
const PAGE_SECTIONS_KEY = ['page_sections']

// ============================================================================
// Pages CRUD
// ============================================================================

/**
 * Fetch all pages from Supabase
 */
async function fetchPages(): Promise<PageRow[]> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching pages:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch a single page by slug
 */
async function fetchPageBySlug(slug: string): Promise<PageRow | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching page:', error)
    throw error
  }

  return data
}

/**
 * Update a page in Supabase
 */
async function updatePage({ id, ...updates }: PageUpdate & { id: string }): Promise<PageRow> {
  const { data, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating page:', error)
    throw error
  }

  return data
}

// ============================================================================
// Page Sections CRUD
// ============================================================================

/**
 * Fetch all sections for a specific page
 */
async function fetchPageSections(pageId: string): Promise<PageSectionRow[]> {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching page sections:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch sections by page slug (joins pages and page_sections)
 */
async function fetchSectionsBySlug(slug: string): Promise<PageSectionRow[]> {
  // First get the page
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .single()

  if (pageError) {
    if (pageError.code === 'PGRST116') return []
    console.error('Error fetching page:', pageError)
    throw pageError
  }

  if (!page) return []

  // Then get sections
  return fetchPageSections(page.id)
}

/**
 * Update or create a page section
 */
async function upsertPageSection(section: Partial<PageSectionRow> & { page_id: string; section_key: string }): Promise<PageSectionRow> {
  const { data, error } = await supabase
    .from('page_sections')
    .upsert(section, { onConflict: 'page_id,section_key' })
    .select()
    .single()

  if (error) {
    console.error('Error upserting page section:', error)
    throw error
  }

  return data
}

/**
 * Update an existing page section
 */
async function updatePageSection({ id, ...updates }: PageSectionUpdate & { id: string }): Promise<PageSectionRow> {
  const { data, error } = await supabase
    .from('page_sections')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating page section:', error)
    throw error
  }

  return data
}

/**
 * Batch update multiple page sections
 */
async function batchUpdateSections(sections: (PageSectionUpdate & { id: string })[]): Promise<PageSectionRow[]> {
  const results: PageSectionRow[] = []
  
  for (const section of sections) {
    const result = await updatePageSection(section)
    results.push(result)
  }
  
  return results
}

// ============================================================================
// React Hooks
// ============================================================================

/**
 * Hook for managing all pages
 */
export function usePages() {
  const queryClient = useQueryClient()

  const query = useQuery<PageRow[]>({
    queryKey: PAGES_KEY,
    queryFn: fetchPages,
    staleTime: 5 * 60 * 1000,
  })

  const updateMutation = useMutation({
    mutationFn: updatePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAGES_KEY })
      toast.success('Page updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update page: ${error.message}`)
    }
  })

  return {
    pages: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    updatePage: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    refetch: query.refetch
  }
}

/**
 * Hook for managing a single page by slug
 */
export function usePage(slug: string) {
  const queryClient = useQueryClient()

  const query = useQuery<PageRow | null>({
    queryKey: [...PAGES_KEY, slug],
    queryFn: () => fetchPageBySlug(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  })

  const updateMutation = useMutation({
    mutationFn: updatePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAGES_KEY })
      toast.success('Page updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update page: ${error.message}`)
    }
  })

  return {
    page: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updatePage: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    refetch: query.refetch
  }
}

/**
 * Hook for managing page sections for a specific page
 */
export function usePageSections(pageSlug: string) {
  const queryClient = useQueryClient()

  const query = useQuery<PageSectionRow[]>({
    queryKey: [...PAGE_SECTIONS_KEY, pageSlug],
    queryFn: () => fetchSectionsBySlug(pageSlug),
    staleTime: 5 * 60 * 1000,
    enabled: !!pageSlug,
  })

  const upsertMutation = useMutation({
    mutationFn: upsertPageSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAGE_SECTIONS_KEY })
      toast.success('Section saved successfully')
    },
    onError: (error) => {
      toast.error(`Failed to save section: ${error.message}`)
    }
  })

  const updateMutation = useMutation({
    mutationFn: updatePageSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAGE_SECTIONS_KEY })
      toast.success('Section updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update section: ${error.message}`)
    }
  })

  const batchUpdateMutation = useMutation({
    mutationFn: batchUpdateSections,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAGE_SECTIONS_KEY })
      toast.success('All sections saved successfully')
    },
    onError: (error) => {
      toast.error(`Failed to save sections: ${error.message}`)
    }
  })

  // Helper to get a section by key
  const getSection = (sectionKey: string): PageSectionRow | undefined => {
    return query.data?.find(s => s.section_key === sectionKey)
  }

  // Helper to get section content
  const getSectionContent = <T extends Record<string, unknown>>(sectionKey: string): T | null => {
    const section = getSection(sectionKey)
    return section?.content as T | null
  }

  return {
    sections: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    
    // Operations
    upsertSection: upsertMutation.mutateAsync,
    updateSection: updateMutation.mutateAsync,
    batchUpdateSections: batchUpdateMutation.mutateAsync,
    
    // Helpers
    getSection,
    getSectionContent,
    
    // Operation states
    isSaving: upsertMutation.isPending || updateMutation.isPending || batchUpdateMutation.isPending,
    
    refetch: query.refetch
  }
}

// ============================================================================
// Content Types for Sections
// ============================================================================

// Hero Section Content
export interface HeroSectionContent {
  title: string
  subtitle: string
  description: string
  backgroundImages: string[]
  profileImage: string
  ctaText: string
  ctaLink: string
  statistics: {
    label: string
    value: string
    icon?: string
  }[]
}

// Gallery Section Content
export interface GallerySectionContent {
  title: string
  subtitle: string
  images: {
    url: string
    alt: string
    caption?: string
  }[]
}

// Feature Section Content
export interface FeatureSectionContent {
  title: string
  subtitle: string
  features: {
    icon: string
    title: string
    description: string
  }[]
}

// CTA Section Content
export interface CTASectionContent {
  title: string
  subtitle: string
  description: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  backgroundImage?: string
}

// Contact Section Content
export interface ContactSectionContent {
  title: string
  subtitle: string
  email: string
  phone: string
  whatsapp: string
  address: string
  mapEmbedUrl?: string
  formEnabled: boolean
}

// About Section Content
export interface AboutSectionContent {
  title: string
  subtitle: string
  description: string
  fullBio: string
  profileImage: string
  badges: string[]
  highlights: {
    icon: string
    label: string
    value: string
  }[]
}

// Default content templates
export const defaultHeroContent: HeroSectionContent = {
  title: 'Hindu Priest & Spiritual Guide',
  subtitle: 'Traditional Vedic Services',
  description: 'Bringing sacred Hindu traditions to your doorstep with authentic rituals and spiritual guidance',
  backgroundImages: [],
  profileImage: '',
  ctaText: 'Book Consultation',
  ctaLink: '/contact',
  statistics: [
    { label: 'Poojas Performed', value: '500+' },
    { label: 'Happy Families', value: '250+' },
    { label: 'Years Experience', value: '15+' },
    { label: 'Books Published', value: '5' }
  ]
}

export const defaultAboutContent: AboutSectionContent = {
  title: 'About Pandit Rajesh Joshi',
  subtitle: 'Your Trusted Spiritual Guide',
  description: 'Serving the Hindu community for over 15 years',
  fullBio: '',
  profileImage: '',
  badges: [],
  highlights: []
}
