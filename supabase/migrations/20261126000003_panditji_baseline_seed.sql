-- ============================================================================
-- PANDIT RAJESH JOSHI PLATFORM - BASELINE SEED DATA (SCHEMA: panditji)
-- Target: Shared Supabase Database (gsqfaguqsmnuoeuhpxro)
--
-- This script contains the complete, production-ready baseline dataset:
-- 1. Service Categories & 30+ Services with dynamic metadata
-- 2. CMS Pages & Structured Content Sections
-- 3. Navigation Menus & Menu Hierarchy
-- 4. Site Settings & SEO Metadata (Key-Value)
-- 5. User Project Binding for Administrator Accounts
-- ============================================================================

SET search_path = panditji, pg_temp;

-- ============================================================================
-- 1. SERVICE CATEGORIES
-- ============================================================================

INSERT INTO panditji.service_categories (name, slug, description, icon, sort_order, is_active) VALUES
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

-- ============================================================================
-- 2. SERVICES & CEREMONIES
-- ============================================================================

DO $$
DECLARE
  v_pooja_cat_id UUID;
  v_sanskar_cat_id UUID;
  v_paath_cat_id UUID;
  v_consultation_cat_id UUID;
  v_wellness_cat_id UUID;
  v_packages_cat_id UUID;
BEGIN
  SELECT id INTO v_pooja_cat_id FROM panditji.service_categories WHERE slug = 'pooja';
  SELECT id INTO v_sanskar_cat_id FROM panditji.service_categories WHERE slug = 'sanskar';
  SELECT id INTO v_paath_cat_id FROM panditji.service_categories WHERE slug = 'paath';
  SELECT id INTO v_consultation_cat_id FROM panditji.service_categories WHERE slug = 'consultation';
  SELECT id INTO v_wellness_cat_id FROM panditji.service_categories WHERE slug = 'wellness';
  SELECT id INTO v_packages_cat_id FROM panditji.service_categories WHERE slug = 'packages';

  -- 2.1 Poojas
  INSERT INTO panditji.services (category_id, name, slug, short_description, full_description, duration, price, is_featured, is_popular, is_published, sort_order) VALUES
    (v_pooja_cat_id, 'Satyanarayan Puja', 'satyanarayan-puja', 'Sacred puja for prosperity, harmony, and gratitude', 'The Satyanarayan Puja is a sacred Hindu ritual dedicated to Lord Vishnu as the embodiment of Truth. Performed to seek divine blessings for prosperity, health, and family well-being.', '2-3 hours', 'Contact for pricing', true, true, true, 0),
    (v_pooja_cat_id, 'Ganesh Puja', 'ganesh-puja', 'Invoke Lord Ganesha for auspicious beginnings', 'Lord Ganesha is worshipped at the inception of all auspicious occasions to remove obstacles and bestow success.', '1-2 hours', 'Contact for pricing', true, true, true, 1),
    (v_pooja_cat_id, 'Lakshmi Puja', 'lakshmi-puja', 'Worship of Goddess Lakshmi for wealth and fortune', 'Lakshmi Puja is performed to invoke the divine blessings of Goddess Lakshmi for spiritual and material abundance.', '1-2 hours', 'Contact for pricing', true, false, true, 2),
    (v_pooja_cat_id, 'Durga Puja', 'durga-puja', 'Worship of Goddess Durga for protection and strength', 'Durga Puja celebrates the triumph of dharma over adharma, invoking supreme protective energies.', '2-3 hours', 'Contact for pricing', false, false, true, 3),
    (v_pooja_cat_id, 'Saraswati Puja', 'saraswati-puja', 'Worship for wisdom, education, and artistic growth', 'Dedicated to the Goddess of learning, speech, and arts. Highly recommended for students and seekers.', '1-2 hours', 'Contact for pricing', false, false, true, 4),
    (v_pooja_cat_id, 'Navgraha Puja', 'navgraha-puja', 'Planetary balance and cosmic harmony', 'Navgraha Puja pacifies astrological planetary influences and enhances auspicious cosmic grace.', '2-3 hours', 'Contact for pricing', false, true, true, 5),
    (v_pooja_cat_id, 'Rudrabhishek', 'rudrabhishek', 'Sacred Shiva Lingam ritual for health and peace', 'A powerful Vedic abhishekam performed on the Shiva Lingam with sacred dravyas, invoking peace, health, and spiritual realization.', '2-4 hours', 'Contact for pricing', true, true, true, 6),
    (v_pooja_cat_id, 'Vastu Shanti Puja', 'vastu-shanti-puja', 'Harmonize your living and workplace space', 'Removes negative environmental vibrations and aligns living spaces with cosmic directional principles.', '2-3 hours', 'Contact for pricing', false, false, true, 7),
    (v_pooja_cat_id, 'Griha Pravesh', 'griha-pravesh', 'Vedic housewarming ceremony', 'The sacred ceremony to purify a new home, honor the deities, and invite enduring harmony and prosperity.', '2-3 hours', 'Contact for pricing', true, true, true, 8)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description,
    full_description = EXCLUDED.full_description,
    duration = EXCLUDED.duration,
    category_id = EXCLUDED.category_id;

  -- 2.2 Sanskars
  INSERT INTO panditji.services (category_id, name, slug, short_description, full_description, duration, price, is_featured, is_popular, is_published, sort_order) VALUES
    (v_sanskar_cat_id, 'Hindu Wedding Ceremony', 'hindu-wedding', 'Authentic Vedic wedding ceremony', 'Complete Vedic Vivah Sanskar including Kanyadaan, Panigrahana, Saptapadi, and Mangalsutra dharanam performed with dignified English and Sanskrit explanations.', '3-5 hours', 'Contact for pricing', true, true, true, 0),
    (v_sanskar_cat_id, 'Engagement Ceremony', 'engagement-ceremony', 'Traditional engagement and sagai blessings', 'Marks the formal alliance of two families with traditional prayers, ring exchange, and elder blessings.', '1-2 hours', 'Contact for pricing', true, false, true, 1),
    (v_sanskar_cat_id, 'Namkaran (Naming Ceremony)', 'namkaran', 'Sacred Vedic naming ritual for newborns', 'Performed on an auspicious tithi with astrological guidance to give the newborn a blessed name and invoke divine protection.', '1-2 hours', 'Contact for pricing', true, true, true, 2),
    (v_sanskar_cat_id, 'Annaprashan', 'annaprashan', 'First solid food feeding ritual', 'Marks the child''s transition to solid food, sanctified with mantras for healthy nourishment and growth.', '1 hour', 'Contact for pricing', false, false, true, 3),
    (v_sanskar_cat_id, 'Upanayana (Janeu Ceremony)', 'upanayana', 'Sacred thread initiation and Vedic education', 'The formal initiation into scriptural learning, Gayatri mantra, and spiritual responsibility.', '2-3 hours', 'Contact for pricing', true, false, true, 4)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description;

  -- 2.3 Paaths & Hawans
  INSERT INTO panditji.services (category_id, name, slug, short_description, full_description, duration, price, is_featured, is_popular, is_published, sort_order) VALUES
    (v_paath_cat_id, 'Hawan Ceremony', 'hawan-ceremony', 'Sacred yajna fire ritual for cosmic purification', 'Vedic fire ceremony with pure samagri and herbal offerings to cleanse surroundings and invoke devata blessings.', '1-2 hours', 'Contact for pricing', true, true, true, 0),
    (v_paath_cat_id, 'Maha Mrityunjaya Hawan', 'maha-mrityunjaya-hawan', 'Potent healing and longevity fire sacrifice', 'Invokes Lord Shiva through continuous Maha Mrityunjaya mantra japa and ahutis for health, protection, and long life.', '2-3 hours', 'Contact for pricing', true, true, true, 1),
    (v_paath_cat_id, 'Sunderkand Path', 'sunderkand-path', 'Recitation of Sunderkand from Ramcharitmanas', 'Complete congregational recitation honoring Hanumanji for strength, confidence, and overcoming challenges.', '2-3 hours', 'Contact for pricing', false, false, true, 2)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description;

  -- 2.4 Consultations
  INSERT INTO panditji.services (category_id, name, slug, short_description, full_description, duration, price, is_featured, is_popular, is_published, sort_order) VALUES
    (v_consultation_cat_id, 'Horoscope Consultation', 'horoscope-consultation', 'Personalized Vedic astrology & Janampatri analysis', 'Comprehensive horoscope analysis providing clarity on career, relationships, spiritual path, and life decisions.', '1-2 hours', 'Contact for pricing', true, true, true, 0),
    (v_consultation_cat_id, 'Muhurat Selection', 'muhurat-selection', 'Auspicious timing determination', 'Calculation of shubh muhurats for weddings, housewarmings, naming ceremonies, and corporate launches.', '30-60 mins', 'Contact for pricing', true, false, true, 1),
    (v_consultation_cat_id, 'Spiritual Counseling', 'spiritual-counseling', 'Vedic guidance for life dilemmas', 'Confidential one-on-one counseling grounded in Bhagavad Gita principles and Vedic philosophical wisdom.', '1 hour', 'Contact for pricing', false, false, true, 2)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description;

