import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

// Create Supabase client with enhanced error handling
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'sb-auth-token',
      flowType: 'pkce'
    },
  }
)

// Handle invalid refresh tokens by clearing storage
if (typeof window !== 'undefined') {
  // Listen for storage events to detect token changes
  window.addEventListener('storage', (e) => {
    if (e.key?.startsWith('sb-') && e.newValue === null) {
      // Token was removed, trigger session cleanup
      supabase.auth.getSession().catch(() => {
        // Clear any remaining invalid tokens
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.startsWith('sb-') || key === 'sb-auth-token'
        )
        keysToRemove.forEach(key => localStorage.removeItem(key))
      })
    }
  })

  // Clear invalid tokens on initialization
  supabase.auth.getSession().catch((error) => {
    if (error?.message?.includes('refresh') || error?.message?.includes('token')) {
      console.warn('Clearing invalid session tokens:', error.message)
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || key === 'sb-auth-token'
      )
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }
  })
}

// Database types based on schema
export interface Database {
  public: {
    Tables: {
      services: {
        Row: ServiceRow
        Insert: ServiceInsert
        Update: ServiceUpdate
      }
      blog_posts: {
        Row: BlogPostRow
        Insert: BlogPostInsert
        Update: BlogPostUpdate
      }
      videos: {
        Row: VideoRow
        Insert: VideoInsert
        Update: VideoUpdate
      }
      gallery_photos: {
        Row: GalleryPhotoRow
        Insert: GalleryPhotoInsert
        Update: GalleryPhotoUpdate
      }
      charity_projects: {
        Row: CharityProjectRow
        Insert: CharityProjectInsert
        Update: CharityProjectUpdate
      }
    }
  }
}

