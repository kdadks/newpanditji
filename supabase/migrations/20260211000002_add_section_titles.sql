-- Add section_titles JSONB field to allow customization of all section titles in service detail modal
-- This gives admins full control over every piece of text that appears

ALTER TABLE services
ADD COLUMN IF NOT EXISTS section_titles JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN services.section_titles IS 'Custom titles and text for all sections in service detail modal. Keys: deity_title, nature_title, samagri_title, samagri_description, significance_title, scriptural_title, when_title, where_title, nri_title, includes_title, requirements_title, best_for_title';

-- Example structure:
-- {
--   "deity_title": "Who is Lord Ganesha?",
--   "nature_title": "Nature and Purpose of the Pooja",
--   "samagri_title": "Pooja Samagri (Required Materials)",
--   "samagri_description": "Download or print the complete list...",
--   "significance_title": "Significance and Benefits",
--   "scriptural_title": "Scriptural Roots",
--   "when_title": "When to Perform",
--   "where_title": "Where and Who Can Perform?",
--   "nri_title": "Special Notes for NRIs",
--   "includes_title": "What's Included",
--   "requirements_title": "Requirements",
--   "best_for_title": "Best For"
-- }
