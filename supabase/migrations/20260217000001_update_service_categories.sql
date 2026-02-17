-- ============================================================================
-- Migration: Ensure Service Categories Use Correct Slugs
-- ============================================================================
-- This migration ensures all categories used by the admin form exist.
-- Old slugs are no longer referenced anywhere in the codebase.
-- Date: 2026-02-17
-- ============================================================================

-- Ensure all new-slug categories exist
INSERT INTO service_categories (name, slug, description, icon, sort_order, is_active) VALUES
  ('Poojas', 'pooja', 'Traditional Hindu puja ceremonies', 'pray', 0, true),
  ('Sanskars', 'sanskar', 'Hindu sacraments and life ceremonies', 'heart', 1, true),
  ('Paath/Recitations', 'paath', 'Sacred scripture recitations and readings', 'book', 2, true),
  ('Consultations', 'consultation', 'Spiritual guidance and astrology consultations', 'users', 3, true),
  ('Meditation & Yoga', 'wellness', 'Wellness and spiritual growth services', 'lotus', 4, true),
  ('Service Packages', 'packages', 'Curated service bundles with special pricing', 'package', 5, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

-- Reassign any services still pointing to old categories, then delete the old rows
-- (safe: ON DELETE RESTRICT on services.category_id means we must move services first)

-- puja-services -> pooja
UPDATE services
SET category_id = (SELECT id FROM service_categories WHERE slug = 'pooja')
WHERE category_id IN (SELECT id FROM service_categories WHERE slug IN ('puja-services', 'special-ceremonies'));

-- wedding-ceremonies, life-events -> sanskar
UPDATE services
SET category_id = (SELECT id FROM service_categories WHERE slug = 'sanskar')
WHERE category_id IN (SELECT id FROM service_categories WHERE slug IN ('wedding-ceremonies', 'life-events'));

-- hawan-yagna -> paath
UPDATE services
SET category_id = (SELECT id FROM service_categories WHERE slug = 'paath')
WHERE category_id IN (SELECT id FROM service_categories WHERE slug = 'hawan-yagna');

-- spiritual-guidance -> consultation
UPDATE services
SET category_id = (SELECT id FROM service_categories WHERE slug = 'consultation')
WHERE category_id IN (SELECT id FROM service_categories WHERE slug = 'spiritual-guidance');

-- Set a default category for any services without a category_id
UPDATE services
SET category_id = (SELECT id FROM service_categories WHERE slug = 'pooja' LIMIT 1)
WHERE category_id IS NULL;

-- Now delete the old category rows (no services reference them any more)
DELETE FROM service_categories
WHERE slug IN ('puja-services', 'wedding-ceremonies', 'hawan-yagna', 'life-events', 'spiritual-guidance', 'special-ceremonies');
