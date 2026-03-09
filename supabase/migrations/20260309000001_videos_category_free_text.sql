-- Drop the hardcoded CHECK constraint on videos.category so any custom
-- category string (including 'no_category' and user-defined ones) can be stored.
ALTER TABLE videos
  DROP CONSTRAINT IF EXISTS videos_category_check;
