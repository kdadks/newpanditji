-- ============================================================================
-- MIGRATION: Sync services schema to clean dynamic design
-- Date: 2026-02-20
-- ============================================================================
-- The live services table already uses:
--   core_aspects   JSONB  (ContentSection[])
--   special_notes  JSONB  (BlogLink[])
--   where_and_who  TEXT   (JSON string {name, url})
--
-- This migration drops any remaining legacy columns that may still exist
-- on older database instances.  All DROP commands use IF EXISTS so they
-- are safe to re-run.
-- ============================================================================

ALTER TABLE services
  DROP COLUMN IF EXISTS benefits,
  DROP COLUMN IF EXISTS includes,
  DROP COLUMN IF EXISTS requirements,
  DROP COLUMN IF EXISTS best_for,
  DROP COLUMN IF EXISTS deity_info,
  DROP COLUMN IF EXISTS nature,
  DROP COLUMN IF EXISTS purpose,
  DROP COLUMN IF EXISTS significance,
  DROP COLUMN IF EXISTS scriptural_roots,
  DROP COLUMN IF EXISTS when_to_perform,
  DROP COLUMN IF EXISTS special_for_nris_title,
  DROP COLUMN IF EXISTS special_for_nris_intro,
  DROP COLUMN IF EXISTS section_titles,
  DROP COLUMN IF EXISTS samagri_items,
  DROP COLUMN IF EXISTS gallery_images,
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS updated_by;

-- Ensure special_notes is JSONB (for BlogLink[] objects).
-- If it is still TEXT[] on an older instance, recreate it.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services'
      AND column_name = 'special_notes'
      AND data_type = 'ARRAY'
  ) THEN
    ALTER TABLE services DROP COLUMN special_notes;
    ALTER TABLE services ADD COLUMN special_notes JSONB DEFAULT NULL;
  END IF;
END;
$$;

COMMENT ON COLUMN services.core_aspects  IS 'ContentSection[] — dynamic rich content sections [{id,icon,enabled,title,description,bullets,images,videos,bgColor}]';
COMMENT ON COLUMN services.special_notes IS 'BlogLink[] — related articles [{title,url}]';
COMMENT ON COLUMN services.where_and_who IS 'JSON string {name,url} — booking CTA button';
