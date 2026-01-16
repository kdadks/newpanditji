-- ============================================================================
-- MIGRATION 21: Seed CMS Pages and Content Sections
-- This migration creates page records and their section structure for CMS
-- ============================================================================

-- Insert core pages (skip if they already exist)
INSERT INTO pages (slug, title, meta_title, meta_description, template_type, is_published, sort_order) VALUES
  ('home', 'Home', 'Pandit Rajesh Joshi - Hindu Priest & Spiritual Guide', 'Experience authentic Hindu ceremonies performed with devotion, wisdom, and centuries-old knowledge by Pandit Rajesh Joshi.', 'home', true, 1),
  ('about', 'About Us', 'About Pandit Rajesh Joshi - Hindu Scholar & Spiritual Guide', 'Meet Rajesh Joshi, Indian-born Irish Industrialist, Hindu scholar, pandit, author, poet, and motivational speaker.', 'about', true, 2),
  ('why-choose-us', 'Why Choose Us', 'Why Choose Pandit Rajesh Joshi for Your Ceremonies', 'Experience the perfect blend of authentic Vedic traditions, scholarly wisdom, and heartfelt devotion.', 'static_content', true, 3),
  ('services', 'Services', 'Hindu Priest Services - Pooja, Sanskar, Paath & More', 'Comprehensive spiritual services from birth ceremonies to final rites, performed with authentic Hindu rituals.', 'services', true, 4),
  ('books', 'Books', 'Books by Rajesh Joshi Ji - Wisdom & Knowledge', 'Explore enlightening works on Hinduism, Yoga, Meditation, and spirituality by Rajesh Joshi Ji.', 'books', true, 5),
  ('gallery', 'Gallery', 'Photo & Video Gallery - Sacred Ceremonies & Events', 'Glimpses of sacred ceremonies, spiritual gatherings, and community service.', 'gallery', true, 6),
  ('testimonials', 'Testimonials', 'Client Testimonials - What Our Community Says', 'Read heartfelt testimonials from families who have experienced our spiritual services.', 'testimonials', true, 7),
  ('charity', 'Charity', 'eYogi Gurukul - Spreading Sanatan Dharma', 'Founded by Rajesh Joshi ji, eYogi Gurukul is dedicated to preserving and propagating the timeless wisdom of Sanatan Dharma.', 'charity', true, 8),
  ('contact', 'Contact', 'Contact Pandit Rajesh Joshi - Book a Consultation', 'Connect with us for traditional ceremonies or spiritual guidance. We are here to serve.', 'contact', true, 9),
  ('blog', 'Blog', 'Spiritual Blog - Articles on Hinduism & Vedic Wisdom', 'Read insightful articles on Hindu philosophy, Vedic traditions, and spiritual guidance.', 'blog', true, 10)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  template_type = EXCLUDED.template_type,
  sort_order = EXCLUDED.sort_order;

-- ============================================================================
-- HOME PAGE SECTIONS
-- ============================================================================

-- Get home page ID and insert sections
DO $$
DECLARE
  v_home_page_id UUID;
