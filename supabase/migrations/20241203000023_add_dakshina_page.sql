-- ============================================================================
-- MIGRATION 23: Add Dakshina Page
-- This migration creates the dakshina page and its content sections for CMS
-- ============================================================================

-- Insert dakshina page
INSERT INTO pages (slug, title, meta_title, meta_description, template_type, is_published, sort_order) VALUES
  ('dakshina', 'Dakshina', 'Dakshina - Voluntary Contribution for Spiritual Services', 'Understanding Dakshina - a sacred tradition of offering for spiritual services and blessings from Pandit Rajesh Joshi.', 'static_content', true, 11)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  template_type = EXCLUDED.template_type,
  sort_order = EXCLUDED.sort_order;

-- ============================================================================
-- DAKSHINA PAGE SECTIONS
-- ============================================================================

DO $$
DECLARE
  v_dakshina_page_id UUID;
BEGIN
  SELECT id INTO v_dakshina_page_id FROM pages WHERE slug = 'dakshina';
  
  IF v_dakshina_page_id IS NOT NULL THEN
    -- Page Metadata Section
    INSERT INTO page_sections (page_id, section_key, section_type, content, sort_order, is_visible)
    VALUES (v_dakshina_page_id, 'page_metadata', 'metadata',
      '{
        "title": "Dakshina - Voluntary Contribution",
        "description": "Understanding the sacred tradition of Dakshina for spiritual services"
      }'::jsonb, 0, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Hero Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_dakshina_page_id, 'hero', 'hero', 'Dakshina - Sacred Offering', 'Understanding the Tradition of Voluntary Contribution',
      '{
        "description": "Dakshina is a voluntary contribution offered with respect and gratitude for spiritual services and blessings received from religious ceremonies.",
        "backgroundImages": [
          "/images/South Asian Temple Complex.png",
          "/images/Golden Temples of Devotion.png",
          "/images/Traditional Altar with Marigold Flowers.png"
        ]
      }'::jsonb, 1, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- What is Dakshina Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_dakshina_page_id, 'what_is_dakshina', 'content', 'What is Dakshina?', 'A Sacred Tradition of Giving',
      '{
        "content": "Dakshina is an ancient Hindu tradition representing a voluntary contribution or offering made to priests and spiritual guides. It is given with reverence and gratitude for the spiritual services, knowledge, and blessings received during religious ceremonies and rituals.",
        "keyPoints": [
          {
            "title": "Voluntary Nature",
            "description": "Dakshina is always voluntary and given from the heart, never demanded or fixed"
          },
          {
            "title": "Symbol of Respect",
            "description": "It represents respect and appreciation for the priest''s time, knowledge, and spiritual service"
          },
          {
            "title": "Spiritual Tradition",
            "description": "Rooted in Vedic traditions, it honors the spiritual exchange between devotee and priest"
          },
          {
            "title": "Energy Exchange",
            "description": "It completes the cycle of giving and receiving in spiritual practices"
          }
        ]
      }'::jsonb, 2, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Pricing Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_dakshina_page_id, 'pricing_section', 'pricing', 'Service Guidelines', 'Suggested Dakshina',
      '{
        "badge": "Transparent Pricing",
        "description": "These are suggested amounts to help you plan. However, dakshina is always voluntary and can be given according to your capacity and devotion.",
        "services": [
          {
            "name": "Simple Pooja",
            "description": "Daily worship, Satyanarayan Katha, small ceremonies",
            "price": "50-100"
          },
          {
            "name": "Standard Ceremonies",
            "description": "Housewarming, naming ceremony, thread ceremony",
            "price": "150-250"
          },
          {
            "name": "Major Ceremonies",
            "description": "Wedding, engagement, anniversary celebrations",
            "price": "300-500"
          },
          {
            "name": "Special Rituals",
            "description": "Vastu Shanti, Griha Pravesh, extended ceremonies",
            "price": "200-400"
          }
        ],
        "notes": [
          "Travel costs may apply for locations beyond 50km",
          "Multi-day ceremonies priced separately",
          "Group ceremonies and regular clients receive special consideration",
          "Financial constraints should never prevent you from receiving spiritual services - please discuss"
        ]
      }'::jsonb, 3, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- CTA Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_dakshina_page_id, 'cta_section', 'cta', 'Ready to Begin?', NULL,
      '{
        "description": "Contact us to discuss your spiritual needs and we will guide you through the process with understanding and care.",
        "primaryButtonText": "Contact Us",
        "secondaryButtonText": "View All Services"
      }'::jsonb, 4, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

  END IF;
END $$;
