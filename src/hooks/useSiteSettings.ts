'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type SiteSettingsRow, type SiteSettingsUpdate } from '../lib/supabase'
import { toast } from 'sonner'

// Query key
const SITE_SETTINGS_KEY = ['site_settings']

/**
 * Fetch site settings from Supabase (singleton table)
 */
async function fetchSiteSettings(): Promise<SiteSettingsRow | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  if (error) {
    // If no settings exist yet, return null
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching site settings:', error)
    throw error
  }

  return data
}

/**
 * Update site settings in Supabase
 */
async function updateSiteSettings(updates: SiteSettingsUpdate): Promise<SiteSettingsRow> {
  // First check if settings exist
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id')
    .single()

  if (existing) {
    // Update existing settings
    const { data, error } = await supabase
      .from('site_settings')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating site settings:', error)
      throw error
    }

    return data
  } else {
    // Insert new settings (should rarely happen)
    const { data, error } = await supabase
      .from('site_settings')
      .insert({ ...updates, singleton_guard: true })
      .select()
      .single()

    if (error) {
      console.error('Error creating site settings:', error)
      throw error
    }

    return data
  }
}

/**
 * React hook for site settings management
 */
export function useSiteSettings() {
  const queryClient = useQueryClient()

  // Query for fetching site settings
  const query = useQuery<SiteSettingsRow | null>({
    queryKey: SITE_SETTINGS_KEY,
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })

  // Mutation for updating site settings
  const updateMutation = useMutation({
    mutationFn: updateSiteSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_KEY })
      toast.success('Site settings updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update site settings: ${error.message}`)
    }
  })

  return {
    // Data
    settings: query.data,
    isLoading: query.isLoading,
    error: query.error,

    // Operations
    updateSettings: updateMutation.mutateAsync,

    // Operation states
    isUpdating: updateMutation.isPending,

    // Refetch
    refetch: query.refetch
  }
}

// Default site settings for initialization
export const defaultSiteSettings: Partial<SiteSettingsRow> = {
  primary_email: 'panditjoshirajesh@gmail.com',
  primary_phone: '+353 123 456 789',
  whatsapp_number: '+353 123 456 789',
  country: 'Ireland',
  timezone: 'Europe/Dublin',
  enable_contact_form: true,
  enable_testimonials: true,
  enable_blog: true,
  enable_gallery: true,
  enable_books: true,
  enable_charity: true,
  primary_color: '#D97706',
  secondary_color: '#7C2D12',
  accent_color: '#F59E0B',
  footer_text: 'Traditional Hindu religious services, spiritual consultations, and cultural education serving the community with authenticity and devotion.',
  copyright_text: '© {year} Pandit Rajesh Joshi. All rights reserved.'
}