BEGIN
  SELECT id INTO v_home_page_id FROM pages WHERE slug = 'home';
  
  IF v_home_page_id IS NOT NULL THEN
    -- Hero Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_home_page_id, 'hero', 'hero', 'Experience Authentic Hindu Ceremonies', 'Traditional Hindu Priest & Spiritual Guide', 
      '{
        "description": "Discover the profound beauty of traditional Hindu rituals performed with devotion, wisdom, and centuries-old knowledge by Pandit Rajesh Joshi.",
        "backgroundImages": [
          "/images/South Asian Temple Complex.png",
          "/images/Golden Temples of Devotion.png",
          "/images/Traditional Altar with Marigold Flowers.png",
          "/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png"
        ],
        "profileImage": "/images/Logo/Raj ji.png",
        "statistics": [
          {"label": "Poojas", "value": "500+"},
          {"label": "Clients", "value": "250+"},
          {"label": "Years", "value": "15+"},
          {"label": "Books", "value": "5"}
        ],
        "ctaButtons": [
          {"text": "About Us", "link": "/about", "variant": "primary"},
          {"text": "Why Choose Us", "link": "/why-choose-us", "variant": "outline"},
          {"text": "Explore Services", "link": "/services", "variant": "outline"}
        ]
      }'::jsonb, 1, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Photo Gallery Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_home_page_id, 'photo_gallery', 'gallery', 'Moments of Devotion & Service', 'Our Journey',
      '{
        "badge": "Our Journey",
        "description": "Glimpses of sacred ceremonies and spiritual gatherings",
        "images": [
          "/images/Raj 1.jpg",
          "/images/Pooja 1.jpg",
          "/images/Raj 2.jpg",
          "/images/Pooja 2.jpg",
          "/images/Raj 3.jpg",
          "/images/Pooja 3.jpg"
        ]
      }'::jsonb, 2, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Services Preview Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_home_page_id, 'services_preview', 'services', 'Comprehensive Spiritual Services', 'Our Sacred Services',
      '{
        "badge": "Our Sacred Services",
        "description": "From birth ceremonies to final rites, we provide authentic Hindu rituals and spiritual guidance for every sacred moment in life.",
        "buttonText": "View All 40+ Services"
      }'::jsonb, 3, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Sacred Spaces Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_home_page_id, 'sacred_spaces', 'image_grid', 'Sacred Spaces',
      '{
        "spaces": [
          {"image": "/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png", "title": "Divine Vaidyanath Temple", "location": "Sacred Hindu Architecture"},
          {"image": "/images/Golden Temples of Devotion.png", "title": "Golden Temples", "location": "Places of Worship & Devotion"},
          {"image": "/images/South Asian Temple Complex.png", "title": "Temple Complex", "location": "Traditional Sacred Grounds"},
          {"image": "/images/Traditional Altar with Marigold Flowers.png", "title": "Sacred Altar", "location": "Adorned with Marigold Flowers"}
        ]
      }'::jsonb, 4, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Feature Cards Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_home_page_id, 'feature_cards', 'features', 'Why Choose Us',
      '{
        "cards": [
          {"title": "Deep Knowledge", "description": "Extensive understanding of Hindu scriptures, rituals, and traditions passed through generations", "icon": "BookOpenText"},
          {"title": "Devotional Service", "description": "Every ceremony performed with genuine devotion, care, and respect for sacred traditions", "icon": "Heart"},
          {"title": "Community Focused", "description": "Dedicated to serving families and communities with accessible spiritual guidance", "icon": "Users"}
        ]
      }'::jsonb, 5, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- CTA Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_home_page_id, 'cta_section', 'cta', 'Ready to Begin Your Spiritual Journey?',
      '{
        "description": "Contact us to discuss your ceremony needs or for spiritual consultation",
        "ctaButtons": [
          {"text": "Get in Touch", "link": "/contact", "variant": "primary"}
        ]
      }'::jsonb, 6, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;
  END IF;
END $$;

-- ============================================================================
-- ABOUT PAGE SECTIONS
-- ============================================================================

DO $$
DECLARE
  v_about_page_id UUID;
