-- ============================================================================
-- MIGRATION 8: SEO Management
-- ============================================================================

-- SEO Settings (Singleton Table)
CREATE TABLE IF NOT EXISTS seo_settings (
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
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO Redirects Table
CREATE TABLE IF NOT EXISTS seo_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL UNIQUE,
  destination_url TEXT NOT NULL,
  redirect_type INTEGER DEFAULT 301 CHECK (redirect_type IN (301, 302, 307, 308)),
  is_active BOOLEAN DEFAULT true,
  hit_count INTEGER DEFAULT 0,
  last_hit_at TIMESTAMPTZ,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_redirects_source_url ON seo_redirects(source_url) WHERE is_active = true;
