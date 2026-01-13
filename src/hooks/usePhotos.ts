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
function mapPhotoRowToPhoto(row: MediaFileRow): Photo {
  return {
    id: row.id,
    url: row.file_url,
    title: row.alt_text || row.original_name || row.file_name,
    category: row.folder || 'general',
  }
}

export interface PhotosQueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
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

  let query = supabase
    .from('media_files')
    .select('*', { count: 'exact' })
    .eq('file_type', 'image')

  // Apply search filter
  if (search) {
    query = query.or(`alt_text.ilike.%${search}%,original_name.ilike.%${search}%,file_name.ilike.%${search}%`)
  }

  // Apply category filter
  if (category && category !== 'all') {
    query = query.eq('folder', category)
  }

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query
    .order('created_at', { ascending: false })
    .range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching photos:', error)
    throw error
  }

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

/**
 * React hook for gallery photos CRUD operations
 */
export function usePhotos(params?: PhotosQueryParams) {
  const queryClient = useQueryClient()

  // Query for fetching photos
  const query = useQuery<PhotosResponse>({
    queryKey: [...PHOTOS_KEY, params],
    queryFn: () => fetchPhotos(params),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
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
    folder: photo.category || 'general',
    tags: null
  }
}