BEGIN
  SELECT id INTO v_about_page_id FROM pages WHERE slug = 'about';
  
  IF v_about_page_id IS NOT NULL THEN
    -- Hero Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_about_page_id, 'hero', 'hero', 'Meet Rajesh Joshi', '"eYogi Raj"',
      '{
        "description": "Indian-born Irish Industrialist, Hindu scholar, pandit, author, poet, and motivational speaker bridging ancient wisdom with modern life.",
        "backgroundImages": [
          "/images/South Asian Temple Complex.png",
          "/images/Golden Temples of Devotion.png",
          "/images/Traditional Altar with Marigold Flowers.png",
          "/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png"
        ]
      }'::jsonb, 1, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Profile Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_about_page_id, 'profile', 'profile', 'Rajesh Joshi', '"eYogi Raj"',
      '{
        "profileImage": "/images/Logo/Raj ji.png",
        "badge": "Hindu Scholar & Spiritual Guide",
        "shortBio": "Indian-born Irish Industrialist, Hindu scholar, pandit, author, poet, and motivational speaker bridging ancient wisdom with modern life.",
        "statistics": [
          {"label": "Poojas", "value": "200+"},
          {"label": "Poems", "value": "100+"},
          {"label": "Years Teaching", "value": "10+"},
          {"label": "Books", "value": "6"}
        ],
        "ctaButtons": [
          {"text": "Published Books", "link": "/books", "variant": "primary"},
          {"text": "Charity Work", "link": "/charity", "variant": "outline"},
          {"text": "Testimonials", "link": "/testimonials", "variant": "outline"}
        ]
      }'::jsonb, 2, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Spiritual Journey Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_about_page_id, 'spiritual_journey', 'rich_content', 'The Spiritual Journey',
      '{
        "content": "<p>Over a decade ago, Rajesh Ji''s life took a transformative turn when he experienced stress-induced high blood pressure. Understanding that the root cause was stress and anxiety, he embraced the path of spirituality and Sanatana Dharma. Beginning with meditation, he experienced immediate benefits that revealed the profound science behind the Indian Knowledge System.</p><p>This awakening led him to explore the vast ocean of 10 million scriptures within the Indian Knowledge System.</p><p>Realizing that ancient wisdom of the Indian subcontinent holds solutions for two-thirds of human mind''s problems, he immersed himself in Hindu scriptures: Vedas, Upanishads, Ramayana, Mahabharata, Puranas, Yogic literature, Agama Tantras, and modern interpretations of ancient knowledge. This deep study led him to create his own meditation methodology, the <strong>\"eYogi Yoga and Meditation Guide\"</strong> for beginners.</p><p>Rajesh Ji has conducted <strong>200+ poojas since 2001</strong> alongside his industrial career, performing all ceremonies without any monetary gain. His commitment to Karma Kanda (Daily Rituals) and the power of Bhakti has made him a beacon of authentic Vedic traditions.</p>",
        "meditationPrograms": [
          "Art of Living Sudarshan Kriya",
          "Isha Kriya",
          "Dalai Lama Meditation Programs",
          "Dzogchen Longchen Nyingtik",
          "S.N. Goenka Dhamma Deepa (10 Days)",
          "Ramakrishna Mission Retreats"
        ],
        "literaryContributions": {
          "title": "Literary Contributions",
          "description": "Rajesh Ji has written multiple books on Indian culture and Sanatana Dharma, connecting ancient wisdom to modern science. His books are published with hundreds of physical copies in circulation across Ireland and India.",
          "books": [
            "Hinduism Basics for All",
            "Hinduism and Science",
            "eYogi Yoga & Meditation Guide",
            "Navaratri: The Bhakti of Shakti",
            "Diwali: The Oldest Festival",
            "Leaving Cert Guide (co-authored)"
          ]
        },
        "poetrySection": {
          "title": "Poetry & Public Speaking",
          "description": "Composed 100+ Hindi poems, regularly recited at various prestigious stages in Ireland and USA. As a motivational speaker, Rajesh Ji weaves ancient wisdom into inspiring talks that resonate with modern audiences."
        }
      }'::jsonb, 3, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Expertise Areas
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_about_page_id, 'expertise_areas', 'tags', 'Areas of Expertise',
      '{
        "areas": [
          "Quantum Mechanics",
          "Ancient Scriptures",
          "Indian History",
          "Positive Psychology",
          "Poetry",
          "Yoga & Meditation",
          "Astronomy",
          "Sanatana Dharma"
        ]
      }'::jsonb, 4, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Info Cards
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_about_page_id, 'info_cards', 'cards', 'Background',
      '{
        "cards": [
          {"title": "Academic Excellence", "description": "ME in Electronics Engineering from Dublin City University, Ireland", "badge": "DCU Graduate"},
          {"title": "Irish Industrialist", "description": "Successful industrial career alongside spiritual pursuits and community service", "badge": "Business Leader"},
          {"title": "eYogi Gurukul", "description": "Founded volunteer-based non-profit charity for Indic studies in Ireland (2017)", "badge": "Founder"}
        ]
      }'::jsonb, 5, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Photo Gallery
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_about_page_id, 'photo_gallery', 'gallery', 'Moments of Devotion & Service', 'Our Journey',
      '{
        "badge": "Our Journey",
        "description": "Glimpses of sacred ceremonies, spiritual gatherings, and community service performed with devotion and authenticity",
        "images": [
          {"src": "/images/Raj 1.jpg", "alt": "Rajesh Joshi Ji"},
          {"src": "/images/Pooja 1.jpg", "alt": "Traditional Pooja Ceremony"},
          {"src": "/images/Raj 2.jpg", "alt": "Spiritual Guidance"},
          {"src": "/images/Pooja 2.jpg", "alt": "Hindu Ritual"},
          {"src": "/images/Raj 3.jpg", "alt": "Religious Ceremony"},
          {"src": "/images/Pooja 3.jpg", "alt": "Sacred Ritual"}
        ]
      }'::jsonb, 6, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- What to Expect
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_about_page_id, 'what_to_expect', 'features', 'What to Expect When You Invite Rajesh Ji', 'What Makes Rajesh Ji Unique',
      '{
        "badge": "What Makes Rajesh Ji Unique",
        "description": "When you invite Rajesh Ji to perform a pooja, he comes as a complete package - blending deep scholarship, authentic rituals, and modern relevance in a way that touches hearts and minds.",
        "features": [
          {"title": "Deep Knowledge of Sanatana Dharma", "description": "Scholar of Indian Knowledge System with extensive study of Vedas, Upanishads, Puranas, and Itihasas. He quotes exact references and explains the meaning and context."},
          {"title": "Ancient Wisdom Meets Modern Science", "description": "Bridges ancient spiritual practices with quantum mechanics, astronomy, and positive psychology, making traditions relevant for contemporary understanding."},
          {"title": "Complete Pooja Explanation", "description": "Every step of the pooja is explained - why we do it, what it means, and how it relates to modern life. No ritual is performed without understanding."},
          {"title": "Special Connection with Children", "description": "Having taught hundreds of children (ages 4-18) through eYogi Gurukul, he knows how to engage young minds. Kids are typically glued to the pooja in his presence."},
          {"title": "Authentic Vedic Rituals", "description": "Performs poojas as per Shastras with exact scriptural references. You will know which verse comes from which scripture and its precise meaning."},
          {"title": "Motivational & Inspiring", "description": "As a motivational speaker, his subtle messages bind families together. He weaves words with examples that rejuvenate relationships and inspire spiritual growth."},
          {"title": "Creating Sacred Environments", "description": "Rajesh Ji creates an atmosphere of purity, bhakti, and devotion that leaves forever imprints in the minds of the Yajamana (host). His presence brings families and friends together, encouraging spiritual growth while fostering harmony and understanding."}
        ]
      }'::jsonb, 7, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Community Service
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_about_page_id, 'community_service', 'services', 'Seva and Social Impact', 'Community Service',
      '{
        "badge": "Community Service",
        "services": [
          {"title": "One Notary One Gita Project", "description": "A unique community service initiative aimed at spreading the wisdom of the Bhagavad Gita to communities across Ireland, making ancient wisdom accessible to all."},
          {"title": "Seva Without Monetary Gain", "description": "Rajesh Ji strongly believes in the power of Bhakti and selfless service. All 200+ poojas performed since 2001 have been conducted alongside his industrial career without taking any monetary gains for himself - a true testament to his dedication to spiritual service."}
        ]
      }'::jsonb, 8, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;
  END IF;
