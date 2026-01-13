'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, extractYouTubeId, type VideoRow, type VideoInsert, type VideoUpdate } from '../lib/supabase'
import { toast } from 'sonner'

// Query keys
const VIDEOS_KEY = ['videos']

// UI-friendly video format
export interface Video {
  id: string
  title: string
  category: 'educational' | 'poetry' | 'charity' | 'podcast' | 'ceremony' | 'other'
  url: string
  thumbnail_url?: string | null
}

/**
 * Map database VideoRow to UI Video format
 */
function mapVideoRowToVideo(row: VideoRow): Video {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    url: row.video_url,
    thumbnail_url: row.thumbnail_url,
  }
}

export interface VideosQueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
}

export interface VideosResponse {
  videos: Video[]
  total: number
  page: number
  totalPages: number
}

/**
 * Fetch videos from Supabase with pagination
 */
async function fetchVideos(params?: VideosQueryParams): Promise<VideosResponse> {
  const page = params?.page || 1
  const limit = params?.limit || 25
  const search = params?.search?.toLowerCase()
  const category = params?.category

  let query = supabase
    .from('videos')
    .select('*', { count: 'exact' })
    .eq('is_published', true)

  // Apply search filter
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  // Apply category filter
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query
    .order('sort_order', { ascending: true })
    .range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching videos:', error)
    throw error
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    videos: (data || []).map(mapVideoRowToVideo),
    total,
    page,
    totalPages
  }
}

/**
 * Create a new video in Supabase
 */
async function createVideo(video: VideoInsert): Promise<VideoRow> {
  const { data, error } = await supabase
    .from('videos')
    .insert(video)
    .select()
    .single()

  if (error) {
    console.error('Error creating video:', error)
    throw error
  }

  return data
}

/**
 * Update an existing video in Supabase
 */
async function updateVideo({ id, ...updates }: VideoUpdate & { id: string }): Promise<VideoRow> {
  const { data, error } = await supabase
    .from('videos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating video:', error)
    throw error
  }

  return data
}

/**
 * Delete a video from Supabase
 */
async function deleteVideo(id: string): Promise<void> {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting video:', error)
    throw error
  }
}

/**
 * React hook for videos CRUD operations
 */
export function useVideos(params?: VideosQueryParams) {
  const queryClient = useQueryClient()

  // Query for fetching videos
  const query = useQuery<VideosResponse>({
    queryKey: [...VIDEOS_KEY, params],
    queryFn: () => fetchVideos(params),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })

  // Mutation for creating a video
  const createMutation = useMutation({
    mutationFn: createVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VIDEOS_KEY })
      toast.success('Video added successfully')
    },
    onError: (error) => {
      toast.error(`Failed to add video: ${error.message}`)
    }
  })

  // Mutation for updating a video
  const updateMutation = useMutation({
    mutationFn: updateVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VIDEOS_KEY })
      toast.success('Video updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update video: ${error.message}`)
    }
  })

  // Mutation for deleting a video
  const deleteMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VIDEOS_KEY })
      toast.success('Video deleted successfully')
    },
    onError: (error) => {
      toast.error(`Failed to delete video: ${error.message}`)
    }
  })

  return {
    // Data
    videos: query.data?.videos || [],
    total: query.data?.total || 0,
    page: query.data?.page || 1,
    totalPages: query.data?.totalPages || 0,
    isLoading: query.isLoading,
    error: query.error,

    // Operations
    createVideo: createMutation.mutateAsync,
    updateVideo: updateMutation.mutateAsync,
    deleteVideo: deleteMutation.mutateAsync,

    // Operation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Refetch
    refetch: query.refetch
  }
}

/**
 * Helper to convert legacy video format to VideoInsert
 */
export function convertLegacyVideo(video: {
  id?: string
  title: string
  category: string
  url: string
}): VideoInsert {
  const youtubeId = extractYouTubeId(video.url)
  
  return {
    title: video.title,
    slug: video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: null,
    video_url: video.url,
    thumbnail_url: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : null,
    category: video.category as 'educational' | 'poetry' | 'charity' | 'podcast' | 'ceremony' | 'other',
    duration: null,
    view_count: 0,
    is_featured: false,
    is_published: true,
    sort_order: 0
  }
}
