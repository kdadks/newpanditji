-- ============================================================================
-- MIGRATION 16: Seed Data - Core Pages and Settings
-- ============================================================================

-- Insert default site settings (upsert to handle re-runs)
INSERT INTO site_settings (
  primary_email,
  primary_phone,
  whatsapp_number,
  country,
  timezone,
  enable_contact_form,
  enable_testimonials,
  enable_blog,
  enable_gallery,
  enable_books,
  enable_charity,
  primary_color,
  secondary_color,
  accent_color,
  footer_text,
  copyright_text
) VALUES (
  'contact@panditrajeshkumarjoshi.com',
  '+353 1 234 5678',
  '+353 1 234 5678',
  'Ireland',
  'Europe/Dublin',
  true,
  true,
  true,
  true,
  true,
  true,
  '#D97706',
  '#7C2D12',
  '#F59E0B',
  'Providing authentic Hindu religious services across Ireland',
  '© 2024 Pandit Rajesh Kumar Joshi. All rights reserved.'
)
ON CONFLICT (singleton_guard) DO NOTHING;

-- Insert default SEO settings (upsert to handle re-runs)
INSERT INTO seo_settings (
  site_name,
  site_tagline,
  default_meta_description,
  default_meta_keywords,
  google_site_verification,
  robots_txt,
  google_analytics_id
) VALUES (
  'Pandit Rajesh Kumar Joshi',
  'Hindu Priest Services in Ireland',
  'Authentic Hindu religious services including Puja, Hawan, Weddings, and Spiritual Ceremonies by Pandit Rajesh Kumar Joshi in Ireland.',
  ARRAY['hindu priest ireland', 'pandit services dublin', 'puja services', 'hindu wedding priest', 'hawan ceremony', 'satyanarayan katha'],
  NULL,
  'User-agent: *
Allow: /
Sitemap: https://panditrajeshkumarjoshi.com/sitemap.xml',
  NULL
)
ON CONFLICT (singleton_guard) DO NOTHING;

-- Insert default cookie categories (upsert to handle re-runs)
INSERT INTO cookie_categories (name, display_name, description, is_required, is_active, sort_order) VALUES
  ('essential', 'Essential', 'These cookies are necessary for the website to function and cannot be disabled.', true, true, 0),
  ('performance', 'Performance', 'These cookies help us understand how visitors interact with our website.', false, true, 1),
  ('functional', 'Functional', 'These cookies enable personalized features and functionality.', false, true, 2),
  ('marketing', 'Marketing', 'These cookies are used to deliver relevant advertisements.', false, true, 3)
ON CONFLICT (name) DO NOTHING;

-- Insert default pages (upsert to handle re-runs)
INSERT INTO pages (slug, title, meta_title, meta_description, is_published, template_type) VALUES
  ('home', 'Home', 'Pandit Rajesh Kumar Joshi | Hindu Priest Services in Ireland', 'Authentic Hindu religious services including Puja, Hawan, Weddings, and Spiritual Ceremonies by Pandit Rajesh Kumar Joshi in Ireland.', true, 'static_content'),
  ('about', 'About', 'About Pandit Rajesh Kumar Joshi | Hindu Priest in Ireland', 'Learn about Pandit Rajesh Kumar Joshi, an experienced Hindu priest providing authentic religious services across Ireland.', true, 'static_content'),
  ('services', 'Services', 'Hindu Priest Services | Puja, Hawan, Weddings in Ireland', 'Explore our comprehensive Hindu religious services including Puja ceremonies, Hawan, Wedding rituals, and more.', true, 'static_content'),
  ('blog', 'Blog', 'Blog | Hindu Spirituality & Religious Insights', 'Read articles about Hindu spirituality, religious practices, and cultural insights from Pandit Rajesh Kumar Joshi.', true, 'static_content'),
  ('gallery', 'Gallery', 'Photo Gallery | Hindu Ceremonies in Ireland', 'View photos from Hindu ceremonies, pujas, and religious events conducted by Pandit Rajesh Kumar Joshi.', true, 'static_content'),
  ('testimonials', 'Testimonials', 'Testimonials | Client Reviews for Hindu Priest Services', 'Read what our clients say about our Hindu priest services in Ireland.', true, 'static_content'),
  ('books', 'Books', 'Spiritual Books | Hindu Religious Literature', 'Explore spiritual books and religious literature recommended by Pandit Rajesh Kumar Joshi.', true, 'static_content'),
  ('charity', 'Charity', 'Charity Work | Community Service in Ireland', 'Learn about our charitable initiatives and community service projects in Ireland.', true, 'static_content'),
  ('contact', 'Contact', 'Contact Pandit Rajesh Kumar Joshi | Book Hindu Priest Services', 'Get in touch with Pandit Rajesh Kumar Joshi for Hindu priest services in Ireland. Book a consultation today.', true, 'static_content'),
  ('privacy-policy', 'Privacy Policy', 'Privacy Policy | Pandit Rajesh Kumar Joshi', 'Read our privacy policy to understand how we collect, use, and protect your personal information.', true, 'static_content'),
  ('terms-of-service', 'Terms of Service', 'Terms of Service | Pandit Rajesh Kumar Joshi', 'Read our terms of service governing the use of our website and services.', true, 'static_content'),
  ('why-choose-us', 'Why Choose Us', 'Why Choose Pandit Rajesh Kumar Joshi | Trusted Hindu Priest', 'Discover why families across Ireland choose Pandit Rajesh Kumar Joshi for their Hindu religious ceremonies.', true, 'static_content')
