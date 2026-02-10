'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type PageRow, type PageSectionRow } from '../lib/supabase'
import { toast } from 'sonner'

const LEGAL_PAGES_KEY = ['legal_pages']

// ============================================================================
// Types for Legal Pages
// ============================================================================

export interface LegalPageContent {
  id: string
  slug: string
  title: string
  metaTitle?: string
  metaDescription?: string
  sections: LegalPageSection[]
  isPublished: boolean
}

export interface LegalPageSection {
  id?: string
  title: string
  content: string
  sortOrder: number
}

// ============================================================================
// Database Operations
// ============================================================================

/**
 * Fetch all legal pages
 */
async function fetchLegalPages(): Promise<PageRow[]> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('template_type', 'legal')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching legal pages:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch a single legal page with its sections
 */
async function fetchLegalPageBySlug(slug: string): Promise<LegalPageContent | null> {
  // Fetch page
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('template_type', 'legal')
    .single()

  if (pageError) {
    if (pageError.code === 'PGRST116') return null
    console.error('Error fetching legal page:', pageError)
    throw pageError
  }

  // Fetch sections
  const { data: sections, error: sectionsError } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', page.id)
    .order('sort_order', { ascending: true })

  if (sectionsError) {
    console.error('Error fetching page sections:', sectionsError)
    throw sectionsError
  }

  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    metaTitle: page.meta_title || undefined,
    metaDescription: page.meta_description || undefined,
    isPublished: page.is_published,
    sections: (sections || []).map(section => ({
      id: section.id,
      title: section.title || '',
      content: (section.content as any)?.html || '',
      sortOrder: section.sort_order
    }))
  }
}

/**
 * Create a new legal page
 */
async function createLegalPage(data: {
  slug: string
  title: string
  metaTitle?: string
  metaDescription?: string
}): Promise<PageRow> {
  const { data: page, error } = await supabase
    .from('pages')
    .insert({
      slug: data.slug,
      title: data.title,
      meta_title: data.metaTitle || data.title,
      meta_description: data.metaDescription || '',
      template_type: 'legal',
      is_published: false,
      is_indexed: true,
      sort_order: 0
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating legal page:', error)
    throw error
  }

  return page
}

/**
 * Update a legal page
 */
async function updateLegalPage(
  pageId: string,
  content: LegalPageContent
): Promise<void> {
  // Update page metadata
  const { error: pageError } = await supabase
    .from('pages')
    .update({
      title: content.title,
      meta_title: content.metaTitle || content.title,
      meta_description: content.metaDescription || '',
      is_published: content.isPublished,
      updated_at: new Date().toISOString()
    })
    .eq('id', pageId)

  if (pageError) {
    console.error('Error updating page:', pageError)
    throw pageError
  }

  // Get existing sections
  const { data: existingSections } = await supabase
    .from('page_sections')
    .select('id')
    .eq('page_id', pageId)

  const existingIds = (existingSections || []).map(s => s.id)

  // Delete removed sections
  const sectionIdsToKeep = content.sections
    .filter(s => s.id)
    .map(s => s.id!)

  const sectionsToDelete = existingIds.filter(id => !sectionIdsToKeep.includes(id))

  if (sectionsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('page_sections')
      .delete()
      .in('id', sectionsToDelete)

    if (deleteError) {
      console.error('Error deleting sections:', deleteError)
      throw deleteError
    }
  }

  // Update or create sections
  for (let i = 0; i < content.sections.length; i++) {
    const section = content.sections[i]
    const sectionData = {
      page_id: pageId,
      section_key: `section_${i + 1}`,
      section_type: 'content',
      title: section.title,
      content: { html: section.content },
      sort_order: section.sortOrder,
      is_visible: true
    }

    if (section.id) {
      // Update existing section
      const { error: updateError } = await supabase
        .from('page_sections')
        .update(sectionData)
        .eq('id', section.id)

      if (updateError) {
        console.error('Error updating section:', updateError)
        throw updateError
      }
    } else {
      // Create new section
      const { error: insertError } = await supabase
        .from('page_sections')
        .insert(sectionData)

      if (insertError) {
        console.error('Error creating section:', insertError)
        throw insertError
      }
    }
  }
}

/**
 * Delete a legal page
 */
async function deleteLegalPage(pageId: string): Promise<void> {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId)

  if (error) {
    console.error('Error deleting legal page:', error)
    throw error
  }
}

// ============================================================================
// React Hooks
// ============================================================================

/**
 * Hook to fetch all legal pages
 */
export function useLegalPages() {
  const queryClient = useQueryClient()

  const query = useQuery<PageRow[]>({
    queryKey: LEGAL_PAGES_KEY,
    queryFn: fetchLegalPages,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createMutation = useMutation({
    mutationFn: createLegalPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEGAL_PAGES_KEY })
      toast.success('Legal page created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create page: ${error.message}`)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLegalPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEGAL_PAGES_KEY })
      toast.success('Legal page deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete page: ${error.message}`)
    }
  })

  return {
    pages: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createPage: createMutation.mutateAsync,
    deletePage: deleteMutation.mutateAsync,
    refetch: query.refetch
  }
}

/**
 * Hook to fetch and edit a specific legal page
 */
export function useLegalPage(slug: string) {
  const queryClient = useQueryClient()

  const query = useQuery<LegalPageContent | null>({
    queryKey: [...LEGAL_PAGES_KEY, slug],
    queryFn: () => fetchLegalPageBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })

  const updateMutation = useMutation({
    mutationFn: async (content: LegalPageContent) => {
      await updateLegalPage(content.id, content)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEGAL_PAGES_KEY })
      toast.success('Page saved successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to save page: ${error.message}`)
    }
  })

  return {
    content: query.data,
    isLoading: query.isLoading,
    error: query.error,
    savePage: updateMutation.mutateAsync,
    isSaving: updateMutation.isPending,
    refetch: query.refetch
  }
}
