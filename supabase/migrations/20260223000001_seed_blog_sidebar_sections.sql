-- ============================================================================
-- MIGRATION: Seed Blog Sidebar CMS Sections
-- Adds author_card and guidance_card sections to the blog page
-- so they are editable via the CMS admin panel.
-- ============================================================================

DO $$
DECLARE
  v_blog_page_id UUID;
BEGIN
  SELECT id INTO v_blog_page_id FROM pages WHERE slug = 'blog';

  IF v_blog_page_id IS NOT NULL THEN

    -- Author Card section
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (
      v_blog_page_id,
      'author_card',
      'author-card',
      'About the Author',
      '{
        "title": "About the Author",
        "name": "Pandit Rajesh Joshi",
        "role": "Hindu Priest & Spiritual Guide",
        "bio": "With over 15 years of experience in Hindu rituals and spiritual guidance, Pandit Rajesh Joshi shares wisdom to help navigate life''s sacred journey.",
        "image": "/images/Logo/Raj ji.png"
      }'::jsonb,
      1,
      true
    )
    ON CONFLICT (page_id, section_key) DO UPDATE SET
      content = EXCLUDED.content,
      updated_at = NOW();

    -- Guidance / CTA Card section
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (
      v_blog_page_id,
      'guidance_card',
      'guidance-card',
      'Need Spiritual Guidance?',
      '{
        "title": "Need Spiritual Guidance?",
        "description": "Book a consultation for personalized spiritual guidance and pooja services.",
        "ctaButtons": [
          { "text": "Contact Us", "link": "/contact" }
        ]
      }'::jsonb,
      2,
      true
    )
    ON CONFLICT (page_id, section_key) DO UPDATE SET
      content = EXCLUDED.content,
      updated_at = NOW();

  END IF;
END $$;