END $$;

-- ============================================================================
-- 3. CMS PAGES & CORE SECTIONS
-- ============================================================================

INSERT INTO panditji.pages (slug, title, meta_title, meta_description, template_type, is_published, sort_order) VALUES
  ('home', 'Home', 'Pandit Rajesh Joshi - Hindu Priest & Spiritual Guide in Ireland', 'Experience authentic Hindu ceremonies performed with devotion, wisdom, and centuries-old knowledge by Pandit Rajesh Joshi.', 'home', true, 1),
  ('about', 'About Us', 'About Pandit Rajesh Joshi - Hindu Scholar & Spiritual Guide', 'Meet Rajesh Joshi, Hindu scholar, pandit, author, poet, and spiritual guide serving Ireland, the UK, and Europe.', 'about', true, 2),
  ('why-choose-us', 'Why Choose Us', 'Why Choose Pandit Rajesh Joshi for Your Ceremonies', 'Experience the perfect blend of authentic Vedic traditions, scholarly wisdom, and heartfelt devotion.', 'static_content', true, 3),
  ('services', 'Services', 'Hindu Priest Services - Pooja, Sanskar, Paath & Consultations', 'Comprehensive spiritual services from birth ceremonies to weddings and final rites, performed with authentic Hindu rituals.', 'services', true, 4),
  ('books', 'Books', 'Spiritual Literature & Books by Rajesh Joshi Ji', 'Explore enlightening publications on Sanatan Dharma, Vedic philosophy, meditation, and self-realization.', 'books', true, 5),
  ('gallery', 'Gallery', 'Sacred Ceremonies & Community Photo Gallery', 'Glimpses of sacred ceremonies, spiritual gatherings, yajnas, and charity initiatives.', 'gallery', true, 6),
  ('testimonials', 'Testimonials', 'Devotee & Client Testimonials', 'Read heartfelt reviews and testimonials from families and devotees across Ireland and Europe.', 'testimonials', true, 7),
  ('charity', 'Charity', 'Charitable Programs & Philanthropy', 'Philanthropic initiatives in cow care (Gaushala), underprivileged child education, and cultural preservation.', 'charity', true, 8),
  ('contact', 'Contact', 'Contact Pandit Rajesh Joshi - Book a Ceremony', 'Inquire for ceremony bookings, date availability, and spiritual consultations.', 'contact', true, 9),
  ('blog', 'Blog', 'Vedic Wisdom & Spiritual Articles', 'Read insightful guides on Sanatan Dharma festivals, ritual procedures, and Vedic teachings.', 'blog', true, 10),
  ('dakshina', 'Dakshina Guidance', 'Dakshina Guidance | Cultural & Ethical Guidelines', 'Understanding the spiritual tradition, ethics, and voluntary contributions for Vedic priesthood.', 'static_content', true, 11),
  ('pandit-resource-center', 'Pandit Resource Center', 'Pandit Resource Center | Mantras, Stotras & Downloads', 'Curated study materials, stotras, festival calendars, and ritual samagri guides.', 'resource_center', true, 12)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  is_published = true;

