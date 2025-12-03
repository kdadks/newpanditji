-- ============================================================================
-- MIGRATION 9: Analytics & Tracking
-- ============================================================================

-- Create an immutable function for extracting date from timestamptz
CREATE OR REPLACE FUNCTION get_date_from_timestamptz(ts TIMESTAMPTZ)
RETURNS DATE AS $$
  SELECT ts::date;
$$ LANGUAGE SQL IMMUTABLE;

-- Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  page_title TEXT,
  session_id TEXT,
  ip_address INET,
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
-- Using immutable function for date extraction to support indexing
CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(get_date_from_timestamptz(viewed_at));

-- Analytics Summary Table (Daily aggregates)
CREATE TABLE IF NOT EXISTS analytics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  avg_session_duration_seconds INTEGER,
  bounce_rate NUMERIC(5, 2),
  top_pages JSONB,
  traffic_sources JSONB,
  device_breakdown JSONB,
  browser_breakdown JSONB,
  top_countries JSONB,
  top_referrers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_summary_date ON analytics_summary(date DESC);
