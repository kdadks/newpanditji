-- ============================================================================
-- MIGRATION: Fix Dakshina Pricing Data Structure
-- Update existing pricing_section data to use 'price' instead of 'suggested'
-- ============================================================================

-- Update the pricing_section content for the dakshina page
UPDATE page_sections
SET content = jsonb_set(
  jsonb_set(
    jsonb_set(
      content,
      '{services,0,price}',
      content->'services'->0->'suggested'
    ),
    '{services,1,price}',
    content->'services'->1->'suggested'
  ),
  '{services,2,price}',
  content->'services'->2->'suggested'
)
WHERE page_id = (SELECT id FROM pages WHERE slug = 'dakshina')
  AND section_key = 'pricing_section'
  AND content->'services'->0 ? 'suggested';

-- Remove the 'suggested' fields after copying to 'price'
UPDATE page_sections
SET content = jsonb_set(
  jsonb_set(
    jsonb_set(
      content,
      '{services,0}',
      (content->'services'->0) - 'suggested'
    ),
    '{services,1}',
    (content->'services'->1) - 'suggested'
  ),
  '{services,2}',
  (content->'services'->2) - 'suggested'
)
WHERE page_id = (SELECT id FROM pages WHERE slug = 'dakshina')
  AND section_key = 'pricing_section'
  AND content->'services'->0 ? 'price';

-- Also handle the 4th service if it exists
UPDATE page_sections
SET content = jsonb_set(
  content,
  '{services,3,price}',
  content->'services'->3->'suggested'
)
WHERE page_id = (SELECT id FROM pages WHERE slug = 'dakshina')
  AND section_key = 'pricing_section'
  AND content->'services'->3 ? 'suggested';

UPDATE page_sections
SET content = jsonb_set(
  content,
  '{services,3}',
  (content->'services'->3) - 'suggested'
)
WHERE page_id = (SELECT id FROM pages WHERE slug = 'dakshina')
  AND section_key = 'pricing_section'
  AND content->'services'->3 ? 'price';
