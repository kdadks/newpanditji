-- ============================================================================
-- Migration: Analytics & Tracking Compatibility for panditji Schema
-- Adds missing analytics_summary table and aligns page_views columns
-- ============================================================================

-- 1. Create analytics_summary table in panditji schema
CREATE TABLE IF NOT EXISTS panditji.analytics_summary (
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

CREATE INDEX IF NOT EXISTS idx_analytics_summary_date ON panditji.analytics_summary(date DESC);

ALTER TABLE panditji.analytics_summary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS analytics_summary_admin_all ON panditji.analytics_summary;
CREATE POLICY analytics_summary_admin_all ON panditji.analytics_summary
  FOR ALL TO authenticated
  USING (panditji.is_admin())
  WITH CHECK (panditji.is_admin());

GRANT SELECT ON panditji.analytics_summary TO authenticated;
GRANT ALL ON panditji.analytics_summary TO service_role;

-- 2. Add missing columns to panditji.page_views for tracker & analytics hooks
ALTER TABLE panditji.page_views ALTER COLUMN page_path DROP NOT NULL;

ALTER TABLE panditji.page_views
  ADD COLUMN IF NOT EXISTS page_slug TEXT,
  ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS country_code TEXT,
  ADD COLUMN IF NOT EXISTS referrer_url TEXT,
  ADD COLUMN IF NOT EXISTS referrer_domain TEXT,
  ADD COLUMN IF NOT EXISTS operating_system TEXT,
  ADD COLUMN IF NOT EXISTS time_on_page INTEGER,
  ADD COLUMN IF NOT EXISTS scroll_depth INTEGER,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_term TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT;

CREATE INDEX IF NOT EXISTS idx_page_views_page_slug ON panditji.page_views(page_slug);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON panditji.page_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_referrer_domain ON panditji.page_views(referrer_domain);

-- 3. Automatic compatibility trigger (syncs page_slug <-> page_path, viewed_at <-> created_at)
CREATE OR REPLACE FUNCTION panditji.sync_page_views_compat()
RETURNS trigger AS $$
BEGIN
  IF NEW.page_slug IS NULL AND NEW.page_path IS NOT NULL THEN
    NEW.page_slug := NEW.page_path;
  ELSIF NEW.page_path IS NULL AND NEW.page_slug IS NOT NULL THEN
    NEW.page_path := NEW.page_slug;
  END IF;
  
  IF NEW.viewed_at IS NULL THEN
    NEW.viewed_at := COALESCE(NEW.created_at, NOW());
  END IF;
  
  IF NEW.created_at IS NULL THEN
    NEW.created_at := COALESCE(NEW.viewed_at, NOW());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_page_views ON panditji.page_views;
CREATE TRIGGER trg_sync_page_views
  BEFORE INSERT OR UPDATE ON panditji.page_views
  FOR EACH ROW
  EXECUTE FUNCTION panditji.sync_page_views_compat();

-- 4. Create referrer source upsert function
CREATE OR REPLACE FUNCTION panditji.upsert_referrer_source(
  p_source_url TEXT,
  p_source_domain TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = panditji, public, pg_temp
AS $$
BEGIN
  INSERT INTO panditji.referrer_sources (source_url, source_domain, visit_count, last_visit)
  VALUES (p_source_url, p_source_domain, 1, NOW())
  ON CONFLICT (source_url)
  DO UPDATE SET
    visit_count = panditji.referrer_sources.visit_count + 1,
    last_visit = NOW();
END;
$$;

GRANT EXECUTE ON FUNCTION panditji.upsert_referrer_source(TEXT, TEXT) TO anon, authenticated, service_role;
