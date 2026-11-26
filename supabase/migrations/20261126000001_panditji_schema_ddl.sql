-- ============================================================================
-- PANDIT RAJESH JOSHI PLATFORM - MULTI-TENANT ISOLATION MIGRATION
-- Schema: panditji
-- Target: Shared Supabase Database (gsqfaguqsmnuoeuhpxro)
-- Model: app.metadata Binding Model (3-Layer Security Architecture)
--
-- Layer 1: Anonymous (Unauthenticated) Isolation
-- Layer 2: Irreversible 1-to-1 User Project Binding
-- Layer 3: Database RLS Air-Gap
-- Storage: Prefixed with Project Name (panditji-*)
-- ============================================================================

-- ============================================================================
-- 0. SCHEMA INITIALIZATION & EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS panditji;

-- Set default grants for the schema
GRANT USAGE ON SCHEMA panditji TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA panditji GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA panditji GRANT ALL ON TABLES TO authenticated, service_role;

-- ============================================================================
-- 1. LAYER 2: IRREVERSIBLE 1-TO-1 USER PROJECT BINDING FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Check if caller is authenticated AND bound to the 'panditji' project
CREATE OR REPLACE FUNCTION panditji.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = panditji, auth, pg_temp
AS $$
  SELECT (
    auth.role() = 'authenticated'
    AND (
      (auth.jwt() -> 'app_metadata' ->> 'project') = 'panditji'
      OR (auth.jwt() -> 'app_metadata' -> 'projects') ? 'panditji'
    )
  );
$$;

-- Function: Helper to extract current user id if caller is bound to 'panditji'
CREATE OR REPLACE FUNCTION panditji.current_admin_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = panditji, auth, pg_temp
AS $$
  SELECT CASE
    WHEN panditji.is_admin() THEN auth.uid()
    ELSE NULL
  END;
$$;

-- Procedure / Helper: Bind a user in auth.users to project 'panditji'
CREATE OR REPLACE FUNCTION panditji.bind_user_to_project(target_email text, target_role text DEFAULT 'admin')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = panditji, auth, pg_temp
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object(
    'project', 'panditji',
    'role', target_role,
    'bound_at', NOW()
  )
  WHERE email = target_email;
  
  IF NOT FOUND THEN
    RAISE NOTICE 'No auth user found with email %', target_email;
  ELSE
    RAISE NOTICE 'User % successfully bound to project panditji with role %', target_email, target_role;
  END IF;
END;
$$;

-- Trigger Function: Enforce irreversible project binding
-- Prevents non-superusers from stripping or altering the 'project' claim once assigned to 'panditji'
CREATE OR REPLACE FUNCTION panditji.enforce_irreversible_project_binding()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = panditji, auth, pg_temp
AS $$
BEGIN
  IF (OLD.raw_app_meta_data->>'project' = 'panditji') AND 
     (NEW.raw_app_meta_data->>'project' IS DISTINCT FROM 'panditji') THEN
    IF current_user NOT IN ('postgres', 'supabase_admin') THEN
      RAISE EXCEPTION 'Security Violation: Project binding is irreversible. Cannot unbind user % from project panditji', OLD.email;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_panditji_enforce_irreversible_binding'
  ) THEN
    CREATE TRIGGER trg_panditji_enforce_irreversible_binding
      BEFORE UPDATE OF raw_app_meta_data ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION panditji.enforce_irreversible_project_binding();
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Note: auth.users trigger setup skipped or requires elevated migration permissions: %', SQLERRM;
END;
$$;

-- Generic update timestamp trigger function
CREATE OR REPLACE FUNCTION panditji.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = panditji, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Immutable date extraction helper for analytics index
CREATE OR REPLACE FUNCTION panditji.get_date_from_timestamptz(ts TIMESTAMPTZ)
RETURNS DATE
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT ts::date;
$$;

-- ============================================================================
-- 2. TABLE DEFINITIONS (SCHEMA: panditji)
-- ============================================================================

