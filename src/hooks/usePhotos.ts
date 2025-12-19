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

/**
 * Fetch all gallery photos from Supabase (from media_files table)
 */
async function fetchPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('media_files')
    .select('*')
    .eq('file_type', 'image')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching photos:', error)
    throw error
  }

  return (data || []).map(mapPhotoRowToPhoto)
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
export function usePhotos() {
  const queryClient = useQueryClient()

  // Query for fetching photos
  const query = useQuery<Photo[]>({
    queryKey: PHOTOS_KEY,
    queryFn: fetchPhotos,
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
    photos: query.data || [],
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
