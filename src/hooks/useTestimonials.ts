'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, TestimonialRow, TestimonialInsert, TestimonialUpdate } from '../lib/supabase'

const QUERY_KEY = 'testimonials'

// Fetch all testimonials (for admin)
async function fetchTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching testimonials:', error)
    throw new Error(error.message)
  }

  return data || []
}

// Fetch published testimonials (for public display)
async function fetchPublishedTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching published testimonials:', error)
    throw new Error(error.message)
  }

  return data || []
}

// Fetch featured testimonials
async function fetchFeaturedTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .eq('is_approved', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching featured testimonials:', error)
    throw new Error(error.message)
  }

  return data || []
}

// Create a new testimonial
async function createTestimonial(testimonial: TestimonialInsert): Promise<TestimonialRow> {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single()

  if (error) {
    console.error('Error creating testimonial:', error)
    throw new Error(error.message)
  }

  return data
}

// Update an existing testimonial
async function updateTestimonial({ id, ...testimonial }: { id: string } & TestimonialUpdate): Promise<TestimonialRow> {
  const { data, error } = await supabase
    .from('testimonials')
    .update(testimonial)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating testimonial:', error)
    throw new Error(error.message)
  }

  return data
}

// Delete a testimonial
async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting testimonial:', error)
    throw new Error(error.message)
  }
}

// Hook to fetch all testimonials (admin)
export function useTestimonials() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchTestimonials,
  })
}

// Hook to fetch published testimonials (public)
export function usePublishedTestimonials() {
  return useQuery({
    queryKey: [QUERY_KEY, 'published'],
    queryFn: fetchPublishedTestimonials,
  })
}

// Hook to fetch featured testimonials
export function useFeaturedTestimonials() {
  return useQuery({
    queryKey: [QUERY_KEY, 'featured'],
    queryFn: fetchFeaturedTestimonials,
  })
}

// Hook to create a testimonial
export function useCreateTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

// Hook to update a testimonial
export function useUpdateTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

// Hook to delete a testimonial
export function useDeleteTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}
