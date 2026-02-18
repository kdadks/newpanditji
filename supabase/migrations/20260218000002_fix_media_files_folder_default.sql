-- ============================================================================
-- MIGRATION: Fix media_files folder column default
-- The original migration set DEFAULT 'general' which mismatches the app's
-- NO_CATEGORY_VALUE = 'no_category'. Change default to 'no_category' so
-- any row inserted without an explicit folder value is correctly bucketed.
-- ============================================================================

ALTER TABLE media_files
  ALTER COLUMN folder SET DEFAULT 'no_category';
