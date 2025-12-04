-- ============================================================================
-- MIGRATION 22: Extend Site Settings for Header/Footer Fields
-- Adds missing header fields and Pinterest URL to site_settings table
-- ============================================================================

-- Add new columns if they don't exist
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS site_name TEXT DEFAULT 'Pandit Rajesh Joshi';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS site_tagline TEXT DEFAULT 'Hindu Priest & Spiritual Guide';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS header_cta_text TEXT DEFAULT 'Book Consultation';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS header_cta_link TEXT DEFAULT '/contact';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS pinterest_url TEXT;

-- Update existing record with default values if null
UPDATE site_settings SET 
  site_name = COALESCE(site_name, 'Pandit Rajesh Joshi'),
  site_tagline = COALESCE(site_tagline, 'Hindu Priest & Spiritual Guide'),
  header_cta_text = COALESCE(header_cta_text, 'Book Consultation'),
  header_cta_link = COALESCE(header_cta_link, '/contact')
WHERE singleton_guard = true;

-- Add comment for documentation
COMMENT ON COLUMN site_settings.site_name IS 'Site name displayed in header';
COMMENT ON COLUMN site_settings.site_tagline IS 'Tagline displayed below site name';
COMMENT ON COLUMN site_settings.header_cta_text IS 'Call-to-action button text in header';
COMMENT ON COLUMN site_settings.header_cta_link IS 'Call-to-action button link in header';
COMMENT ON COLUMN site_settings.pinterest_url IS 'Pinterest profile URL';
