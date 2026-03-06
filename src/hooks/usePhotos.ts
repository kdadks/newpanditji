'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type MediaFileRow } from '../lib/supabase'
import { toast } from 'sonner'

// Use MediaFileRow for photos since gallery_photos is a junction table
export type PhotoRow = MediaFileRow
export type PhotoInsert = Omit<MediaFileRow, 'id' | 'created_at' | 'updated_at'>
export type PhotoUpdate = Partial<PhotoInsert>

// UI-friendly photo format
export interface Photo {
  id: string
  url: string
  title: string
  category: string
}

// Query keys
const PHOTOS_KEY = ['media_files', 'images']

/**
 * Map database MediaFileRow to UI Photo format
 */
export const NO_CATEGORY_VALUE = 'no_category'

function mapPhotoRowToPhoto(row: MediaFileRow): Photo {
  return {
    id: row.id,
    url: row.file_url,
    title: row.alt_text || row.original_name || row.file_name,
    category: row.folder || NO_CATEGORY_VALUE,
  }
}

/**
 * Bulk-reassign all photos that belong to `fromCategory` → `toCategory` in Supabase.
 */
export async function bulkReassignCategory(fromCategory: string, toCategory: string): Promise<number> {
  const { data, error } = await supabase
    .from('media_files')
    .update({ folder: toCategory })
    .eq('folder', fromCategory)
    .eq('file_type', 'image')
    .select('id')

  if (error) throw error
  return data?.length ?? 0
}

export interface PhotosQueryParams {
  page?: number
  limit?: number
  offset?: number     // explicit offset; when provided, overrides page-based calculation
  search?: string
  category?: string
  categories?: string[]   // multi-category filter (OR); takes precedence over `category`
  enabled?: boolean
}

export interface PhotosResponse {
  photos: Photo[]
  total: number
  page: number
  totalPages: number
}

/**
 * Fetch gallery photos from Supabase with pagination (from media_files table)
 */
async function fetchPhotos(params?: PhotosQueryParams): Promise<PhotosResponse> {
  const page = params?.page || 1
  const limit = params?.limit || 25
  const search = params?.search?.toLowerCase()
  const category = params?.category
  const categories = params?.categories

  let query = supabase
    .from('media_files')
    .select('*', { count: 'exact' })
    .eq('file_type', 'image')

  // Apply search filter
  if (search) {
    query = query.or(`alt_text.ilike.%${search}%,original_name.ilike.%${search}%,file_name.ilike.%${search}%`)
  }

  // Multi-category filter takes precedence
  if (categories && categories.length > 0) {
    query = query.in('folder', categories)
  } else if (category && category !== 'all') {
    if (category === NO_CATEGORY_VALUE) {
      // Match rows where folder is null or explicitly set to 'no_category'
      query = query.or(`folder.is.null,folder.eq.${NO_CATEGORY_VALUE}`)
    } else {
      query = query.eq('folder', category)
    }
  }

  // Apply pagination
  const from = params?.offset != null ? params.offset : (page - 1) * limit
  const to = from + limit - 1

  query = query
    .order('created_at', { ascending: false })
    .range(from, to)

  const { data, error, count } = await query

  if (error) {
    const msg = (error as any)?.message || (error as any)?.details || (error as any)?.hint || JSON.stringify(error)
    console.error('Error fetching photos:', msg, error)
    throw error
  }

  console.debug('[usePhotos] fetch result:', { category, categories, page, total: count, rows: data?.length })

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    photos: (data || []).map(mapPhotoRowToPhoto),
    total,
    page,
    totalPages
  }
}

/**
 * Create a new photo in Supabase (in media_files table)
 */
async function createPhoto(photo: PhotoInsert): Promise<PhotoRow> {
  const { data, error } = await supabase
    .from('media_files')
    .insert(photo)
    .select()
    .single()

  if (error) {
    console.error('Error creating photo:', error)
    throw error
  }

  return data
}

/**
 * Update an existing photo in Supabase
 */
async function updatePhoto({ id, ...updates }: PhotoUpdate & { id: string }): Promise<PhotoRow> {
  const { data, error } = await supabase
    .from('media_files')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating photo:', error)
    throw error
  }

  return data
}

/**
 * Delete a photo from Supabase
 */
async function deletePhoto(id: string): Promise<void> {
  const { error } = await supabase
    .from('media_files')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting photo:', error)
    throw error
  }
}

// ─── Photo Categories (reads the same source as AdminPhotos) ─────────────────

export interface PhotoCategory {
  value: string   // folder value stored in media_files.folder
  label: string   // display label (may include leading emoji), e.g. "📁 Services"
  count: number   // number of images in this category
}

const PHOTO_CATEGORIES_KEY = ['photo_categories']

/**
 * Reads the admin-defined category list from site_metadata (the same source
 * AdminPhotos uses) and augments each entry with an accurate image count.
 */
