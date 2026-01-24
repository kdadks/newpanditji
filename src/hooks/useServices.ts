'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, generateSlug, type ServiceRow, type ServiceInsert, type ServiceUpdate, type AdminServiceRow } from '../lib/supabase'
import { toast } from 'sonner'
import type { Service, ServiceDetail } from '../lib/data'

// Query keys
const SERVICES_KEY = ['services']
const ADMIN_SERVICES_KEY = ['admin_services']

// Extended ServiceRow for admin that includes category from join
interface ServiceRowWithCategory extends ServiceRow {
  service_categories?: { slug: string } | null
}

/**
 * Convert ServiceRow from database to Service format for public UI
 */
function mapServiceRowToService(row: ServiceRowWithCategory): Service {
  // Get category from joined table or default
  const category = row.service_categories?.slug || 'pooja'
  
  return {
    id: row.id,
    name: row.name,
    category: category as Service['category'],
    duration: row.duration || '',
    description: row.short_description,
    imageUrl: row.featured_image_url || undefined,
    detailedDescription: row.full_description || undefined,
    benefits: row.benefits || undefined,
    includes: row.includes || undefined,
    requirements: row.requirements || undefined,
    price: row.price || undefined,
    bestFor: row.best_for || undefined,
    details: {
      deity: row.deity_info as ServiceDetail['deity'] | undefined,
      nature: row.nature || undefined,
      purpose: row.purpose || undefined,
      significance: row.significance || undefined,
      scripturalRoots: row.scriptural_roots as ServiceDetail['scripturalRoots'] | undefined,
      whenToPerform: row.when_to_perform || undefined,
      whereAndWho: row.where_and_who || undefined,
      specialForNRIs: row.special_notes || undefined,
      coreAspects: row.core_aspects as ServiceDetail['coreAspects'] | undefined,
    },
    // Map samagri file URL to the format expected by UI
    samagriFile: row.samagri_file_url ? {
      name: 'Samagri List',
      url: row.samagri_file_url,
      type: row.samagri_file_url.endsWith('.pdf') ? 'application/pdf' : 'application/msword',
    } : undefined,
  }
}

/**
 * Convert ServiceRow from database to AdminServiceRow format for admin UI
 * Maps database column names to the names expected by AdminServices component
 */
function mapServiceRowToAdminRow(row: ServiceRowWithCategory): AdminServiceRow {
  const category = row.service_categories?.slug || 'pooja'
  
  return {
    ...row,
    // Map to admin-expected field names
    category: category as AdminServiceRow['category'],
    description: row.short_description,
    detailed_description: row.full_description,
    special_for_nris: row.special_notes,
  }
}

/**
 * Fetch all services from Supabase for public pages
 */
async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      service_categories (slug)
    `)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
    throw error
  }

  return (data || []).map(mapServiceRowToService)
}

/**
 * Fetch all services from Supabase for admin panel (includes unpublished)
 */
async function fetchAdminServices(): Promise<AdminServiceRow[]> {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      service_categories (slug)
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching admin services:', error)
    throw error
  }

  return (data || []).map(mapServiceRowToAdminRow)
}

/**
 * Create a new service in Supabase
 */
async function createService(service: ServiceInsert): Promise<ServiceRow> {
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single()

  if (error) {
    console.error('Error creating service:', error)
    throw error
  }

  return data
}

/**
 * Update an existing service in Supabase
 */
async function updateService({ id, ...updates }: ServiceUpdate & { id: string }): Promise<ServiceRow> {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating service:', error)
    throw error
  }

  return data
}

/**
 * Delete a service from Supabase
 */
async function deleteService(id: string): Promise<void> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting service:', error)
    throw error
  }
}

/**
 * React hook for services CRUD operations (public pages)
 */
export function useServices() {
  const queryClient = useQueryClient()

  // Query for fetching services
  const query = useQuery({
    queryKey: SERVICES_KEY,
    queryFn: fetchServices,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })

  // Mutation for creating a service
  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY })
      queryClient.invalidateQueries({ queryKey: ADMIN_SERVICES_KEY })
      toast.success('Service created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create service: ${error.message}`)
    }
  })

  // Mutation for updating a service
  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY })
      queryClient.invalidateQueries({ queryKey: ADMIN_SERVICES_KEY })
      toast.success('Service updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update service: ${error.message}`)
    }
  })

  // Mutation for deleting a service
  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY })
      queryClient.invalidateQueries({ queryKey: ADMIN_SERVICES_KEY })
      toast.success('Service deleted successfully')
    },
    onError: (error) => {
      toast.error(`Failed to delete service: ${error.message}`)
    }
  })

  return {
    // Data
    services: query.data || [],
    isLoading: query.isLoading,
    error: query.error,

    // Operations
    createService: createMutation.mutateAsync,
    updateService: updateMutation.mutateAsync,
    deleteService: deleteMutation.mutateAsync,

    // Operation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Refetch
    refetch: query.refetch
  }
}

