-- ============================================================================
-- MIGRATION 21: Analytics System
-- ============================================================================

-- Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
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

CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_country ON page_views(country);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);

-- Service Views Table
CREATE TABLE IF NOT EXISTS service_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
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

-- Referrer Sources Table
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

-- Analytics Summary View (for quick queries)
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_summary AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT country) as countries_count,
  COUNT(CASE WHEN device_type = 'mobile' THEN 1 END) as mobile_views,
  COUNT(CASE WHEN device_type = 'desktop' THEN 1 END) as desktop_views,
  COUNT(CASE WHEN device_type = 'tablet' THEN 1 END) as tablet_views
FROM page_views
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_summary_date ON analytics_summary(date);

-- Function to refresh analytics summary
CREATE OR REPLACE FUNCTION refresh_analytics_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_summary;
END;
$$ LANGUAGE plpgsql;

-- Popular Pages View
CREATE OR REPLACE VIEW popular_pages AS
SELECT
  page_path,
  page_title,
  COUNT(*) as view_count,
  COUNT(DISTINCT session_id) as unique_visitors,
  MAX(created_at) as last_viewed
FROM page_views
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_path, page_title
ORDER BY view_count DESC;

-- Popular Services View
CREATE OR REPLACE VIEW popular_services AS
SELECT
  service_id,
  service_name,
  COUNT(*) as view_count,
  COUNT(DISTINCT session_id) as unique_visitors,
  MAX(created_at) as last_viewed
FROM service_views
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY service_id, service_name
ORDER BY view_count DESC;

-- Top Referrers View
CREATE OR REPLACE VIEW top_referrers AS
SELECT
  source_domain,
  SUM(visit_count) as total_visits,
  MAX(last_visit) as last_visit
FROM referrer_sources
GROUP BY source_domain
ORDER BY total_visits DESC
LIMIT 50;

-- Location Statistics View
CREATE OR REPLACE VIEW location_stats AS
SELECT
  country,
  COUNT(*) as visit_count,
  COUNT(DISTINCT session_id) as unique_visitors,
  COUNT(DISTINCT city) as cities_count
FROM page_views
WHERE country IS NOT NULL
GROUP BY country
ORDER BY visit_count DESC;

-- Function to upsert referrer source
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
$$ LANGUAGE plpgsql;

-- Add unique constraint to referrer_sources
ALTER TABLE referrer_sources ADD CONSTRAINT IF NOT EXISTS unique_source_url UNIQUE (source_url);
