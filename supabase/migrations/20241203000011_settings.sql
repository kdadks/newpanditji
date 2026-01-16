-- ============================================================================
-- MIGRATION 11: Site Settings & Navigation
-- ============================================================================

-- Site Settings (Singleton Table)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  facebook_page_url TEXT,
  instagram_url TEXT,
  youtube_channel_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
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
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Menus Table
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  icon TEXT,
  target TEXT DEFAULT '_self',
  css_class TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id ON menu_items(menu_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_id ON menu_items(parent_id);