-- 2.1 Admin Users (Project-Scoped Sync with auth.users)
CREATE TABLE IF NOT EXISTS panditji.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Admin Sessions
CREATE TABLE IF NOT EXISTS panditji.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES panditji.admin_users(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  login_at TIMESTAMPTZ DEFAULT NOW(),
  logout_at TIMESTAMPTZ
);

-- 2.3 Activity Logs
CREATE TABLE IF NOT EXISTS panditji.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES panditji.admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_name TEXT,
  description TEXT NOT NULL,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 CMS Pages
CREATE TABLE IF NOT EXISTS panditji.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  is_published BOOLEAN DEFAULT true,
  is_indexed BOOLEAN DEFAULT true,
  template_type TEXT NOT NULL DEFAULT 'static_content',
  custom_css TEXT,
  custom_js TEXT,
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES panditji.admin_users(id),
  updated_by UUID REFERENCES panditji.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- 2.5 Page Sections
CREATE TABLE IF NOT EXISTS panditji.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES panditji.pages(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  section_type TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  content JSONB DEFAULT '{}',
  background_color TEXT,
  background_image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id, section_key)
);

-- 2.6 Service Categories
CREATE TABLE IF NOT EXISTS panditji.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.7 Services
CREATE TABLE IF NOT EXISTS panditji.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES panditji.service_categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  duration TEXT,
  price TEXT,
  featured_image_url TEXT,
  image_position TEXT,
  samagri_file_url TEXT,
  where_and_who TEXT,
  core_aspects JSONB,
  special_notes JSONB,
  is_featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  is_package BOOLEAN DEFAULT false,
  package_services UUID[],
  package_savings_text TEXT,
  package_highlights TEXT[],
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.8 Service Package Items (Junction)
CREATE TABLE IF NOT EXISTS panditji.service_package_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES panditji.services(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES panditji.services(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  service_snapshot JSONB,
  package_price_override TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(package_id, service_id),
  CHECK (package_id != service_id)
);

-- 2.9 Blog Categories
CREATE TABLE IF NOT EXISTS panditji.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.10 Blog Posts
CREATE TABLE IF NOT EXISTS panditji.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES panditji.blog_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  canonical_url TEXT,
  reading_time_minutes INTEGER,
  view_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  hero_bg_type TEXT DEFAULT 'default' CHECK (hero_bg_type IN ('default', 'solid', 'gradient')),
  hero_bg_value TEXT,
  hero_title_color TEXT,
  hero_title_shadow TEXT,
  hero_meta_color TEXT,
  created_by UUID REFERENCES panditji.admin_users(id),
  updated_by UUID REFERENCES panditji.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.11 Blog Tags & Post Tags
CREATE TABLE IF NOT EXISTS panditji.blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS panditji.blog_post_tags (
  post_id UUID REFERENCES panditji.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES panditji.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 2.12 Media Files
CREATE TABLE IF NOT EXISTS panditji.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document', 'audio')),
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  alt_text TEXT,
  caption TEXT,
  description TEXT,
  folder TEXT DEFAULT 'general',
  tags TEXT[],
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  uploaded_by UUID REFERENCES panditji.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.13 Photo Galleries & Gallery Photos
CREATE TABLE IF NOT EXISTS panditji.photo_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES panditji.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS panditji.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID REFERENCES panditji.photo_galleries(id) ON DELETE CASCADE,
  media_file_id UUID REFERENCES panditji.media_files(id) ON DELETE CASCADE,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.14 Videos
CREATE TABLE IF NOT EXISTS panditji.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  duration INTEGER,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES panditji.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.15 Charity Projects
CREATE TABLE IF NOT EXISTS panditji.charity_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  category TEXT,
  start_date DATE,
  end_date DATE,
  is_ongoing BOOLEAN DEFAULT true,
  beneficiaries_count INTEGER,
  items_distributed INTEGER,
  funds_raised NUMERIC(10, 2),
  featured_image_url TEXT,
  video_url TEXT,
  gallery_images TEXT[],
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES panditji.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.16 Testimonials
CREATE TABLE IF NOT EXISTS panditji.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_location TEXT,
  client_image_url TEXT,
  service_name TEXT,
  service_id UUID REFERENCES panditji.services(id) ON DELETE SET NULL,
  testimonial_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'website',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES panditji.admin_users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.17 Books
CREATE TABLE IF NOT EXISTS panditji.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  author TEXT DEFAULT 'Rajesh Joshi',
  isbn TEXT UNIQUE,
  description TEXT NOT NULL,
  full_description TEXT,
  category TEXT NOT NULL,
  key_topics TEXT[],
  target_audience TEXT,
  chapter_list TEXT[],
  cover_image_url TEXT,
  preview_pdf_url TEXT,
  amazon_url TEXT,
  flipkart_url TEXT,
  other_purchase_urls JSONB,
  publication_date DATE,
  page_count INTEGER,
  language TEXT DEFAULT 'English',
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES panditji.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.18 Contact Inquiries
CREATE TABLE IF NOT EXISTS panditji.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_id UUID REFERENCES panditji.services(id) ON DELETE SET NULL,
  service_name TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  preferred_contact_method TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  location TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  response_text TEXT,
  responded_by UUID REFERENCES panditji.admin_users(id),
  responded_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.19 SEO Settings & Redirects
CREATE TABLE IF NOT EXISTS panditji.seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'Pandit Rajesh Joshi',
  site_tagline TEXT,
  default_meta_description TEXT,
  default_meta_keywords TEXT[],
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  linkedin_url TEXT,
  whatsapp_number TEXT,
  business_name TEXT,
  business_type TEXT DEFAULT 'ReligiousOrganization',
  address JSONB,
  phone TEXT,
  email TEXT,
  opening_hours TEXT,
  geo_coordinates JSONB,
  google_site_verification TEXT,
  bing_site_verification TEXT,
  facebook_domain_verification TEXT,
  google_analytics_id TEXT,
  google_tag_manager_id TEXT,
  facebook_pixel_id TEXT,
  robots_txt TEXT,
  custom_head_code TEXT,
  custom_body_code TEXT,
  singleton_guard BOOLEAN DEFAULT true NOT NULL UNIQUE CHECK (singleton_guard = true),
  updated_by UUID REFERENCES panditji.admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS panditji.seo_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL UNIQUE,
  destination_url TEXT NOT NULL,
  redirect_type INTEGER DEFAULT 301 CHECK (redirect_type IN (301, 302, 307, 308)),
  is_active BOOLEAN DEFAULT true,
  hit_count INTEGER DEFAULT 0,
  last_hit_at TIMESTAMPTZ,
  created_by UUID REFERENCES panditji.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.20 Analytics (Page Views, Service Views, Referrer Sources)
CREATE TABLE IF NOT EXISTS panditji.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
  browser TEXT,
  os TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS panditji.service_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES panditji.services(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS panditji.referrer_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  source_domain TEXT,
  visit_count INTEGER DEFAULT 1,
  last_visit TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.21 Cookie Consents
CREATE TABLE IF NOT EXISTS panditji.cookie_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_required BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS panditji.cookies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES panditji.cookie_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  purpose TEXT NOT NULL,
  expiration TEXT NOT NULL,
  cookie_type TEXT NOT NULL CHECK (cookie_type IN ('first-party', 'third-party')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS panditji.user_cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_id TEXT NOT NULL UNIQUE,
  necessary_cookies BOOLEAN DEFAULT true,
  analytics_cookies BOOLEAN DEFAULT false,
  marketing_cookies BOOLEAN DEFAULT false,
  preferences_cookies BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  consent_version TEXT,
  consented_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS panditji.cookie_policy_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES panditji.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.22 Site Settings (Singleton)
CREATE TABLE IF NOT EXISTS panditji.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'Pandit Rajesh Joshi',
  site_tagline TEXT,
  header_cta_text TEXT,
  header_cta_link TEXT,
  category TEXT,
  primary_email TEXT,
  secondary_email TEXT,
  primary_phone TEXT,
  secondary_phone TEXT,
  whatsapp_number TEXT,
  address TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Ireland',
  postal_code TEXT,
  business_hours JSONB,
  timezone TEXT DEFAULT 'Europe/Dublin',
  footer_contact_location TEXT,
  facebook_page_url TEXT,
  instagram_url TEXT,
  youtube_channel_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  pinterest_url TEXT,
  enable_contact_form BOOLEAN DEFAULT true,
  enable_testimonials BOOLEAN DEFAULT true,
  enable_blog BOOLEAN DEFAULT true,
  enable_gallery BOOLEAN DEFAULT true,
  enable_books BOOLEAN DEFAULT true,
  enable_charity BOOLEAN DEFAULT true,
  enable_booking BOOLEAN DEFAULT false,
  enable_newsletter BOOLEAN DEFAULT false,
  maintenance_mode BOOLEAN DEFAULT false,
  maintenance_message TEXT,
  maintenance_end_time TIMESTAMPTZ,
  site_logo_url TEXT,
  site_logo_dark_url TEXT,
  site_favicon_url TEXT,
  primary_color TEXT DEFAULT '#D97706',
  secondary_color TEXT DEFAULT '#7C2D12',
  accent_color TEXT DEFAULT '#F59E0B',
  footer_text TEXT,
  copyright_text TEXT,
  singleton_guard BOOLEAN DEFAULT true NOT NULL UNIQUE CHECK (singleton_guard = true),
  updated_by UUID REFERENCES panditji.admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.23 Site Metadata (Key-Value Store)
CREATE TABLE IF NOT EXISTS panditji.site_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  category TEXT DEFAULT 'general',
  updated_by UUID REFERENCES panditji.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.24 Navigation Menus & Items
CREATE TABLE IF NOT EXISTS panditji.menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS panditji.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID REFERENCES panditji.menus(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES panditji.menu_items(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  page_id UUID REFERENCES panditji.pages(id) ON DELETE SET NULL,
  icon TEXT,
  target TEXT DEFAULT '_self',
  css_class TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.25 Pandit Resource Center Sections
CREATE TABLE IF NOT EXISTS panditji.resource_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  video_links TEXT[] NOT NULL DEFAULT '{}',
  file_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_pages_slug ON panditji.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON panditji.pages(is_published);
CREATE INDEX IF NOT EXISTS idx_pages_sort_order ON panditji.pages(sort_order);

CREATE INDEX IF NOT EXISTS idx_page_sections_page_id ON panditji.page_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_page_sections_sort_order ON panditji.page_sections(page_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON panditji.service_categories(slug);
CREATE INDEX IF NOT EXISTS idx_service_categories_sort_order ON panditji.service_categories(sort_order);

CREATE INDEX IF NOT EXISTS idx_services_category_id ON panditji.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON panditji.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_featured ON panditji.services(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_services_popular ON panditji.services(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_services_published ON panditji.services(is_published);
CREATE INDEX IF NOT EXISTS idx_services_is_package ON panditji.services(is_package) WHERE is_package = true;

CREATE INDEX IF NOT EXISTS idx_package_items_package_id ON panditji.service_package_items(package_id);
CREATE INDEX IF NOT EXISTS idx_package_items_service_id ON panditji.service_package_items(service_id);
CREATE INDEX IF NOT EXISTS idx_package_items_sort_order ON panditji.service_package_items(package_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON panditji.blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON panditji.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON panditji.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON panditji.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON panditji.blog_posts(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_media_files_file_type ON panditji.media_files(file_type);
CREATE INDEX IF NOT EXISTS idx_media_files_folder ON panditji.media_files(folder);

CREATE INDEX IF NOT EXISTS idx_photo_galleries_slug ON panditji.photo_galleries(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_gallery_id ON panditji.gallery_photos(gallery_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_videos_slug ON panditji.videos(slug);
CREATE INDEX IF NOT EXISTS idx_videos_published ON panditji.videos(is_published);

CREATE INDEX IF NOT EXISTS idx_charity_projects_slug ON panditji.charity_projects(slug);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON panditji.testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON panditji.testimonials(is_approved);

CREATE INDEX IF NOT EXISTS idx_books_slug ON panditji.books(slug);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON panditji.contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON panditji.contact_inquiries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON panditji.page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON panditji.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON panditji.page_views(session_id);

CREATE INDEX IF NOT EXISTS idx_site_metadata_key ON panditji.site_metadata(setting_key);
CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id ON panditji.menu_items(menu_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_resource_sections_slug ON panditji.resource_sections(slug);
CREATE INDEX IF NOT EXISTS idx_resource_sections_status ON panditji.resource_sections(status);
CREATE INDEX IF NOT EXISTS idx_resource_sections_order ON panditji.resource_sections(sort_order);

-- ============================================================================
-- 4. TRIGGERS (Auto-update updated_at)
-- ============================================================================

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'panditji'
      AND tablename IN (
        'admin_users', 'pages', 'page_sections', 'service_categories',
        'services', 'service_package_items', 'blog_categories', 'blog_posts',
        'media_files', 'photo_galleries', 'videos', 'charity_projects',
        'testimonials', 'books', 'contact_inquiries', 'seo_settings',
        'seo_redirects', 'cookie_categories', 'cookies', 'site_settings',
        'site_metadata', 'menus', 'menu_items', 'resource_sections'
      )
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON panditji.%I;', tbl, tbl);
    EXECUTE format('CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON panditji.%I FOR EACH ROW EXECUTE FUNCTION panditji.update_updated_at_column();', tbl, tbl);
  END LOOP;
END;
$$;

-- Trigger to automatically maintain is_package flag on services
CREATE OR REPLACE FUNCTION panditji.set_is_package_flag()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = panditji, pg_temp
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM panditji.service_categories
    WHERE id = NEW.category_id AND slug = 'packages'
  ) THEN
    NEW.is_package = true;
  ELSE
    NEW.is_package = COALESCE(NEW.is_package, false);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_services_set_is_package ON panditji.services;
CREATE TRIGGER trg_services_set_is_package
  BEFORE INSERT OR UPDATE OF category_id ON panditji.services
  FOR EACH ROW EXECUTE FUNCTION panditji.set_is_package_flag();

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Step 5.1: Enable RLS on every table in panditji schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'panditji'
  LOOP
    EXECUTE format('ALTER TABLE panditji.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
  END LOOP;
END;
$$;

-- Step 5.2: Revoke default table access and re-grant clean permissions
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA panditji FROM public, anon, authenticated;
GRANT USAGE ON SCHEMA panditji TO anon, authenticated, service_role, postgres;
GRANT SELECT ON ALL TABLES IN SCHEMA panditji TO anon, authenticated;
GRANT INSERT ON panditji.contact_inquiries, panditji.page_views, panditji.service_views, panditji.referrer_sources, panditji.user_cookie_consents, panditji.testimonials TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA panditji TO authenticated, service_role, postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA panditji TO authenticated, service_role, postgres;

-- Step 5.3: Drop old policies if any
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'panditji'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I;', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END;
$$;

-- ----------------------------------------------------------------------------
-- LAYER 1 & LAYER 3 POLICIES: PUBLIC CONTENT TABLES
-- Public (anon) reads published only; Admin (Layer 3 air-gapped) full CRUD
-- ----------------------------------------------------------------------------

-- Services
CREATE POLICY services_public_read ON panditji.services
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY services_admin_all ON panditji.services
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Service Categories
CREATE POLICY service_categories_public_read ON panditji.service_categories
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY service_categories_admin_all ON panditji.service_categories
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Service Package Items
CREATE POLICY service_package_items_public_read ON panditji.service_package_items
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM panditji.services
      WHERE services.id = service_package_items.package_id
        AND services.is_published = true
    )
  );

CREATE POLICY service_package_items_admin_all ON panditji.service_package_items
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Blog Posts
CREATE POLICY blog_posts_public_read ON panditji.blog_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY blog_posts_admin_all ON panditji.blog_posts
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Blog Categories & Tags
CREATE POLICY blog_categories_public_read ON panditji.blog_categories
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY blog_categories_admin_all ON panditji.blog_categories
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY blog_tags_public_read ON panditji.blog_tags
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY blog_tags_admin_all ON panditji.blog_tags
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY blog_post_tags_public_read ON panditji.blog_post_tags
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY blog_post_tags_admin_all ON panditji.blog_post_tags
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Books
CREATE POLICY books_public_read ON panditji.books
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY books_admin_all ON panditji.books
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Videos
CREATE POLICY videos_public_read ON panditji.videos
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY videos_admin_all ON panditji.videos
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Media Files & Galleries
CREATE POLICY media_files_public_read ON panditji.media_files
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY media_files_admin_all ON panditji.media_files
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY photo_galleries_public_read ON panditji.photo_galleries
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY photo_galleries_admin_all ON panditji.photo_galleries
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY gallery_photos_public_read ON panditji.gallery_photos
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY gallery_photos_admin_all ON panditji.gallery_photos
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Charity Projects
CREATE POLICY charity_projects_public_read ON panditji.charity_projects
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY charity_projects_admin_all ON panditji.charity_projects
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Pages & Sections
CREATE POLICY pages_public_read ON panditji.pages
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY pages_admin_all ON panditji.pages
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY page_sections_public_read ON panditji.page_sections
  FOR SELECT TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY page_sections_admin_all ON panditji.page_sections
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Site Settings & Metadata
CREATE POLICY site_settings_public_read ON panditji.site_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY site_settings_admin_all ON panditji.site_settings
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY site_metadata_public_read ON panditji.site_metadata
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY site_metadata_admin_all ON panditji.site_metadata
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Menus & Menu Items
CREATE POLICY menus_public_read ON panditji.menus
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY menus_admin_all ON panditji.menus
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY menu_items_public_read ON panditji.menu_items
  FOR SELECT TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY menu_items_admin_all ON panditji.menu_items
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Resource Sections
CREATE POLICY resource_sections_public_read ON panditji.resource_sections
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY resource_sections_admin_all ON panditji.resource_sections
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- ----------------------------------------------------------------------------
-- LAYER 1 & LAYER 3 POLICIES: PUBLIC ACTION TABLES
-- ----------------------------------------------------------------------------

-- Contact Inquiries: Visitors can submit (anon insert); Admin reads/manages
CREATE POLICY contact_inquiries_anon_insert ON panditji.contact_inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY contact_inquiries_admin_all ON panditji.contact_inquiries
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Testimonials: Public can read approved/published, can submit new (pending approval)
CREATE POLICY testimonials_public_read ON panditji.testimonials
  FOR SELECT TO anon, authenticated
  USING (is_published = true AND is_approved = true);

CREATE POLICY testimonials_anon_insert ON panditji.testimonials
  FOR INSERT TO anon, authenticated
  WITH CHECK (is_approved = false AND is_published = false);

CREATE POLICY testimonials_admin_all ON panditji.testimonials
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Analytics (Page Views, Service Views, Referrer Sources)
CREATE POLICY page_views_anon_insert ON panditji.page_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY page_views_admin_select ON panditji.page_views
  FOR SELECT TO authenticated
  USING (panditji.is_admin());

CREATE POLICY service_views_anon_insert ON panditji.service_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY service_views_admin_select ON panditji.service_views
  FOR SELECT TO authenticated
  USING (panditji.is_admin());

CREATE POLICY referrer_sources_anon_insert ON panditji.referrer_sources
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY referrer_sources_admin_all ON panditji.referrer_sources
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- Cookie Consents & Policies
CREATE POLICY cookie_categories_public_read ON panditji.cookie_categories
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY cookie_categories_admin_all ON panditji.cookie_categories
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY cookies_public_read ON panditji.cookies
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY cookies_admin_all ON panditji.cookies
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY user_cookie_consents_anon_insert ON panditji.user_cookie_consents
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY user_cookie_consents_admin_all ON panditji.user_cookie_consents
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY cookie_policy_versions_public_read ON panditji.cookie_policy_versions
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY cookie_policy_versions_admin_all ON panditji.cookie_policy_versions
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- SEO Settings & Redirects
CREATE POLICY seo_settings_public_read ON panditji.seo_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY seo_settings_admin_all ON panditji.seo_settings
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY seo_redirects_public_read ON panditji.seo_redirects
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY seo_redirects_admin_all ON panditji.seo_redirects
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- ----------------------------------------------------------------------------
-- LAYER 3 POLICIES: INTERNAL ADMINISTRATIVE TABLES
-- Strictly air-gapped: Only panditji.is_admin() can access
-- ----------------------------------------------------------------------------

CREATE POLICY admin_users_admin_all ON panditji.admin_users
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY admin_sessions_admin_all ON panditji.admin_sessions
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

CREATE POLICY activity_logs_admin_all ON panditji.activity_logs
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

-- ============================================================================
-- 6. STORAGE BUCKETS (PREFIXED WITH PROJECT NAME) & STORAGE RLS AIR-GAP
-- ============================================================================

-- Create project-prefixed buckets in shared storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'panditji-media',
    'panditji-media',
    true,
    10485760, -- 10 MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  ),
  (
    'panditji-documents',
    'panditji-documents',
    true,
    52428800, -- 50 MB
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-zip-compressed'
    ]
  ),
  (
    'panditji-videos',
    'panditji-videos',
    true,
    104857600, -- 100 MB
    ARRAY['video/mp4', 'video/webm', 'video/ogg']
  ),
  (
    'panditji-resources',
    'panditji-resources',
    true,
    31457280, -- 30 MB
    ARRAY[
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip'
    ]
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies: Layer 1 Public Read, Layer 3 Project-Gated Write
DO $$
BEGIN
  -- 1. Public Read Policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'panditji_storage_public_read'
  ) THEN
    CREATE POLICY panditji_storage_public_read ON storage.objects
      FOR SELECT
      USING (bucket_id IN ('panditji-media', 'panditji-documents', 'panditji-videos', 'panditji-resources'));
  END IF;

  -- 2. Admin Insert Policy (Air-Gapped: requires panditji.is_admin())
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'panditji_storage_admin_insert'
  ) THEN
    CREATE POLICY panditji_storage_admin_insert ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (
        bucket_id IN ('panditji-media', 'panditji-documents', 'panditji-videos', 'panditji-resources')
        AND panditji.is_admin()
      );
  END IF;

  -- 3. Admin Update Policy (Air-Gapped: requires panditji.is_admin())
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'panditji_storage_admin_update'
  ) THEN
    CREATE POLICY panditji_storage_admin_update ON storage.objects
      FOR UPDATE TO authenticated
      USING (
        bucket_id IN ('panditji-media', 'panditji-documents', 'panditji-videos', 'panditji-resources')
        AND panditji.is_admin()
      )
      WITH CHECK (
        bucket_id IN ('panditji-media', 'panditji-documents', 'panditji-videos', 'panditji-resources')
        AND panditji.is_admin()
      );
  END IF;

  -- 4. Admin Delete Policy (Air-Gapped: requires panditji.is_admin())
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'panditji_storage_admin_delete'
  ) THEN
    CREATE POLICY panditji_storage_admin_delete ON storage.objects
      FOR DELETE TO authenticated
      USING (
        bucket_id IN ('panditji-media', 'panditji-documents', 'panditji-videos', 'panditji-resources')
        AND panditji.is_admin()
      );
  END IF;
END;
$$;
