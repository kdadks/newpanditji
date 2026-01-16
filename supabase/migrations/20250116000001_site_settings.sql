-- ============================================================================
-- MIGRATION: Site Metadata Settings (separate from site_settings)
-- ============================================================================

-- Site Metadata Table (key-value store for SEO metadata)
-- This is separate from site_settings which handles CMS/header/footer config
CREATE TABLE IF NOT EXISTS site_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  category TEXT DEFAULT 'general',
  updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_metadata_key ON site_metadata(setting_key);
CREATE INDEX IF NOT EXISTS idx_site_metadata_category ON site_metadata(category);

-- Enable Row Level Security
ALTER TABLE site_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_metadata
-- Allow public read access to all metadata
DROP POLICY IF EXISTS site_metadata_public_read ON site_metadata;
CREATE POLICY site_metadata_public_read ON site_metadata
  FOR SELECT TO anon, authenticated
  USING (true);

-- Allow authenticated admin users to modify metadata
DROP POLICY IF EXISTS site_metadata_admin_all ON site_metadata;
CREATE POLICY site_metadata_admin_all ON site_metadata
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Insert default site metadata settings
INSERT INTO site_metadata (setting_key, setting_value, setting_type, description, category) VALUES
  ('site_title', 'Pandit Rajesh Joshi - Hindu Priest & Spiritual Guide', 'string', 'Default site title', 'metadata'),
  ('site_description', 'Experience authentic Hindu rituals, puja ceremonies, and spiritual guidance with Pandit Rajesh Joshi in Ireland. Professional Hindu priest services for weddings, havans, and sacred ceremonies.', 'string', 'Default site description', 'metadata'),
  ('site_keywords', 'hindu priest ireland, pandit ireland, puja services ireland, hindu wedding priest, spiritual guidance, hindu rituals, vedic ceremonies', 'string', 'Default site keywords (comma-separated)', 'metadata'),
  ('site_url', 'https://panditrajesh.ie', 'string', 'Site base URL', 'metadata'),
  ('og_image', '/images/og-default.jpg', 'string', 'Default Open Graph image', 'metadata')
ON CONFLICT (setting_key) DO NOTHING;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_metadata_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

DROP TRIGGER IF EXISTS trigger_update_site_metadata_updated_at ON site_metadata;

CREATE TRIGGER trigger_update_site_metadata_updated_at
  BEFORE UPDATE ON site_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_site_metadata_updated_at();
