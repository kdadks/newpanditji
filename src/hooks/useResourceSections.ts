'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, generateSlug } from '../lib/supabase'
import { deleteFileByUrl, BUCKETS } from '../lib/storage'
import { toast } from 'sonner'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ResourceFileLink {
  url: string
  label: string
  type: 'pdf' | 'ppt' | 'word' | 'excel' | 'other'
  fileName?: string
  sizeBytes?: number
}

export interface ResourceSection {
  id: string
  title: string
  slug: string
  description: string
  image_urls: string[]
  video_links: string[]
  file_links: ResourceFileLink[]
  status: 'draft' | 'published'
  sort_order: number
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export type ResourceSectionInsert = Omit<ResourceSection, 'id' | 'created_at' | 'updated_at'>
export type ResourceSectionUpdate = Partial<ResourceSectionInsert> & { id: string }

// ─── Query Keys ────────────────────────────────────────────────────────────

const RESOURCE_SECTIONS_KEY = ['resource_sections']

// ─── Slug helpers ──────────────────────────────────────────────────────────

/**
 * Generate a unique slug based on a title. If the base slug already exists in
 * the DB it appends an incrementing number (e.g. "kundali-2").
 * Pass `excludeId` when editing an existing section so we don't clash with itself.
 */
export async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = generateSlug(title)
  let candidate = base
  let counter = 1

  while (true) {
    let query = supabase
      .from('resource_sections')
      .select('id')
      .eq('slug', candidate)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data } = await query.limit(1)

    if (!data || data.length === 0) return candidate

    counter += 1
    candidate = `${base}-${counter}`
  }
}

/**
 * Validate that a manually-entered slug is unique.
 * Returns null if valid, or an error string if not.
 */
export async function validateSlug(slug: string, excludeId?: string): Promise<string | null> {
  if (!slug.trim()) return 'Slug cannot be empty'
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return 'Slug may only contain lowercase letters, numbers, and hyphens'
  }

  let query = supabase
    .from('resource_sections')
    .select('id')
    .eq('slug', slug)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data } = await query.limit(1)
  if (data && data.length > 0) return 'This slug is already in use'
  return null
}

// ─── Fetchers ──────────────────────────────────────────────────────────────

async function fetchResourceSections(includeAll: boolean): Promise<ResourceSection[]> {
  let query = supabase
    .from('resource_sections')
    .select('*')

  if (!includeAll) {
    query = query.eq('status', 'published')
  }

  const { data, error } = await query.order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []) as ResourceSection[]
}

async function fetchResourceSectionBySlug(slug: string): Promise<ResourceSection | null> {
  const { data, error } = await supabase
    .from('resource_sections')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // no rows
    throw error
  }
  return data as ResourceSection
}

async function createResourceSection(section: ResourceSectionInsert): Promise<ResourceSection> {
  const { data, error } = await supabase
    .from('resource_sections')
    .insert(section)
    .select()
    .single()

  if (error) throw error
  return data as ResourceSection
}

async function updateResourceSection({ id, ...rest }: ResourceSectionUpdate): Promise<ResourceSection> {
  const { data, error } = await supabase
    .from('resource_sections')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as ResourceSection
}

async function deleteResourceSection(id: string): Promise<void> {
  // Fetch file_links first so we can remove uploaded files from storage
  const { data: row } = await supabase
    .from('resource_sections')
    .select('file_links')
    .eq('id', id)
    .single()

  const fileLinks: ResourceFileLink[] = row?.file_links ?? []

  // Delete the DB row
  const { error } = await supabase
    .from('resource_sections')
    .delete()
    .eq('id', id)

  if (error) throw error

  // Best-effort: remove uploaded files from Supabase Storage
  await Promise.allSettled(
    fileLinks
      .filter(f => f.url)
      .map(f => deleteFileByUrl(f.url, BUCKETS.DOCUMENTS))
  )
}

// ─── Hooks ─────────────────────────────────────────────────────────────────

/**
 * Full CRUD hook for admin use (includeAll = true).
 * Pass `includeAll = false` for public-facing pages.
 */
export function useResourceSections(includeAll = false) {
  const queryClient = useQueryClient()

  const { data: sections = [], isLoading } = useQuery({
    queryKey: [...RESOURCE_SECTIONS_KEY, includeAll],
    queryFn: () => fetchResourceSections(includeAll),
  })

  const createMutation = useMutation({
    mutationFn: createResourceSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_SECTIONS_KEY })
      toast.success('Section created successfully')
    },
    onError: (err) => {
      console.error('Error creating resource section:', err)
      toast.error('Failed to create section')
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateResourceSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_SECTIONS_KEY })
      toast.success('Section updated successfully')
    },
    onError: (err) => {
      console.error('Error updating resource section:', err)
      toast.error('Failed to update section')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteResourceSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_SECTIONS_KEY })
      toast.success('Section deleted')
    },
    onError: (err) => {
      console.error('Error deleting resource section:', err)
      toast.error('Failed to delete section')
    },
  })

  return {
    sections,
    isLoading,
    createSection: createMutation.mutateAsync,
    updateSection: updateMutation.mutateAsync,
    deleteSection: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

/**
 * Single-section hook for public detail pages.
 */
export function useResourceSectionBySlug(slug: string) {
  return useQuery({
    queryKey: [...RESOURCE_SECTIONS_KEY, 'detail', slug],
    queryFn: () => fetchResourceSectionBySlug(slug),
    enabled: !!slug,
  })
}