async function fetchPhotoCategories(): Promise<PhotoCategory[]> {
  // 1. Load the admin-defined category list from site_metadata
  const { data: meta } = await supabase
    .from('site_metadata')
    .select('setting_value')
    .eq('setting_key', 'photo_categories')
    .maybeSingle()

  let defined: { value: string; label: string }[] = []
  if (meta?.setting_value) {
    try { defined = JSON.parse(meta.setting_value) } catch { /* ignore */ }
  }

  // Fall back to empty list if nothing stored yet
  if (!defined.length) return []

  // 2. Get per-folder counts from media_files (up to 10 000 rows)
  const { data: rows } = await supabase
    .from('media_files')
    .select('folder')
    .eq('file_type', 'image')
    .range(0, 9999)

  const countMap = new Map<string, number>()
  for (const row of (rows || [])) {
    const key = row.folder || NO_CATEGORY_VALUE
    countMap.set(key, (countMap.get(key) || 0) + 1)
  }

  // 3. Merge: return all admin-defined categories with their counts
  const result = defined.map(cat => ({
    value: cat.value,
    label: cat.label,
    count: countMap.get(cat.value) ?? 0,
  }))

  // 4. Append the permanent "No Category" entry if any images lack a folder
  //    (AdminPhotos always injects this separately — it is never in site_metadata)
  const noCatCount = (countMap.get(NO_CATEGORY_VALUE) ?? 0) + (countMap.get('') ?? 0) + (countMap.get('null') ?? 0)
  if (noCatCount > 0) {
    result.push({ value: NO_CATEGORY_VALUE, label: '🏷️ No Category', count: noCatCount })
  }

  return result
}

/**
 * Hook that returns the full admin-defined category list with accurate image
 * counts — identical source to what AdminPhotos uses.
 */
export function usePhotoCategories() {
  const query = useQuery<PhotoCategory[]>({
    queryKey: PHOTO_CATEGORIES_KEY,
    queryFn: fetchPhotoCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })

  return {
    categories: query.data || [],
    isLoading: query.isLoading,
  }
}

/**
 * Given the full category list and a keyword (e.g. 'service' or 'blog'),
 * returns the first category whose value OR label (stripped of emoji/spaces)
 * contains the keyword (case-insensitive). Returns 'all' if not found.
 */
export function findCategoryByKeyword(categories: PhotoCategory[], keyword: string): string {
  const kw = keyword.toLowerCase()
  const stripEmoji = (s: string) => s.replace(/[^\p{L}\p{N}\s]/gu, '').trim().toLowerCase()
  const match = categories.find(c =>
    c.value.toLowerCase().includes(kw) || stripEmoji(c.label).includes(kw)
  )
  return match?.value ?? 'all'
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * React hook for gallery photos CRUD operations
 */
export function usePhotos(params?: PhotosQueryParams) {
  const queryClient = useQueryClient()

  // Query for fetching photos
  const query = useQuery<PhotosResponse>({
    queryKey: [...PHOTOS_KEY, params],
    queryFn: () => fetchPhotos(params),
    staleTime: 0, // Always fetch fresh data so filters/pagination work correctly
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    enabled: params?.enabled !== false, // Default to true, can be disabled
  })

  // Mutation for creating a photo
  const createMutation = useMutation({
    mutationFn: createPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHOTOS_KEY })
      toast.success('Photo added successfully')
    },
    onError: (error) => {
      toast.error(`Failed to add photo: ${error.message}`)
    }
  })

  // Mutation for updating a photo
  const updateMutation = useMutation({
    mutationFn: updatePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHOTOS_KEY })
      toast.success('Photo updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update photo: ${error.message}`)
    }
  })

  // Mutation for deleting a photo
  const deleteMutation = useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHOTOS_KEY })
      toast.success('Photo deleted successfully')
    },
    onError: (error) => {
      toast.error(`Failed to delete photo: ${error.message}`)
    }
  })

  return {
    // Data
    photos: query.data?.photos || [],
    total: query.data?.total || 0,
    page: query.data?.page || 1,
    totalPages: query.data?.totalPages || 0,
    isLoading: query.isLoading,
    error: query.error,

    // Operations
    createPhoto: createMutation.mutateAsync,
    updatePhoto: updateMutation.mutateAsync,
    deletePhoto: deleteMutation.mutateAsync,

    // Operation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Refetch
    refetch: query.refetch
  }
}

/**
 * Helper to convert legacy photo format to PhotoInsert (media_files)
 */
export function convertLegacyPhoto(photo: {
  id?: string
  url: string
  title: string
  category?: string
}): PhotoInsert {
  return {
    file_name: photo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.jpg',
    original_name: photo.title,
    file_type: 'image',
    mime_type: 'image/jpeg',
    file_size: 0,
    file_url: photo.url,
    thumbnail_url: null,
    alt_text: photo.title,
    caption: null,
    description: null,
    folder: photo.category || NO_CATEGORY_VALUE,
    tags: null
  }
}
