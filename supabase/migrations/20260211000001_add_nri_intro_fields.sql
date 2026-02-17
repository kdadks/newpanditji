-- Add special_for_nris_title and special_for_nris_intro fields to services table
-- This allows customization of the NRI section title and intro paragraph per service

ALTER TABLE services
ADD COLUMN IF NOT EXISTS special_for_nris_title TEXT,
ADD COLUMN IF NOT EXISTS special_for_nris_intro TEXT;

-- Set default values for existing services
UPDATE services
SET 
  special_for_nris_title = 'Special Notes for NRIs',
  special_for_nris_intro = 'For many families living outside India, life is busy, scattered across work, school, and different time zones. We may feel connected to our deities in the heart, but regular, structured worship can become difficult. This pooja offers a beautiful way to reconnect as a family and as a community:'
WHERE special_notes IS NOT NULL AND special_notes != '{}';

COMMENT ON COLUMN services.special_for_nris_title IS 'Custom title for the NRI-specific section (defaults to "Special Notes for NRIs")';
COMMENT ON COLUMN services.special_for_nris_intro IS 'Custom introductory paragraph for the NRI section, providing context before the bullet points';