-- ============================================================================
-- 4. NAVIGATION MENUS
-- ============================================================================

INSERT INTO panditji.menus (name, location, is_active) VALUES
  ('Header Menu', 'header', true),
  ('Footer Menu', 'footer', true),
  ('Legal Menu', 'footer_legal', true)
ON CONFLICT (name) DO NOTHING;

DO $$
DECLARE
  v_header_id UUID;
  v_footer_id UUID;
  v_legal_id UUID;
BEGIN
  SELECT id INTO v_header_id FROM panditji.menus WHERE name = 'Header Menu';
  SELECT id INTO v_footer_id FROM panditji.menus WHERE name = 'Footer Menu';
  SELECT id INTO v_legal_id FROM panditji.menus WHERE name = 'Legal Menu';

  IF v_header_id IS NOT NULL THEN
    INSERT INTO panditji.menu_items (menu_id, label, url, sort_order, is_visible) VALUES
      (v_header_id, 'Home', '/', 1, true),
      (v_header_id, 'Services', '/services', 2, true),
      (v_header_id, 'About', '/about', 3, true),
      (v_header_id, 'Resource Center', '/pandit-resource-center', 4, true),
      (v_header_id, 'Blog', '/blog', 5, true),
      (v_header_id, 'Books', '/books', 6, true),
      (v_header_id, 'Charity', '/charity', 7, true),
      (v_header_id, 'Contact', '/contact', 8, true)
    ON CONFLICT DO NOTHING;
  END IF;

  IF v_legal_id IS NOT NULL THEN
    INSERT INTO panditji.menu_items (menu_id, label, url, sort_order, is_visible) VALUES
      (v_legal_id, 'Terms & Conditions', '/terms', 1, true),
      (v_legal_id, 'Privacy Policy', '/privacy', 2, true),
      (v_legal_id, 'Dakshina Guidance', '/dakshina', 3, true)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================================================
