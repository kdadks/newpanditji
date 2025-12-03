-- ============================================================================
-- MIGRATION 3: Services Management
-- ============================================================================

-- Service Categories Table
CREATE TABLE IF NOT EXISTS service_categories (
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

CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON service_categories(slug);
CREATE INDEX IF NOT EXISTS idx_service_categories_sort_order ON service_categories(sort_order);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES service_categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  duration TEXT,
  price TEXT,
  benefits TEXT[],
  includes TEXT[],
  requirements TEXT[],
  best_for TEXT[],
  deity_info JSONB,
  nature TEXT,
  purpose TEXT[],
  significance TEXT[],
  scriptural_roots JSONB,
  when_to_perform TEXT[],
  where_and_who TEXT,
  special_notes TEXT[],
  core_aspects JSONB,
  samagri_items JSONB,
  samagri_file_url TEXT,
  featured_image_url TEXT,
  gallery_images TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES admin_users(id),
  updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_services_popular ON services(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_services_published ON services(is_published);
CREATE INDEX IF NOT EXISTS idx_services_view_count ON services(view_count DESC);