/**
 * React hook for services CRUD operations (admin panel - includes all services)
 */
export function useAdminServices() {
  const queryClient = useQueryClient()

  // Query for fetching all services (including unpublished)
  const query = useQuery({
    queryKey: ADMIN_SERVICES_KEY,
    queryFn: fetchAdminServices,
    staleTime: 5 * 60 * 1000,
  })

  // Mutation for creating a service
  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY })
      queryClient.invalidateQueries({ queryKey: ADMIN_SERVICES_KEY })
      toast.success('Service created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create service: ${error.message}`)
    }
  })

  // Mutation for updating a service
  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY })
      queryClient.invalidateQueries({ queryKey: ADMIN_SERVICES_KEY })
      toast.success('Service updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update service: ${error.message}`)
    }
  })

  // Mutation for deleting a service
  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY })
      queryClient.invalidateQueries({ queryKey: ADMIN_SERVICES_KEY })
      toast.success('Service deleted successfully')
    },
    onError: (error) => {
      toast.error(`Failed to delete service: ${error.message}`)
    }
  })

  return {
    // Data
    services: query.data || [],
    isLoading: query.isLoading,
    error: query.error,

    // Operations
    createService: createMutation.mutateAsync,
    updateService: updateMutation.mutateAsync,
    deleteService: deleteMutation.mutateAsync,

    // Operation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Refetch
    refetch: query.refetch
  }
}

/**
 * Helper to convert old Service format to ServiceInsert
 */
export function convertLegacyService(service: {
  id?: string
  name: string
  category: 'pooja' | 'sanskar' | 'paath' | 'consultation' | 'wellness'
  duration: string
  description: string
  detailedDescription?: string
  benefits?: string[]
  includes?: string[]
  requirements?: string[]
  price?: string
  bestFor?: string[]
  details?: {
    deity?: { name: string; description: string; significance: string }
    nature?: string
    purpose?: string[]
    significance?: string[]
    scripturalRoots?: { source: string; description: string }
    whenToPerform?: string[]
    whereAndWho?: string
    specialForNRIs?: string[]
    coreAspects?: { title: string; content: string }[]
  }
  samagriFile?: { name: string; data: string; type: string }
}): ServiceInsert {
  return {
    slug: generateSlug(service.name),
    name: service.name,
    category_id: null, // Will be set based on category lookup
    short_description: service.description,
    full_description: service.detailedDescription || null,
    duration: service.duration || null,
    price: service.price || null,
    benefits: service.benefits || null,
    includes: service.includes || null,
    requirements: service.requirements || null,
    best_for: service.bestFor || null,
    deity_info: service.details?.deity || null,
    nature: service.details?.nature || null,
    purpose: service.details?.purpose || null,
    significance: service.details?.significance || null,
    scriptural_roots: service.details?.scripturalRoots || null,
    when_to_perform: service.details?.whenToPerform || null,
    where_and_who: service.details?.whereAndWho || null,
    special_notes: service.details?.specialForNRIs || null,
    core_aspects: service.details?.coreAspects || null,
    samagri_items: null,
    samagri_file_url: null, // File upload handled separately
    featured_image_url: null,
    gallery_images: null,
    is_featured: false,
    is_popular: false,
    view_count: 0,
    inquiry_count: 0,
    meta_title: null,
    meta_description: null,
    meta_keywords: null,
    is_published: true,
    sort_order: 0
  }
}