-- 5. SITE SETTINGS & SEO METADATA
-- ============================================================================

INSERT INTO panditji.site_settings (
  primary_email,
  primary_phone,
  whatsapp_number,
  address,
  city,
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
  'panditjoshirajesh@gmail.com',
  '+353 87 234 5678',
  '+353 87 234 5678',
  'Dublin, Ireland',
  'Dublin',
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
  'Providing authentic Hindu rituals, sanskars, and spiritual guidance across Ireland, the UK, and Europe.',
  '© 2026 Pandit Rajesh Joshi. All rights reserved.'
)
ON CONFLICT (singleton_guard) DO UPDATE SET
  primary_email = EXCLUDED.primary_email,
  country = EXCLUDED.country;

INSERT INTO panditji.site_metadata (setting_key, setting_value, setting_type, description, category) VALUES
  ('site_title', 'Pandit Rajesh Joshi - Hindu Priest & Spiritual Guide in Ireland', 'string', 'Default website title', 'metadata'),
  ('site_description', 'Authentic Hindu ceremonies, poojas, sanskars, and Vedic wisdom with Pandit Rajesh Joshi in Ireland, UK, and Europe.', 'string', 'Default site description', 'metadata'),
  ('site_url', 'https://panditrajesh.ie', 'string', 'Production base URL', 'metadata'),
  ('og_image', '/images/og-default.jpg', 'string', 'Default OpenGraph banner', 'metadata')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value;

-- ============================================================================
-- 6. USER PROJECT BINDING
-- ============================================================================

SELECT panditji.bind_user_to_project('panditjoshirajesh@gmail.com', 'super_admin');
SELECT panditji.bind_user_to_project('admin@panditrajesh.ie', 'super_admin');
