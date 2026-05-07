'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'

export const RESOURCE_CENTER_SLUG = 'pandit-resource-center'
const RESOURCE_CENTER_KEY = ['resource_center', RESOURCE_CENTER_SLUG]

// ─── Types ──────────────────────────────────────────────────────────────────

export type ModuleType = 'text' | 'mediaGallery' | 'fileAttachments'

export interface VideoEntry {
  url: string
  title: string
  caption?: string
  thumbnail?: string
}

export interface PhotoEntry {
  src: string
  title: string
  alt: string
  caption?: string
  sizeBytes?: number
}

export interface FileEntry {
  url: string
  title: string
  description?: string
  mimeType?: string
  sizeBytes?: number
  hash?: string
}

export interface TextContent {
  html: string
}

export interface MediaGalleryContent {
  videos: VideoEntry[]
  photos: PhotoEntry[]
}

export interface FileAttachmentsContent {
  files: FileEntry[]
}

export interface ResourceModule {
  /** DB row id when persisted (string UUID), local-only id otherwise (`local_*`). */
  id: string
  type: ModuleType
  title: string
  subtitle?: string
  sortOrder: number
  content: TextContent | MediaGalleryContent | FileAttachmentsContent
}

export interface ResourceCenterContent {
  pageId: string
  title: string
  metaTitle?: string
  metaDescription?: string
  isPublished: boolean
  modules: ResourceModule[]
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeLocalId() {
  return `local_${Math.random().toString(36).slice(2, 11)}_${Date.now()}`
}

export function isPersistedId(id: string) {
  return !!id && !id.startsWith('local_')
}

export function defaultContentForType(type: ModuleType): ResourceModule['content'] {
  if (type === 'text') return { html: '' }
  if (type === 'mediaGallery') return { videos: [], photos: [] }
  return { files: [] }
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function youTubeThumbnail(url: string): string | undefined {
  const id = extractYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined
}

// ─── Database operations ────────────────────────────────────────────────────

async function fetchResourceCenter(): Promise<ResourceCenterContent | null> {
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('id, title, meta_title, meta_description, is_published')
    .eq('slug', RESOURCE_CENTER_SLUG)
    .single()

  if (pageError) {
    if (pageError.code === 'PGRST116') return null
    throw pageError
  }

  const { data: sections, error: sectionsError } = await supabase
    .from('page_sections')
    .select('id, section_key, section_type, title, subtitle, content, sort_order')
    .eq('page_id', page.id)
    .like('section_key', 'rc_module_%')
    .order('sort_order', { ascending: true })

  if (sectionsError) throw sectionsError

  const modules: ResourceModule[] = (sections || []).map((row: any) => {
    const raw = (row.content || {}) as any
    const moduleType = (raw.moduleType as ModuleType) || 'text'
    let content: ResourceModule['content']
    if (moduleType === 'text') {
      content = { html: typeof raw.html === 'string' ? raw.html : '' }
    } else if (moduleType === 'mediaGallery') {
      content = {
        videos: Array.isArray(raw.videos) ? raw.videos : [],
        photos: Array.isArray(raw.photos) ? raw.photos : [],
      }
    } else {
      content = { files: Array.isArray(raw.files) ? raw.files : [] }
    }
    return {
      id: row.id,
      type: moduleType,
      title: row.title || '',
      subtitle: row.subtitle || undefined,
      sortOrder: row.sort_order ?? 0,
      content,
    }
  })

  return {
    pageId: page.id,
    title: page.title,
    metaTitle: page.meta_title || undefined,
    metaDescription: page.meta_description || undefined,
    isPublished: !!page.is_published,
    modules,
  }
}

async function saveResourceCenter(payload: ResourceCenterContent): Promise<void> {
  // 1) Page-level metadata
  const { error: pageError } = await supabase
    .from('pages')
    .update({
      title: payload.title,
      meta_title: payload.metaTitle || payload.title,
      meta_description: payload.metaDescription || '',
      is_published: payload.isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.pageId)

  if (pageError) throw pageError

  // 2) Section diff
  const { data: existing, error: existingError } = await supabase
    .from('page_sections')
    .select('id')
    .eq('page_id', payload.pageId)
    .like('section_key', 'rc_module_%')

  if (existingError) throw existingError
  const existingIds = (existing || []).map(r => r.id)
  const keepIds = payload.modules.filter(m => isPersistedId(m.id)).map(m => m.id)
  const toDelete = existingIds.filter(id => !keepIds.includes(id))

  if (toDelete.length > 0) {
    const { error: delError } = await supabase
      .from('page_sections')
      .delete()
      .in('id', toDelete)
    if (delError) throw delError
  }

  // 3) Upsert modules in order
  for (let i = 0; i < payload.modules.length; i++) {
    const m = payload.modules[i]
    const sectionKey = `rc_module_${i + 1}`
    const sectionType = `rc_${m.type}`
    const contentJson: any = { moduleType: m.type, ...m.content }

    if (isPersistedId(m.id)) {
      const { error: updError } = await supabase
        .from('page_sections')
        .update({
          section_key: sectionKey,
          section_type: sectionType,
          title: m.title,
          subtitle: m.subtitle || null,
          content: contentJson,
          sort_order: i,
          is_visible: true,
        })
        .eq('id', m.id)
      if (updError) throw updError
    } else {
      const { error: insError } = await supabase
        .from('page_sections')
        .insert({
          page_id: payload.pageId,
          section_key: sectionKey,
          section_type: sectionType,
          title: m.title,
          subtitle: m.subtitle || null,
          content: contentJson,
          sort_order: i,
          is_visible: true,
        })
      if (insError) throw insError
    }
  }
}

// ─── React hook ─────────────────────────────────────────────────────────────

export function useResourceCenter() {
  const queryClient = useQueryClient()

  const query = useQuery<ResourceCenterContent | null>({
    queryKey: RESOURCE_CENTER_KEY,
    queryFn: fetchResourceCenter,
    staleTime: 60 * 1000,
  })

  const saveMutation = useMutation({
    mutationFn: saveResourceCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_CENTER_KEY })
      toast.success('Resource Center saved')
    },
    onError: (e: Error) => {
      toast.error(`Save failed: ${e.message}`)
    },
  })

  return {
    content: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    save: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    refetch: query.refetch,
    makeLocalId,
  }
}
