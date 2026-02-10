-- Fix legal menu location from 'footer_legal' to 'legal'
-- This ensures the admin CMS can properly manage legal menu items

UPDATE menus 
SET location = 'legal'
WHERE location = 'footer_legal' AND name = 'Footer Legal';

-- Also update the menu name to be more descriptive
UPDATE menus 
SET name = 'Legal Menu'
WHERE location = 'legal' AND name = 'Footer Legal';