// Service types - matches migration 20241203000003_services.sql
export interface ServiceRow {
  id: string
  slug: string
  name: string
  category_id: string | null
  short_description: string
  full_description: string | null
  duration: string | null
  price: string | null
  benefits: string[] | null
  includes: string[] | null
  requirements: string[] | null
  best_for: string[] | null
  deity_info: Record<string, unknown> | null
  nature: string | null
  purpose: string[] | null
  significance: string[] | null
  scriptural_roots: Record<string, unknown> | null
  when_to_perform: string[] | null
  where_and_who: string | null
  special_notes: string[] | null
  core_aspects: Record<string, unknown>[] | null
  samagri_items: Record<string, unknown> | null
  samagri_file_url: string | null
  featured_image_url: string | null
  gallery_images: string[] | null
  is_featured: boolean
  is_popular: boolean
  view_count: number
  inquiry_count: number
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type ServiceInsert = Omit<ServiceRow, 'id' | 'created_at' | 'updated_at'>
export type ServiceUpdate = Partial<ServiceInsert>

// Extended service row with category slug for admin UI
export interface AdminServiceRow extends ServiceRow {
  category: 'pooja' | 'sanskar' | 'paath' | 'consultation' | 'wellness'
  description: string
  detailed_description: string | null
  special_for_nris: string[] | null
}

// Blog post types - matches migration 20241203000004_blog.sql
export interface BlogPostRow {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category_id: string | null
  featured_image_url: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  canonical_url: string | null
  reading_time_minutes: number | null
  view_count: number
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type BlogPostInsert = Omit<BlogPostRow, 'id' | 'created_at' | 'updated_at'>
export type BlogPostUpdate = Partial<BlogPostInsert>

// Video types - matches migration 20241203000005_media.sql
export interface VideoRow {
  id: string
  title: string
  slug: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  category: 'educational' | 'poetry' | 'charity' | 'podcast' | 'ceremony' | 'other'
  duration: number | null
  view_count: number
  is_featured: boolean
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type VideoInsert = Omit<VideoRow, 'id' | 'created_at' | 'updated_at'>
export type VideoUpdate = Partial<VideoInsert>

// Gallery photo types - matches migration 20241203000005_media.sql
export interface GalleryPhotoRow {
  id: string
  gallery_id: string | null
  media_file_id: string | null
  caption: string | null
  sort_order: number
  created_at: string
}

// Media file types for standalone photos
export interface MediaFileRow {
  id: string
  file_name: string
  original_name: string
  file_type: 'image' | 'video' | 'document' | 'audio'
  mime_type: string
  file_size: number
  file_url: string
  thumbnail_url: string | null
  alt_text: string | null
  caption: string | null
  description: string | null
  folder: string
  tags: string[] | null
  created_at: string
  updated_at: string
}

export type GalleryPhotoInsert = Omit<GalleryPhotoRow, 'id' | 'created_at' | 'updated_at'>
export type GalleryPhotoUpdate = Partial<GalleryPhotoInsert>

// Charity project types - matches migration 20241203000006_content.sql
export interface CharityProjectRow {
  id: string
  slug: string
  title: string
  short_description: string
  full_description: string | null
  category: string | null
  start_date: string | null
  end_date: string | null
  is_ongoing: boolean
  beneficiaries_count: number | null
  items_distributed: number | null
  funds_raised: number | null
  featured_image_url: string | null
  video_url: string | null
  gallery_images: string[] | null
  is_published: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type CharityProjectInsert = Omit<CharityProjectRow, 'id' | 'created_at' | 'updated_at'>
export type CharityProjectUpdate = Partial<CharityProjectInsert>

// Testimonial types - matches migration 20241203000006_content.sql
export interface TestimonialRow {
  id: string
  client_name: string
  client_location: string | null
  client_image_url: string | null
  service_name: string | null
  service_id: string | null
  testimonial_text: string
  rating: number | null
  is_approved: boolean
  is_featured: boolean
  is_published: boolean
  source: string
  submitted_at: string
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

export type TestimonialInsert = Omit<TestimonialRow, 'id' | 'created_at' | 'updated_at' | 'submitted_at'>
export type TestimonialUpdate = Partial<TestimonialInsert>

// Book types - matches migration 20241203000006_content.sql
export interface BookRow {
  id: string
  title: string
  subtitle: string | null
  slug: string
  author: string
  isbn: string | null
  description: string
  full_description: string | null
  category: string
  key_topics: string[] | null
  target_audience: string | null
  chapter_list: string[] | null
  cover_image_url: string | null
  preview_pdf_url: string | null
  amazon_url: string | null
  flipkart_url: string | null
  other_purchase_urls: Record<string, string> | null
  publication_date: string | null
  page_count: number | null
  language: string
  is_published: boolean
  is_featured: boolean
  sort_order: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export type BookInsert = Omit<BookRow, 'id' | 'created_at' | 'updated_at'>
export type BookUpdate = Partial<BookInsert>

// Page types - matches migration 20241203000002_pages.sql
export interface PageRow {
  id: string
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  og_title: string | null
  og_description: string | null
  og_image_url: string | null
  canonical_url: string | null
  is_published: boolean
  is_indexed: boolean
  template_type: string
  custom_css: string | null
  custom_js: string | null
  sort_order: number
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export type PageInsert = Omit<PageRow, 'id' | 'created_at' | 'updated_at'>
export type PageUpdate = Partial<PageInsert>

// Page Section types - matches migration 20241203000002_pages.sql
export interface PageSectionRow {
  id: string
  page_id: string
  section_key: string
  section_type: string
  title: string | null
  subtitle: string | null
  content: Record<string, unknown>
  background_color: string | null
  background_image_url: string | null
  sort_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export type PageSectionInsert = Omit<PageSectionRow, 'id' | 'created_at' | 'updated_at'>
export type PageSectionUpdate = Partial<PageSectionInsert>

// Site Settings types - matches migration 20241203000011_settings.sql
export interface SiteSettingsRow {
  id: string
  primary_email: string | null
  secondary_email: string | null
  primary_phone: string | null
  secondary_phone: string | null
  whatsapp_number: string | null
  address: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  country: string
  postal_code: string | null
  business_hours: Record<string, unknown> | null
  timezone: string
  facebook_page_url: string | null
  instagram_url: string | null
  youtube_channel_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  enable_contact_form: boolean
  enable_testimonials: boolean
  enable_blog: boolean
  enable_gallery: boolean
  enable_books: boolean
  enable_charity: boolean
  enable_booking: boolean
  enable_newsletter: boolean
  maintenance_mode: boolean
  maintenance_message: string | null
  maintenance_end_time: string | null
  site_logo_url: string | null
  site_logo_dark_url: string | null
  site_favicon_url: string | null
  primary_color: string
  secondary_color: string
  accent_color: string
  footer_text: string | null
  copyright_text: string | null
  updated_by: string | null
  updated_at: string
}

export type SiteSettingsUpdate = Partial<Omit<SiteSettingsRow, 'id' | 'updated_at'>>

// Menu types - matches migration 20241203000011_settings.sql
export interface MenuRow {
  id: string
  name: string
  location: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type MenuInsert = Omit<MenuRow, 'id' | 'created_at' | 'updated_at'>
export type MenuUpdate = Partial<MenuInsert>

// Menu Item types - matches migration 20241203000011_settings.sql
export interface MenuItemRow {
  id: string
  menu_id: string
  parent_id: string | null
  label: string
  url: string
  page_id: string | null
  icon: string | null
  target: string
  css_class: string | null
  sort_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export type MenuItemInsert = Omit<MenuItemRow, 'id' | 'created_at' | 'updated_at'>
export type MenuItemUpdate = Partial<MenuItemInsert>

// Helper function to extract YouTube video ID from various URL formats
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

// Helper function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