END $$;

-- ============================================================================
-- WHY CHOOSE US PAGE SECTIONS
-- ============================================================================

DO $$
DECLARE
  v_whychoose_page_id UUID;
BEGIN
  SELECT id INTO v_whychoose_page_id FROM pages WHERE slug = 'why-choose-us';
  
  IF v_whychoose_page_id IS NOT NULL THEN
    -- Hero Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_whychoose_page_id, 'hero', 'hero', 'Why Choose Pandit Rajesh Joshi', 'Experience the perfect blend of authentic Vedic traditions, scholarly wisdom, and heartfelt devotion',
      '{
        "description": "",
        "backgroundImages": [
          "/images/South Asian Temple Complex.png",
          "/images/Golden Temples of Devotion.png",
          "/images/Traditional Altar with Marigold Flowers.png",
          "/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png"
        ]
      }'::jsonb, 1, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Quick Benefits
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_whychoose_page_id, 'quick_benefits', 'icon_list', 'Quick Benefits',
      '{
        "benefits": [
          {"icon": "Heart", "label": "Genuine Bhakti"},
          {"icon": "GraduationCap", "label": "20+ Years"},
          {"icon": "FlowerLotus", "label": "100% Vedic"},
          {"icon": "ListChecks", "label": "30+ Poojas"},
          {"icon": "UsersFour", "label": "Personalized"},
          {"icon": "Globe", "label": "E-Pooja"}
        ]
      }'::jsonb, 2, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Reasons Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_whychoose_page_id, 'reasons', 'accordion', 'Reasons to Choose Us',
      '{
        "reasons": [
          {
            "title": "Passion – Devotion That Flows From the Heart",
            "description": "Every pooja performed by Rajesh Ji is rooted in genuine bhakti, compassion, and a lifelong commitment to Sanatana Dharma. His spiritual journey began when stress and anxiety once touched his life, leading him towards meditation, scriptures, and inner transformation. This awakening created an unshakeable passion to serve, guide, and uplift families.",
            "impact": "When you invite Rajesh Ji, you receive a priest who brings love, sincerity, and a pure intention into your home—making every ritual emotionally meaningful and spiritually elevating.",
            "highlights": [],
            "shloka": {
              "sanskrit": "मन: प्रसाद: सौम्यत्वं मौनमात्मविनिग्रह: | भावसंशुद्धिरित्येतत्तपो मानसमुच्यते ||",
              "reference": "Bhagavad Gita 17.16",
              "hindi": "मन की शांति, विनम्रता, मौन, आत्म-संयम और पवित्रता को मन की तपस्या कहा जाता है।",
              "english": "Tranquillity of mind, gentleness, silence, self-control and purity of purpose are known as austerities of the mind."
            }
          },
          {
            "title": "Experience & a Scholarly Mind – 20+ Years of Jnana & Seva",
            "description": "Rajesh Ji has been performing poojas since 2001 and is recognised as a scholar of Hinduism and the Indian Knowledge System. With deep study of Vedas, Upanishads, the Puranas, Itihasas, Yogic literature, Tantra texts and 10,000+ years of Indian wisdom, he brings unmatched authenticity to every ritual.",
            "impact": "He does not just perform—he explains the origin of slokas, the meaning behind mantras, and the exact shastric references, blending ancient spiritual wisdom with modern scientific understanding.",
            "highlights": [
              "200+ poojas performed since 2001",
              "Scholar of Vedas, Upanishads, Puranas & Itihasas",
              "Published author of 5+ books on Hinduism",
              "Taught hundreds of students through eYogi Gurukul",
              "Bridges ancient wisdom with modern science"
            ]
          },
          {
            "title": "Authentic & Vedic – No Shortcuts, Only Purity",
            "description": "In an age where many rituals are shortened or diluted, Rajesh Ji stands firm in offering complete, traditional, and Vedic poojas. Every step—from sankalpa to samarpan—is performed with precision, clarity, and devotion.",
            "impact": "He never rushes or skips mantras. Instead, he performs rituals exactly as prescribed in the scriptures, ensuring that the energy, sanctity, and blessings reach your home in their fullest essence.",
            "highlights": [
              "Complete traditional Vedic rituals",
              "Every mantra chanted with precision",
              "Follows scriptural procedures exactly",
              "No shortcuts or dilution of practices",
              "Creates lasting spiritual atmosphere"
            ]
          },
          {
            "title": "Wide Range of Services – Over 30+ Pooja Offerings",
            "description": "From Griha Pravesh to Naamkaran, Satyanarayana Katha to Durga Puja, Lakshmi Puja to Rudrabhishek, Rajesh Ji performs over 30 different poojas and samskaras according to Vedic tradition.",
            "impact": "Whether you want a spiritual ceremony for your family, a sacred function, or a community-level group pooja, you benefit from his broad expertise, clear guidance, and calm leadership.",
            "highlights": [
              "30+ different poojas and samskaras",
              "Family ceremonies to community events",
              "Life cycle rituals from birth to marriage",
              "Festival poojas for all major occasions",
              "Custom ceremonies based on needs"
            ]
          },
          {
            "title": "Convenient & Personalised Rituals – Regional Traditions Honoured",
            "description": "Every Hindu family carries unique customs, regional practices, and ancestral traditions. Rajesh Ji fully respects this diversity. Before each ceremony, he collaborates with the Yajamana (host) to understand their background.",
            "impact": "He then personalises the pooja accordingly, ensuring the rituals feel familiar, comfortable, and authentic to your family roots.",
            "highlights": [
              "Respects all regional traditions",
              "Customizes rituals to family customs",
              "North Indian, South Indian & all regions",
              "Engages children, elders & all guests",
              "Makes everyone feel included"
            ]
          },
          {
            "title": "E-Pooja & Online Options – Connecting Families Worldwide",
            "description": "Distance is no barrier to devotion. For families across Ireland, Europe, India, or anywhere in the world, Rajesh Ji offers E-Pooja (Online Pooja) options.",
            "impact": "Online poojas are conducted with the same sincerity and shastric authenticity, making spiritual connection accessible to all.",
            "highlights": [
              "Students living abroad can participate",
              "Families spread across multiple locations",
              "Health or travel restrictions accommodated",
              "Same authenticity as in-person ceremonies",
              "Available worldwide with digital guidance"
            ]
          }
        ]
      }'::jsonb, 3, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- CTA Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_whychoose_page_id, 'cta_section', 'cta', 'Experience the Difference',
      '{
        "description": "When you choose Rajesh Ji, you are not just booking a priest—you are inviting a scholar, a devotee, and a guide who will make your spiritual ceremony truly unforgettable. Every pooja is performed with authenticity, explained with wisdom, and infused with genuine bhakti.",
        "buttons": [
          {"text": "View All Services", "link": "/services", "variant": "primary"},
          {"text": "Book a Consultation", "link": "/contact", "variant": "outline"}
        ]
      }'::jsonb, 4, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;
  END IF;
