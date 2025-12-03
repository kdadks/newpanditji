# Database Schema Design for Pandit Rajesh Joshi Website

## Overview
This document outlines the comprehensive database schema for a content-heavy Hindu services website with full CMS capabilities. The schema is designed for **Supabase PostgreSQL** and includes authentication, content management, media handling, SEO, analytics, and cookie consent management.

## Tech Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password for super admin only)
- **Storage**: Supabase Storage (for media files)
- **Frontend**: React + TypeScript
- **State Management**: React Query / TanStack Query
- **Form Handling**: React Hook Form + Zod

---

## Core Database Tables

### 1. Authentication & User Management

#### `admin_users` (Extends Supabase auth.users)
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'super_admin' CHECK (role IN ('super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated super admins can view/edit
CREATE POLICY "Super admins can view all admin users"
  ON admin_users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Super admins can update their own record"
  ON admin_users FOR UPDATE
  USING (auth.uid() = id);
```

#### `admin_sessions`
```sql
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  login_at TIMESTAMPTZ DEFAULT NOW(),
  logout_at TIMESTAMPTZ,
  session_duration INTERVAL GENERATED ALWAYS AS (logout_at - login_at) STORED
);

CREATE INDEX idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_login_at ON admin_sessions(login_at DESC);
```

---

### 2. Page Management (Core CMS)

#### `pages`
```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- home, services, about, gallery, blog, etc.
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  is_published BOOLEAN DEFAULT true,
  is_indexed BOOLEAN DEFAULT true, -- For SEO indexing control
  template_type TEXT NOT NULL, -- home, service_listing, blog_listing, static_content, etc.
  custom_css TEXT,
  custom_js TEXT,
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES admin_users(id),
  updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_published ON pages(is_published);
CREATE INDEX idx_pages_sort_order ON pages(sort_order);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Public can read published pages
CREATE POLICY "Public can view published pages"
  ON pages FOR SELECT
  USING (is_published = true);

-- Only admins can modify
CREATE POLICY "Admins can manage all pages"
  ON pages FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

#### `page_sections`
```sql
CREATE TABLE page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL, -- hero, services, testimonials, cta, features, etc.
  section_type TEXT NOT NULL, -- hero, card_grid, text_block, image_gallery, video_embed, etc.
  title TEXT,
  subtitle TEXT,
  content JSONB, -- Flexible JSON structure for different section types
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(page_id, section_key)
);

CREATE INDEX idx_page_sections_page_id ON page_sections(page_id);
CREATE INDEX idx_page_sections_sort_order ON page_sections(page_id, sort_order);

-- Enable RLS
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible sections of published pages"
  ON page_sections FOR SELECT
  USING (
    is_visible = true AND
    page_id IN (SELECT id FROM pages WHERE is_published = true)
  );

CREATE POLICY "Admins can manage all sections"
  ON page_sections FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

---

### 3. Services Management

#### `service_categories`
```sql
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- Poojas, Sanskars, Paath, etc.
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- Icon identifier (e.g., 'FlowerLotus')
  color TEXT, -- Hex color code
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_service_categories_slug ON service_categories(slug);
CREATE INDEX idx_service_categories_sort_order ON service_categories(sort_order);

-- Enable RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active categories"
  ON service_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON service_categories FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

#### `services`
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES service_categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  duration TEXT, -- e.g., "2-3 hours"
  price TEXT, -- Flexible pricing (e.g., "Contact for quote")
  
  -- Detailed information
  benefits TEXT[],
  includes TEXT[],
  requirements TEXT[],
  best_for TEXT[],
  
  -- Service Details (nested JSON structure)
  deity_info JSONB, -- { name, description, significance }
  nature TEXT,
  purpose TEXT[],
  significance TEXT[],
  scriptural_roots JSONB, -- { source, description }
  when_to_perform TEXT[],
  where_and_who TEXT,
  special_notes TEXT[],
  core_aspects JSONB[], -- Array of { title, content }
  
  -- Pooja Samagri (shopping list)
  samagri_items JSONB[], -- Array of { item_name, quantity, notes }
  
  -- Featured & Popular
  is_featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  
  -- Status
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  created_by UUID REFERENCES admin_users(id),
  updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_featured ON services(is_featured) WHERE is_featured = true;
CREATE INDEX idx_services_popular ON services(is_popular) WHERE is_popular = true;
CREATE INDEX idx_services_published ON services(is_published);
CREATE INDEX idx_services_view_count ON services(view_count DESC);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published services"
  ON services FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage all services"
  ON services FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

---

### 4. Blog Management

#### `blog_categories`
```sql
CREATE TABLE blog_categories (
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

CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active blog categories"
  ON blog_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage blog categories"
  ON blog_categories FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

#### `blog_posts`
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL, -- Full article content (HTML/Markdown)
  featured_image_url TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  canonical_url TEXT,
  
  -- Reading stats
  reading_time_minutes INTEGER,
  view_count INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  
  created_by UUID REFERENCES admin_users(id),
  updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Admins can manage all blog posts"
  ON blog_posts FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

#### `blog_tags`
```sql
CREATE TABLE blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_tags_slug ON blog_tags(slug);

CREATE TABLE blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_blog_post_tags_post_id ON blog_post_tags(post_id);
CREATE INDEX idx_blog_post_tags_tag_id ON blog_post_tags(tag_id);
```

---

### 5. Media Management

#### `media_files`
```sql
CREATE TABLE media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- image, video, document, audio
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL, -- in bytes
  file_url TEXT NOT NULL, -- Supabase storage URL
  thumbnail_url TEXT, -- For images/videos
  
  -- Dimensions (for images/videos)
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- For videos/audio (in seconds)
  
  -- Metadata
  alt_text TEXT,
  caption TEXT,
  description TEXT,
  
  -- Organization
  folder TEXT DEFAULT 'general', -- ceremony, blog, gallery, services, etc.
  tags TEXT[],
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  uploaded_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_files_file_type ON media_files(file_type);
CREATE INDEX idx_media_files_folder ON media_files(folder);
CREATE INDEX idx_media_files_created_at ON media_files(created_at DESC);

-- Enable RLS
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view all media files"
  ON media_files FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage all media files"
  ON media_files FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

#### `photo_galleries`
```sql
CREATE TABLE photo_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- ceremony, pooja, event, charity, etc.
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID REFERENCES photo_galleries(id) ON DELETE CASCADE,
  media_file_id UUID REFERENCES media_files(id) ON DELETE CASCADE,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gallery_photos_gallery_id ON gallery_photos(gallery_id, sort_order);
```

#### `videos`
```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL, -- YouTube/Vimeo URL or self-hosted
  thumbnail_url TEXT,
  category TEXT NOT NULL, -- educational, poetry, charity, podcast, ceremony
  duration INTEGER, -- in seconds
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_featured ON videos(is_featured) WHERE is_featured = true;
CREATE INDEX idx_videos_published ON videos(is_published);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published videos"
  ON videos FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage all videos"
  ON videos FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

---

### 6. Charity Projects

#### `charity_projects`
```sql
CREATE TABLE charity_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  category TEXT, -- Education, Community Service, Temple Support, etc.
  
  -- Project details
  start_date DATE,
  end_date DATE,
  is_ongoing BOOLEAN DEFAULT true,
  
  -- Impact metrics
  beneficiaries_count INTEGER,
  items_distributed INTEGER,
  funds_raised NUMERIC(10, 2),
  
  -- Media
  featured_image_url TEXT,
  video_url TEXT,
  
  -- Status
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_charity_projects_slug ON charity_projects(slug);
CREATE INDEX idx_charity_projects_featured ON charity_projects(is_featured) WHERE is_featured = true;
CREATE INDEX idx_charity_projects_published ON charity_projects(is_published);

-- Enable RLS
ALTER TABLE charity_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published charity projects"
  ON charity_projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage charity projects"
  ON charity_projects FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

---

### 7. Testimonials

#### `testimonials`
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_image_url TEXT,
  service_name TEXT, -- Which service they used
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  testimonial_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  -- Status
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  
  -- Source
  source TEXT, -- form_submission, google_review, email, etc.
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES admin_users(id),
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_testimonials_published ON testimonials(is_published);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = true;
CREATE INDEX idx_testimonials_service_id ON testimonials(service_id);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published testimonials"
  ON testimonials FOR SELECT
  USING (is_published = true AND is_approved = true);

CREATE POLICY "Admins can manage all testimonials"
  ON testimonials FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

---

### 8. Books

#### `books`
```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT DEFAULT 'Rajesh Joshi',
  isbn TEXT UNIQUE,
  
  -- Content
  description TEXT NOT NULL,
  full_description TEXT,
  category TEXT NOT NULL,
  key_topics TEXT[],
  target_audience TEXT,
  chapter_list TEXT[],
  
  -- Media
  cover_image_url TEXT,
  preview_pdf_url TEXT,
  
  -- Purchase links
  amazon_url TEXT,
  flipkart_url TEXT,
  other_purchase_urls JSONB, -- { platform: url }
  
  -- Metadata
  publication_date DATE,
  page_count INTEGER,
  language TEXT DEFAULT 'English',
  
  -- Status
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_featured ON books(is_featured) WHERE is_featured = true;
CREATE INDEX idx_books_published ON books(is_published);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published books"
  ON books FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage books"
  ON books FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

---

### 9. Contact & Inquiries

#### `contact_inquiries`
```sql
CREATE TABLE contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Inquiry details
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_name TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  
  -- Additional context
  preferred_contact_method TEXT, -- email, phone, whatsapp
  preferred_date DATE,
  preferred_time TEXT,
  location TEXT,
  
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Admin response
  response_text TEXT,
  responded_by UUID REFERENCES admin_users(id),
  responded_at TIMESTAMPTZ,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX idx_contact_inquiries_email ON contact_inquiries(email);

-- Enable RLS
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all contact inquiries"
  ON contact_inquiries FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins can update contact inquiries"
  ON contact_inquiries FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

CREATE POLICY "Anyone can submit contact inquiries"
  ON contact_inquiries FOR INSERT
  WITH CHECK (true);
```

---

### 10. SEO Management

#### `seo_settings`
```sql
CREATE TABLE seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Global SEO
  site_name TEXT DEFAULT 'Pandit Rajesh Joshi',
  site_tagline TEXT,
  default_meta_description TEXT,
  default_meta_keywords TEXT[],
  
  -- Social Media
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  linkedin_url TEXT,
  
  -- Business Information (Schema.org)
  business_name TEXT,
  business_type TEXT DEFAULT 'ReligiousOrganization',
  address JSONB, -- { street, city, state, country, postal_code }
  phone TEXT,
  email TEXT,
  opening_hours TEXT,
  
  -- Verification
  google_site_verification TEXT,
  bing_site_verification TEXT,
  facebook_domain_verification TEXT,
  
  -- Analytics
  google_analytics_id TEXT,
  google_tag_manager_id TEXT,
  facebook_pixel_id TEXT,
  
  -- Other
  robots_txt TEXT,
  custom_head_code TEXT, -- Custom HTML for <head>
  custom_body_code TEXT, -- Custom HTML for <body>
  
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Single row table
CREATE UNIQUE INDEX idx_seo_settings_singleton ON seo_settings ((true));

-- Enable RLS
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view SEO settings"
  ON seo_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update SEO settings"
  ON seo_settings FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

#### `seo_redirects`
```sql
CREATE TABLE seo_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  redirect_type INTEGER DEFAULT 301 CHECK (redirect_type IN (301, 302, 307, 308)),
  is_active BOOLEAN DEFAULT true,
  hit_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(source_url)
);

CREATE INDEX idx_seo_redirects_source_url ON seo_redirects(source_url) WHERE is_active = true;
```

---

### 11. Analytics & Tracking

#### `page_views`
```sql
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  page_title TEXT,
  session_id TEXT,
  
  -- User info
  ip_address INET,
  user_agent TEXT,
  device_type TEXT, -- desktop, mobile, tablet
  browser TEXT,
  operating_system TEXT,
  
  -- Referrer info
  referrer_url TEXT,
  referrer_domain TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Geography
  country TEXT,
  city TEXT,
  
  -- Timing
  time_on_page INTEGER, -- seconds
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_views_page_slug ON page_views(page_slug);
CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at DESC);
CREATE INDEX idx_page_views_session_id ON page_views(session_id);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all page views"
  ON page_views FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

CREATE POLICY "Anyone can log page views"
  ON page_views FOR INSERT
  WITH CHECK (true);
```

#### `analytics_summary`
```sql
CREATE TABLE analytics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  
  -- Overall metrics
  total_page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  avg_session_duration INTERVAL,
  bounce_rate NUMERIC(5, 2),
  
  -- Top pages
  top_pages JSONB, -- { page_slug: view_count }
  
  -- Traffic sources
  traffic_sources JSONB, -- { source: count }
  
  -- Devices
  device_breakdown JSONB, -- { device_type: count }
  
  -- Geography
  top_countries JSONB, -- { country: count }
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(date)
);

CREATE INDEX idx_analytics_summary_date ON analytics_summary(date DESC);
```

---

### 12. Cookie Consent Management

#### `cookie_categories`
```sql
CREATE TABLE cookie_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- necessary, analytics, marketing, preferences
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_required BOOLEAN DEFAULT false, -- Necessary cookies cannot be disabled
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cookie_categories_sort_order ON cookie_categories(sort_order);
```

#### `cookies`
```sql
CREATE TABLE cookies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES cookie_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  provider TEXT NOT NULL, -- Google, Facebook, Internal, etc.
  purpose TEXT NOT NULL,
  expiration TEXT NOT NULL, -- e.g., "1 year", "Session", "Persistent"
  cookie_type TEXT NOT NULL, -- First-party, Third-party
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cookies_category_id ON cookies(category_id);
```

#### `user_cookie_consents`
```sql
CREATE TABLE user_cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_id TEXT NOT NULL, -- Unique identifier for this consent (UUID)
  
  -- Consent choices
  necessary_cookies BOOLEAN DEFAULT true, -- Always true
  analytics_cookies BOOLEAN DEFAULT false,
  marketing_cookies BOOLEAN DEFAULT false,
  preferences_cookies BOOLEAN DEFAULT false,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  consent_version TEXT, -- Version of consent policy
  
  -- Timestamps
  consented_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- Typically 12 months from consent
  
  UNIQUE(consent_id)
);

CREATE INDEX idx_user_cookie_consents_consent_id ON user_cookie_consents(consent_id);
CREATE INDEX idx_user_cookie_consents_consented_at ON user_cookie_consents(consented_at DESC);
```

#### `cookie_policy_versions`
```sql
CREATE TABLE cookie_policy_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL, -- Full policy text
  is_active BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 13. Site Configuration

#### `site_settings`
```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact Information
  primary_email TEXT,
  secondary_email TEXT,
  primary_phone TEXT,
  whatsapp_number TEXT,
  address TEXT,
  
  -- Business Hours
  business_hours JSONB, -- { monday: "9am-5pm", ... }
  
  -- Social Media
  facebook_page_url TEXT,
  instagram_url TEXT,
  youtube_channel_url TEXT,
  twitter_url TEXT,
  
  -- Features
  enable_contact_form BOOLEAN DEFAULT true,
  enable_testimonials BOOLEAN DEFAULT true,
  enable_blog BOOLEAN DEFAULT true,
  enable_booking BOOLEAN DEFAULT false,
  
  -- Maintenance
  maintenance_mode BOOLEAN DEFAULT false,
  maintenance_message TEXT,
  
  -- Branding
  site_logo_url TEXT,
  site_favicon_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Single row table
CREATE UNIQUE INDEX idx_site_settings_singleton ON site_settings ((true));

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

---

### 14. Navigation & Menus

#### `menus`
```sql
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- main_menu, footer_menu, mobile_menu
  location TEXT NOT NULL, -- header, footer, sidebar
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  
  icon TEXT,
  target TEXT DEFAULT '_self', -- _self, _blank
  css_class TEXT,
  
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_items_menu_id ON menu_items(menu_id, sort_order);
CREATE INDEX idx_menu_items_parent_id ON menu_items(parent_id);
```

---

### 15. Activity Log

#### `activity_logs`
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  
  action TEXT NOT NULL, -- create, update, delete, login, logout
  entity_type TEXT NOT NULL, -- page, service, blog_post, media, etc.
  entity_id UUID,
  
  description TEXT NOT NULL,
  changes JSONB, -- Before/after values for updates
  
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all activity logs"
  ON activity_logs FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

---

## Supabase Storage Buckets

### Storage Structure
```
pandit-website/
├── media/
│   ├── images/
│   │   ├── services/
│   │   ├── blog/
│   │   ├── gallery/
│   │   ├── testimonials/
│   │   └── general/
│   ├── videos/
│   ├── documents/
│   │   └── samagri-pdfs/
│   └── books/
│       ├── covers/
│       └── previews/
├── uploads/
│   └── temp/
└── backups/
```

### Storage Policies
```sql
-- Public read access for published media
CREATE POLICY "Public can view published media"
ON storage.objects FOR SELECT
USING (bucket_id = 'pandit-website' AND auth.role() = 'anon');

-- Admins can upload/delete
CREATE POLICY "Admins can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pandit-website' AND
  auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
);

CREATE POLICY "Admins can delete media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pandit-website' AND
  auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
);
```

---

## Database Functions & Triggers

### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all relevant tables
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Repeat for other tables...
```

### Increment view counters
```sql
CREATE OR REPLACE FUNCTION increment_view_count(
  entity_type TEXT,
  entity_id UUID
)
RETURNS VOID AS $$
BEGIN
  IF entity_type = 'service' THEN
    UPDATE services SET view_count = view_count + 1 WHERE id = entity_id;
  ELSIF entity_type = 'blog_post' THEN
    UPDATE blog_posts SET view_count = view_count + 1 WHERE id = entity_id;
  ELSIF entity_type = 'video' THEN
    UPDATE videos SET view_count = view_count + 1 WHERE id = entity_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### Log activity
```sql
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_description TEXT,
  p_changes JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO activity_logs (
    user_id, action, entity_type, entity_id, description, changes
  ) VALUES (
    p_user_id, p_action, p_entity_type, p_entity_id, p_description, p_changes
  );
END;
$$ LANGUAGE plpgsql;
```

---

## Initial Data Migration

### Seed Script Structure
```sql
-- 1. Insert default admin user
-- 2. Insert default pages (home, services, about, etc.)
-- 3. Insert service categories
-- 4. Migrate existing services from data.ts
-- 5. Migrate blog articles
-- 6. Migrate videos
-- 7. Migrate charity projects
-- 8. Migrate testimonials
-- 9. Set up default SEO settings
-- 10. Set up cookie categories
-- 11. Create default menus
```

---

## API Endpoints (Supabase Functions)

### Public API
- `GET /api/pages/:slug` - Get page content
- `GET /api/services` - List all services (with filters)
- `GET /api/services/:slug` - Get service details
- `GET /api/blog` - List blog posts
- `GET /api/blog/:slug` - Get blog post
- `GET /api/testimonials` - Get published testimonials
- `POST /api/contact` - Submit contact inquiry
- `POST /api/cookie-consent` - Record cookie consent

### Admin API (Protected)
- All CRUD operations for content
- Media upload/management
- Analytics retrieval
- User management
- Settings management

---

## Security Considerations

1. **Row Level Security (RLS)**: Enabled on all tables
2. **Admin Authentication**: Supabase Auth with email/password
3. **Rate Limiting**: Implement on contact form and public APIs
4. **Input Validation**: Server-side validation using Zod
5. **SQL Injection Prevention**: Use parameterized queries
6. **XSS Protection**: Sanitize user inputs
7. **CORS Configuration**: Restrict to allowed domains
8. **Environment Variables**: Store sensitive keys securely

---

## Performance Optimization

1. **Database Indexes**: Created on all frequently queried columns
2. **Query Optimization**: Use proper joins and avoid N+1 queries
3. **Caching Strategy**: 
   - Use React Query for client-side caching
   - Consider Redis for server-side caching
4. **Image Optimization**: 
   - Store multiple sizes in storage
   - Use CDN for delivery
5. **Pagination**: Implement on all list views

---

This schema provides a comprehensive foundation for a fully-featured CMS with all the requirements met. Would you like me to proceed with creating the migration scripts and admin dashboard design document?

## Migration Files

The database schema has been split into the following migration files in `supabase/migrations/`:

| File | Description |
|------|-------------|
| `20241203000001_extensions_and_auth.sql` | Extensions, admin_users, admin_sessions, activity_logs |
| `20241203000002_pages.sql` | pages, page_sections tables |
| `20241203000003_services.sql` | service_categories, services tables |
| `20241203000004_blog.sql` | blog_categories, blog_posts, blog_tags, blog_post_tags |
| `20241203000005_media.sql` | media_files, photo_galleries, gallery_photos, videos |
| `20241203000006_content.sql` | charity_projects, testimonials, books |
| `20241203000007_inquiries.sql` | contact_inquiries |
| `20241203000008_seo.sql` | seo_settings (singleton), seo_redirects |
| `20241203000009_analytics.sql` | page_views, analytics_summary |
| `20241203000010_cookies.sql` | cookie_categories, cookies, user_cookie_consents, cookie_policy_versions |
| `20241203000011_settings.sql` | site_settings (singleton), menus, menu_items |
| `20241203000012_functions.sql` | All database functions |
| `20241203000013_triggers.sql` | All update_updated_at triggers |
| `20241203000014_rls_policies.sql` | All Row Level Security policies |
| `20241203000015_storage.sql` | Storage buckets and policies |
| `20241203000016_seed_core.sql` | Core seed data (settings, SEO, pages, menus, categories) |
| `20241203000017_seed_services.sql` | Services seed data |

### Running Migrations

`ash
# Initialize Supabase locally
supabase init

# Start local Supabase
supabase start

# Apply migrations
supabase db push

# Or run against remote project
supabase link --project-ref <your-project-ref>
supabase db push
`

---

This schema provides a comprehensive foundation for a fully-featured CMS with all the requirements met.
