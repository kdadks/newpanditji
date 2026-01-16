-- ============================================================================
-- MIGRATION: Fix Privacy and Terms Page Slugs
-- ============================================================================
-- Updates privacy-policy → privacy and terms-of-service → terms
-- to match the actual routes in the application
-- ============================================================================

-- First, delete any existing pages with the target slugs to avoid conflicts
DELETE FROM pages WHERE slug = 'privacy' AND created_at > (
  SELECT created_at FROM pages WHERE slug = 'privacy-policy' LIMIT 1
);

DELETE FROM pages WHERE slug = 'terms' AND created_at > (
  SELECT created_at FROM pages WHERE slug = 'terms-of-service' LIMIT 1
);

-- Now update the old slugs to the new ones
UPDATE pages 
SET slug = 'privacy',
    title = 'Privacy Policy',
    meta_title = 'Privacy Policy - Pandit Rajesh Joshi',
    meta_description = 'Our commitment to protecting your privacy and personal information. Learn how we collect, use, and safeguard your data.',
    sort_order = 98
WHERE slug = 'privacy-policy';

UPDATE pages 
SET slug = 'terms',
    title = 'Terms & Conditions',
    meta_title = 'Terms & Conditions - Pandit Rajesh Joshi',
    meta_description = 'Terms and conditions for using our services. Please read carefully before booking any spiritual service or ceremony.',
    sort_order = 99
WHERE slug = 'terms-of-service';
