-- ============================================================================
-- MIGRATION: Add Service Packages Support
-- ============================================================================
-- This migration adds support for service packages that can include multiple services
-- Date: 2026-01-27
-- ============================================================================

-- Add 'Packages' category to service_categories
INSERT INTO service_categories (name, slug, description, icon, sort_order, is_active) VALUES
  ('Service Packages', 'packages', 'Curated service bundles with special pricing', 'package', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Create junction table for package-service relationships
CREATE TABLE IF NOT EXISTS service_package_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  -- Store snapshot of service details at time of package creation
  service_snapshot JSONB,
  -- Optional: override price for this service in the package
  package_price_override TEXT,
  -- Optional: additional notes specific to this service in this package
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure a service can't be added to the same package twice
  UNIQUE(package_id, service_id),

  -- Prevent a package from including itself
  CHECK (package_id != service_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_package_items_package_id ON service_package_items(package_id);
CREATE INDEX IF NOT EXISTS idx_package_items_service_id ON service_package_items(service_id);
CREATE INDEX IF NOT EXISTS idx_package_items_sort_order ON service_package_items(package_id, sort_order);

-- Add columns to services table for package-specific data
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_package BOOLEAN DEFAULT false;
ALTER TABLE services ADD COLUMN IF NOT EXISTS package_savings_text TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS package_highlights TEXT[];

-- Create index for package queries
CREATE INDEX IF NOT EXISTS idx_services_is_package ON services(is_package) WHERE is_package = true;

-- Enable RLS on service_package_items
ALTER TABLE service_package_items ENABLE ROW LEVEL SECURITY;

-- Public read policy for package items (to show package contents)
CREATE POLICY service_package_items_public_read ON service_package_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM services
      WHERE services.id = service_package_items.package_id
      AND services.is_published = true
      AND services.is_package = true
    )
  );

-- Admin policies for package items (authenticated users can manage)
CREATE POLICY service_package_items_admin_all ON service_package_items
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to update package item updated_at timestamp
CREATE OR REPLACE FUNCTION update_service_package_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_service_package_items_updated_at ON service_package_items;
CREATE TRIGGER update_service_package_items_updated_at
  BEFORE UPDATE ON service_package_items
  FOR EACH ROW
  EXECUTE FUNCTION update_service_package_items_updated_at();

-- Create function to automatically set is_package flag
CREATE OR REPLACE FUNCTION set_is_package_flag()
RETURNS TRIGGER AS $$
BEGIN
  -- When a service's category is 'packages', set is_package to true
  IF EXISTS (
    SELECT 1 FROM service_categories
    WHERE id = NEW.category_id AND slug = 'packages'
  ) THEN
    NEW.is_package = true;
  ELSE
    NEW.is_package = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Create trigger to automatically set is_package flag
DROP TRIGGER IF EXISTS set_is_package_flag_trigger ON services;
CREATE TRIGGER set_is_package_flag_trigger
  BEFORE INSERT OR UPDATE OF category_id ON services
  FOR EACH ROW
  EXECUTE FUNCTION set_is_package_flag();

-- Create view for easy package queries with included services
CREATE OR REPLACE VIEW v_service_packages AS
SELECT
  s.id,
  s.name,
  s.slug,
  s.short_description,
  s.full_description,
  s.price,
  s.duration,
  s.featured_image_url,
  s.is_published,
  s.is_featured,
  s.package_savings_text,
  s.package_highlights,
  s.created_at,
  s.updated_at,
  -- Aggregate included services
  COALESCE(
    json_agg(
      json_build_object(
        'id', included_service.id,
        'name', included_service.name,
        'slug', included_service.slug,
        'price', included_service.price,
        'duration', included_service.duration,
        'short_description', included_service.short_description,
        'featured_image_url', included_service.featured_image_url,
        'sort_order', spi.sort_order,
        'package_price_override', spi.package_price_override,
        'notes', spi.notes
      ) ORDER BY spi.sort_order
    ) FILTER (WHERE included_service.id IS NOT NULL),
    '[]'::json
  ) as included_services,
  -- Count of included services
  COUNT(included_service.id) as service_count
FROM services s
LEFT JOIN service_package_items spi ON s.id = spi.package_id
LEFT JOIN services included_service ON spi.service_id = included_service.id
WHERE s.is_package = true
GROUP BY s.id, s.name, s.slug, s.short_description, s.full_description,
         s.price, s.duration, s.featured_image_url, s.is_published,
         s.is_featured, s.package_savings_text, s.package_highlights,
         s.created_at, s.updated_at;

-- Grant access to the view
GRANT SELECT ON v_service_packages TO anon, authenticated;

COMMENT ON TABLE service_package_items IS 'Junction table linking service packages with their included services';
COMMENT ON COLUMN services.is_package IS 'Indicates if this service is actually a package of other services';
COMMENT ON COLUMN services.package_savings_text IS 'Marketing text explaining package savings (e.g., "Save €50 when you book together")';
COMMENT ON COLUMN services.package_highlights IS 'Array of key highlights/benefits of the package';
COMMENT ON VIEW v_service_packages IS 'Convenient view showing packages with their included services';