END $$;

-- ============================================================================
-- BOOKS PAGE SECTIONS
-- ============================================================================

DO $$
DECLARE
  v_books_page_id UUID;
BEGIN
  SELECT id INTO v_books_page_id FROM pages WHERE slug = 'books';
  
  IF v_books_page_id IS NOT NULL THEN
    -- Hero Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_books_page_id, 'hero', 'hero', 'Books by Rajesh Joshi Ji', 'Wisdom & Knowledge',
      '{
        "description": "Explore enlightening works on Hinduism, Yoga, Meditation, and spirituality.",
        "backgroundImages": []
      }'::jsonb, 1, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;
  END IF;
END $$;

-- ============================================================================
-- CONTACT PAGE SECTIONS
-- ============================================================================

DO $$
DECLARE
  v_contact_page_id UUID;
BEGIN
  SELECT id INTO v_contact_page_id FROM pages WHERE slug = 'contact';
  
  IF v_contact_page_id IS NOT NULL THEN
    -- Hero Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_contact_page_id, 'hero', 'hero', 'Let''s Begin Your Sacred Journey', 'Connect With Us',
      '{
        "description": "Whether you are planning a traditional ceremony or seeking spiritual guidance, we are here to serve.",
        "backgroundImages": [
          "/images/South Asian Temple Complex.png",
          "/images/Golden Temples of Devotion.png",
          "/images/Traditional Altar with Marigold Flowers.png",
          "/images/20251122_1252_Divine Vaidyanath Temple Aura_simple_compose_01kansspg9eems9y5np35d35pt.png"
        ]
      }'::jsonb, 1, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Contact Info Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_contact_page_id, 'contact_info', 'contact', 'Contact Information',
      '{
        "email": "panditjoshirajesh@gmail.com",
        "phone": "+353 123 456 789",
        "whatsapp": "+353 123 456 789",
        "address": "Serving communities worldwide"
      }'::jsonb, 2, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;
  END IF;
