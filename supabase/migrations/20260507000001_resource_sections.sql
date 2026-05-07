-- ============================================================================
-- MIGRATION: Resource Center Sections
-- Adds a standalone resource_sections table that backs the new blog-like
-- Resource Center admin UI. Each section has a title, slug, rich-text
-- description, up to 3 images (stored as URLs), up to 3 external video links,
-- and a draft/published status.
-- ============================================================================

CREATE TABLE IF NOT EXISTS resource_sections (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text NOT NULL DEFAULT '',
  image_urls    text[] NOT NULL DEFAULT '{}',
  video_links   text[] NOT NULL DEFAULT '{}',
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order    integer NOT NULL DEFAULT 0,
  meta_title    text,
  meta_description text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS resource_sections_slug_idx    ON resource_sections (slug);
CREATE INDEX IF NOT EXISTS resource_sections_status_idx  ON resource_sections (status);
CREATE INDEX IF NOT EXISTS resource_sections_order_idx   ON resource_sections (sort_order);

-- Auto-update updated_at on row change
CREATE OR REPLACE TRIGGER resource_sections_updated_at
  BEFORE UPDATE ON resource_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS: public can read published rows; only authenticated users can write
ALTER TABLE resource_sections ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'resource_sections' AND policyname = 'resource_sections_public_read'
  ) THEN
    CREATE POLICY resource_sections_public_read ON resource_sections
      FOR SELECT USING (status = 'published');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'resource_sections' AND policyname = 'resource_sections_admin_all'
  ) THEN
    CREATE POLICY resource_sections_admin_all ON resource_sections
      FOR ALL USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;
