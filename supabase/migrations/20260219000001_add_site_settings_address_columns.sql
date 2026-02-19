-- ============================================================================
-- MIGRATION: Add missing columns to site_settings
-- These columns were defined in the original schema but may not have been
-- applied to all environments.
-- ============================================================================

-- Address / location columns
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Contact columns
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS secondary_email TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS secondary_phone TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

-- Footer-specific contact display fields
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_contact_location TEXT;

-- Other potentially missing columns
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS business_hours JSONB;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS site_logo_dark_url TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS site_favicon_url TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT false;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS maintenance_message TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS maintenance_end_time TIMESTAMPTZ;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS enable_booking BOOLEAN DEFAULT false;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS enable_newsletter BOOLEAN DEFAULT false;
