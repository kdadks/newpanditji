-- ============================================================================
-- MIGRATION: Add file_links column to resource_sections
-- Stores an array of file attachment objects (PDF, PPT, Word, Excel, etc.)
-- Each entry: { url, label, type, fileName?, sizeBytes? }
-- ============================================================================

ALTER TABLE resource_sections
  ADD COLUMN IF NOT EXISTS file_links jsonb NOT NULL DEFAULT '[]'::jsonb;
