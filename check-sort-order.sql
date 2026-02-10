-- Fix the sort order for legal pages (run this in Supabase SQL Editor)

-- Unpublish the old privacy and terms pages
UPDATE pages
SET is_published = false
WHERE slug IN ('privacy', 'terms') 
  AND template_type = 'static_content';

-- Update new legal pages to come after dakshina (sort_order = 11)
UPDATE pages
SET sort_order = 12
WHERE slug = 'terms-conditions' AND template_type = 'legal';

UPDATE pages
SET sort_order = 13
WHERE slug = 'privacy-policy' AND template_type = 'legal';

-- Verify the changes
SELECT slug, title, template_type, sort_order, is_published
FROM pages
WHERE is_published = true
ORDER BY sort_order ASC;
