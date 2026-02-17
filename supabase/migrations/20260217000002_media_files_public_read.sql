-- ============================================================================
-- Migration: Add public read policy for media_files
-- ============================================================================
-- The media_files table had RLS enabled but only an admin policy.
-- Public/anon visitors (e.g. gallery page) could not read any photos.
-- This adds a public read policy so images display on the gallery page.
-- Date: 2026-02-17
-- ============================================================================

-- Drop if exists (idempotent)
DROP POLICY IF EXISTS media_files_anon_read ON media_files;

-- Public read for all media files (images are public assets)
CREATE POLICY media_files_anon_read ON media_files
  FOR SELECT TO anon
  USING (true);