ON CONFLICT (slug) DO NOTHING;

-- Insert default menus (upsert to handle re-runs)
INSERT INTO menus (name, location, is_active) VALUES
  ('Main Navigation', 'header', true),
  ('Footer Links', 'footer', true),
  ('Footer Legal', 'footer_legal', true)
ON CONFLICT (name) DO NOTHING;

-- Get menu IDs and insert menu items
DO $$
DECLARE
  v_main_menu_id UUID;
  v_footer_menu_id UUID;
  v_legal_menu_id UUID;
BEGIN
  SELECT id INTO v_main_menu_id FROM menus WHERE name = 'Main Navigation';
  SELECT id INTO v_footer_menu_id FROM menus WHERE name = 'Footer Links';
  SELECT id INTO v_legal_menu_id FROM menus WHERE name = 'Footer Legal';

  -- Main Navigation Items
  INSERT INTO menu_items (menu_id, label, url, sort_order, is_visible) VALUES
    (v_main_menu_id, 'Home', '/', 0, true),
    (v_main_menu_id, 'About', '/about', 1, true),
    (v_main_menu_id, 'Services', '/services', 2, true),
    (v_main_menu_id, 'Gallery', '/gallery', 3, true),
    (v_main_menu_id, 'Blog', '/blog', 4, true),
    (v_main_menu_id, 'Books', '/books', 5, true),
    (v_main_menu_id, 'Charity', '/charity', 6, true),
    (v_main_menu_id, 'Contact', '/contact', 7, true);

  -- Footer Links
  INSERT INTO menu_items (menu_id, label, url, sort_order, is_visible) VALUES
    (v_footer_menu_id, 'About Us', '/about', 0, true),
    (v_footer_menu_id, 'Our Services', '/services', 1, true),
    (v_footer_menu_id, 'Testimonials', '/testimonials', 2, true),
    (v_footer_menu_id, 'Why Choose Us', '/why-choose-us', 3, true),
    (v_footer_menu_id, 'Contact', '/contact', 4, true);

  -- Footer Legal
  INSERT INTO menu_items (menu_id, label, url, sort_order, is_visible) VALUES
    (v_legal_menu_id, 'Privacy Policy', '/privacy-policy', 0, true),
    (v_legal_menu_id, 'Terms of Service', '/terms-of-service', 1, true);
END $$;

-- Insert default service categories (upsert to handle re-runs)
INSERT INTO service_categories (name, slug, description, icon, sort_order, is_active) VALUES
  ('Puja Services', 'puja-services', 'Traditional Hindu puja ceremonies for homes and temples', 'pray', 0, true),
  ('Wedding Ceremonies', 'wedding-ceremonies', 'Complete Hindu wedding rituals and ceremonies', 'heart', 1, true),
  ('Hawan & Yagna', 'hawan-yagna', 'Sacred fire ceremonies for purification and blessings', 'flame', 2, true),
  ('Life Events', 'life-events', 'Ceremonies for important life milestones', 'calendar', 3, true),
  ('Spiritual Guidance', 'spiritual-guidance', 'Consultations and spiritual counseling services', 'book', 4, true),
  ('Special Ceremonies', 'special-ceremonies', 'Specialized religious ceremonies and rituals', 'star', 5, true)
ON CONFLICT (slug) DO NOTHING;
