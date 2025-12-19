'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, generateSlug, type CharityProjectRow, type CharityProjectInsert, type CharityProjectUpdate } from '../lib/supabase'
import { toast } from 'sonner'

// Query keys
const CHARITY_KEY = ['charity_projects']

/**
 * Fetch all charity projects from Supabase
 */
async function fetchProjects(): Promise<CharityProjectRow[]> {
  const { data, error } = await supabase
    .from('charity_projects')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching charity projects:', error)
    throw error
  }

  return data || []
}

/**
 * Create a new charity project in Supabase
 */
async function createProject(project: CharityProjectInsert): Promise<CharityProjectRow> {
  const { data, error } = await supabase
    .from('charity_projects')
    .insert(project)
    .select()
    .single()

  if (error) {
    console.error('Error creating charity project:', error)
    throw error
  }

  return data
}

/**
 * Update an existing charity project in Supabase
 */
async function updateProject({ id, ...updates }: CharityProjectUpdate & { id: string }): Promise<CharityProjectRow> {
  const { data, error } = await supabase
    .from('charity_projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating charity project:', error)
    throw error
  }

  return data
}

/**
 * Delete a charity project from Supabase
 */
async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('charity_projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting charity project:', error)
    throw error
  }
}

/**
 * React hook for charity projects CRUD operations
 */
export function useCharity() {
  const queryClient = useQueryClient()

  // Query for fetching projects
  const query = useQuery({
    queryKey: CHARITY_KEY,
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })

  // Mutation for creating a project
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHARITY_KEY })
      toast.success('Charity project created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create project: ${error.message}`)
    }
  })

  // Mutation for updating a project
  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHARITY_KEY })
      toast.success('Charity project updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update project: ${error.message}`)
    }
  })

  // Mutation for deleting a project
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHARITY_KEY })
      toast.success('Charity project deleted successfully')
    },
    onError: (error) => {
      toast.error(`Failed to delete project: ${error.message}`)
    }
  })

  return {
    // Data
    projects: query.data || [],
    isLoading: query.isLoading,
    error: query.error,

    // Operations
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,

    // Operation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Refetch
    refetch: query.refetch
  }
}

/**
 * Helper to convert legacy charity project format to CharityProjectInsert
 */
export function convertLegacyProject(project: {
  id?: string
  title: string
  description: string
  videoUrl?: string
  category: string
}): CharityProjectInsert {
  return {
    slug: generateSlug(project.title),
    title: project.title,
    short_description: project.description.substring(0, 200),
    full_description: project.description,
    category: project.category || null,
    start_date: null,
    end_date: null,
    is_ongoing: true,
    beneficiaries_count: null,
    items_distributed: null,
    funds_raised: null,
    featured_image_url: null,
    video_url: project.videoUrl || null,
    gallery_images: null,
    is_published: true,
    is_featured: false,
    sort_order: 0
  }
}
