-- ============================================================================
-- MIGRATION 6: Charity, Testimonials, Books
-- ============================================================================

-- Charity Projects Table
CREATE TABLE IF NOT EXISTS charity_projects (
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
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_charity_projects_slug ON charity_projects(slug);
CREATE INDEX IF NOT EXISTS idx_charity_projects_featured ON charity_projects(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_charity_projects_published ON charity_projects(is_published);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_location TEXT,
  client_image_url TEXT,
  service_name TEXT,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  testimonial_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'website',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES admin_users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_service_id ON testimonials(service_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
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
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_books_slug ON books(slug);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_featured ON books(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_books_published ON books(is_published);