END $$;

-- ============================================================================
-- CHARITY PAGE SECTIONS
-- ============================================================================

DO $$
DECLARE
  v_charity_page_id UUID;
BEGIN
  SELECT id INTO v_charity_page_id FROM pages WHERE slug = 'charity';
  
  IF v_charity_page_id IS NOT NULL THEN
    -- Hero Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_charity_page_id, 'hero', 'hero', 'eYogi Gurukul', 'Spreading Sanatan Dharma, One Heart at a Time',
      '{
        "badge": "Serving Since 2001",
        "description": "Founded by Rajesh Joshi ji, eYogi Gurukul is dedicated to preserving and propagating the timeless wisdom of Sanatan Dharma through education, service, and community development.",
        "backgroundImages": [
          "/images/South Asian Temple Complex.png",
          "/images/Golden Temples of Devotion.png"
        ]
      }'::jsonb, 1, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Statistics
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_charity_page_id, 'statistics', 'stats', 'Our Impact',
      '{
        "statistics": [
          {"value": "500+", "label": "Students Taught"},
          {"value": "10+", "label": "Countries Reached"},
          {"value": "5+", "label": "Published Books"},
          {"value": "1000+", "label": "Lives Impacted"}
        ]
      }'::jsonb, 2, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Featured Projects
    INSERT INTO page_sections (page_id, section_key, section_type, title, subtitle, content, sort_order, is_visible)
    VALUES (v_charity_page_id, 'featured_projects', 'featured', 'Spreading the Light of Dharma', 'Our Mission',
      '{
        "badge": "Our Mission",
        "description": "eYogi Gurukul offers free spiritual education, distributes sacred texts, and supports temple activities—empowering seekers from all backgrounds to connect with their spiritual roots.",
        "videoUrl": "https://www.youtube.com/watch?v=D4f3cGX9iNg",
        "stats": [
          {"value": "10+", "label": "Years of Service"},
          {"value": "24/7", "label": "Spiritual Support"},
          {"value": "100%", "label": "Free Education"}
        ]
      }'::jsonb, 3, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Service Areas
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_charity_page_id, 'service_areas', 'services', 'Service Areas',
      '{
        "areas": [
          {"icon": "BookOpenText", "title": "Scripture Distribution", "description": "Distributing sacred Hindu texts including Bhagavad Gita, Ramayana, and Upanishads to temples, institutions, and individuals worldwide.", "stats": "5,000+ Texts"},
          {"icon": "GraduationCap", "title": "Community Education", "description": "Online and offline classes on Vedic scriptures, Sanskrit mantras, meditation techniques, and Hindu philosophy for all ages.", "stats": "500+ Students"},
          {"icon": "Heart", "title": "Spiritual Support", "description": "Providing free spiritual counselling, guidance for religious ceremonies, and support during life transitions and challenging times.", "stats": "Always Available"}
        ]
      }'::jsonb, 4, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- Mission Statement
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_charity_page_id, 'mission_statement', 'mission', 'Why We Serve',
      '{
        "description": "At the heart of eYogi Gurukul lies a simple yet profound mission: to make the transformative knowledge of Sanatan Dharma accessible to everyone, regardless of background or means.",
        "features": [
          {"icon": "Sparkle", "title": "Preserving Ancient Wisdom", "description": "Safeguarding traditional Vedic knowledge for future generations"},
          {"icon": "Globe", "title": "Global Outreach", "description": "Connecting seekers worldwide through online platforms and resources"},
          {"icon": "Heart", "title": "Selfless Service (Seva)", "description": "All our educational services are offered freely as an act of devotion"}
        ]
      }'::jsonb, 5, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;

    -- CTA Section
    INSERT INTO page_sections (page_id, section_key, section_type, title, content, sort_order, is_visible)
    VALUES (v_charity_page_id, 'cta_section', 'cta', 'Support Our Mission',
      '{
        "description": "Your contribution helps us continue spreading the light of Sanatan Dharma and supporting seekers on their spiritual journey.",
        "buttons": [
          {"text": "Make a Donation", "link": "/contact", "variant": "primary"},
          {"text": "Volunteer With Us", "link": "/contact", "variant": "outline"},
          {"text": "Learn More", "link": "/about", "variant": "outline"}
        ]
      }'::jsonb, 6, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET content = EXCLUDED.content;
  END IF;
END $$;

-- ============================================================================
-- Update timestamps trigger for page_sections
-- ============================================================================

CREATE OR REPLACE FUNCTION update_page_sections_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

DROP TRIGGER IF EXISTS update_page_sections_timestamp ON page_sections;
CREATE TRIGGER update_page_sections_timestamp
  BEFORE UPDATE ON page_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_page_sections_timestamp();

-- Grant permissions
GRANT SELECT ON pages TO anon;
GRANT SELECT ON page_sections TO anon;
GRANT ALL ON pages TO authenticated;
GRANT ALL ON page_sections TO authenticated;
