-- ============================================================================
-- Fix Analytics RLS Policies & Create Missing Tables
-- ============================================================================

-- Page Views Table (ensure it exists with correct schema)
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  page_title TEXT,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  operating_system TEXT,
  referrer_url TEXT,
  referrer_domain TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  country TEXT,
  country_code TEXT,
  region TEXT,
  city TEXT,
  time_on_page INTEGER,
  scroll_depth INTEGER,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_page_slug ON page_views(page_slug);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_country ON page_views(country);

-- Service Views Table (create if not exists)
CREATE TABLE IF NOT EXISTS service_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_service_views_service_id ON service_views(service_id);
CREATE INDEX IF NOT EXISTS idx_service_views_created_at ON service_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_views_country ON service_views(country);
CREATE INDEX IF NOT EXISTS idx_service_views_session_id ON service_views(session_id);

-- Referrer Sources Table (create if not exists)
CREATE TABLE IF NOT EXISTS referrer_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  source_domain TEXT,
  visit_count INTEGER DEFAULT 1,
  last_visit TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrer_sources_domain ON referrer_sources(source_domain);
CREATE INDEX IF NOT EXISTS idx_referrer_sources_visit_count ON referrer_sources(visit_count DESC);

-- Add unique constraint to referrer_sources
ALTER TABLE referrer_sources DROP CONSTRAINT IF EXISTS unique_source_url;
ALTER TABLE referrer_sources ADD CONSTRAINT unique_source_url UNIQUE (source_url);

-- Enable RLS on all analytics tables
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrer_sources ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS page_views_public_insert ON page_views;
DROP POLICY IF EXISTS page_views_admin_read ON page_views;
DROP POLICY IF EXISTS service_views_public_insert ON service_views;
DROP POLICY IF EXISTS service_views_admin_read ON service_views;
DROP POLICY IF EXISTS referrer_sources_public_insert ON referrer_sources;
DROP POLICY IF EXISTS referrer_sources_admin_read ON referrer_sources;

-- Page Views: Allow public inserts (for tracking), admin read
CREATE POLICY page_views_public_insert ON page_views
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY page_views_admin_read ON page_views
  FOR SELECT TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- Service Views: Allow public inserts (for tracking), admin read
CREATE POLICY service_views_public_insert ON service_views
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY service_views_admin_read ON service_views
  FOR SELECT TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- Referrer Sources: Allow public inserts (for tracking), admin read
CREATE POLICY referrer_sources_public_insert ON referrer_sources
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY referrer_sources_admin_read ON referrer_sources
  FOR SELECT TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- Grant necessary permissions to anon role for inserting analytics
GRANT INSERT ON page_views TO anon;
GRANT INSERT ON service_views TO anon;
GRANT INSERT ON referrer_sources TO anon;

-- Grant select permissions to authenticated users (admins)
GRANT SELECT ON page_views TO authenticated;
GRANT SELECT ON service_views TO authenticated;
GRANT SELECT ON referrer_sources TO authenticated;
GRANT SELECT ON analytics_summary TO authenticated;

-- Function to upsert referrer source (if not exists)
CREATE OR REPLACE FUNCTION upsert_referrer_source(
  p_source_url TEXT,
  p_source_domain TEXT
)
RETURNS void AS $$
BEGIN
  INSERT INTO referrer_sources (source_url, source_domain, visit_count, last_visit)
  VALUES (p_source_url, p_source_domain, 1, NOW())
  ON CONFLICT (source_url)
  DO UPDATE SET
    visit_count = referrer_sources.visit_count + 1,
    last_visit = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
