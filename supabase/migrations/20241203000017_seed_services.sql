-- ============================================================================
-- MIGRATION 17: Seed Data - Services
-- ============================================================================

-- Get service category IDs and insert services
DO $$
DECLARE
  v_puja_cat_id UUID;
  v_wedding_cat_id UUID;
  v_hawan_cat_id UUID;
  v_life_cat_id UUID;
  v_spiritual_cat_id UUID;
  v_special_cat_id UUID;
BEGIN
  SELECT id INTO v_puja_cat_id FROM service_categories WHERE slug = 'puja-services';
  SELECT id INTO v_wedding_cat_id FROM service_categories WHERE slug = 'wedding-ceremonies';
  SELECT id INTO v_hawan_cat_id FROM service_categories WHERE slug = 'hawan-yagna';
  SELECT id INTO v_life_cat_id FROM service_categories WHERE slug = 'life-events';
  SELECT id INTO v_spiritual_cat_id FROM service_categories WHERE slug = 'spiritual-guidance';
  SELECT id INTO v_special_cat_id FROM service_categories WHERE slug = 'special-ceremonies';

  -- Puja Services
  INSERT INTO services (category_id, name, slug, short_description, full_description, duration, price, is_featured, sort_order) VALUES
    (v_puja_cat_id, 'Satyanarayan Puja', 'satyanarayan-puja', 'Sacred puja for prosperity and well-being', 'The Satyanarayan Puja is a sacred Hindu ritual dedicated to Lord Vishnu. This puja is performed to seek divine blessings for prosperity, health, and happiness.', '2-3 hours', 'Contact for pricing', true, 0),
    (v_puja_cat_id, 'Ganesh Puja', 'ganesh-puja', 'Invoke Lord Ganesha for new beginnings', 'Lord Ganesha is worshipped at the beginning of all auspicious occasions. This puja removes obstacles and brings success in all endeavors.', '1-2 hours', 'Contact for pricing', true, 1),
    (v_puja_cat_id, 'Lakshmi Puja', 'lakshmi-puja', 'Worship of Goddess Lakshmi for wealth', 'Lakshmi Puja is performed to invoke the blessings of Goddess Lakshmi for wealth, prosperity, and good fortune.', '1-2 hours', 'Contact for pricing', true, 2),
    (v_puja_cat_id, 'Durga Puja', 'durga-puja', 'Worship of Goddess Durga for protection', 'Durga Puja celebrates the victory of good over evil. This powerful ceremony invokes divine protection and strength.', '2-3 hours', 'Contact for pricing', false, 3),
    (v_puja_cat_id, 'Saraswati Puja', 'saraswati-puja', 'Worship for knowledge and wisdom', 'Saraswati Puja is dedicated to the Goddess of knowledge, music, and arts. Ideal for students and artists seeking divine guidance.', '1-2 hours', 'Contact for pricing', false, 4),
    (v_puja_cat_id, 'Navgraha Puja', 'navgraha-puja', 'Planetary peace and harmony', 'Navgraha Puja appeases the nine planets and reduces the malefic effects in one''s horoscope.', '2-3 hours', 'Contact for pricing', false, 5),
    (v_puja_cat_id, 'Rudrabhishek', 'rudrabhishek', 'Sacred ritual for Lord Shiva', 'Rudrabhishek is a powerful abhishekam performed on Shiva Lingam with sacred substances for health and prosperity.', '2-4 hours', 'Contact for pricing', true, 6),
    (v_puja_cat_id, 'Vastu Shanti Puja', 'vastu-shanti-puja', 'Harmonize your living space', 'Vastu Shanti Puja removes negative energies from homes and offices, bringing peace and positive vibrations.', '2-3 hours', 'Contact for pricing', false, 7)
  ON CONFLICT (slug) DO NOTHING;

  -- Wedding Ceremonies
  INSERT INTO services (category_id, name, slug, short_description, full_description, duration, price, is_featured, sort_order) VALUES
    (v_wedding_cat_id, 'Hindu Wedding Ceremony', 'hindu-wedding', 'Complete traditional wedding rituals', 'A complete Hindu wedding ceremony including all traditional rituals such as Kanyadaan, Saptapadi, and Mangalsutra.', '3-5 hours', 'Contact for pricing', true, 0),
    (v_wedding_cat_id, 'Engagement Ceremony', 'engagement-ceremony', 'Traditional engagement rituals', 'The engagement ceremony (Sagai) marks the formal agreement between two families with traditional rituals and blessings.', '1-2 hours', 'Contact for pricing', true, 1),
    (v_wedding_cat_id, 'Sangeet Ceremony', 'sangeet-ceremony', 'Pre-wedding celebrations', 'Traditional Sangeet ceremony with religious rituals and blessings before the main wedding event.', '1-2 hours', 'Contact for pricing', false, 2),
    (v_wedding_cat_id, 'Mehndi Ceremony', 'mehndi-ceremony', 'Haldi and Mehndi rituals', 'Traditional Mehndi ceremony with Vedic chanting and blessings for the bride.', '1 hour', 'Contact for pricing', false, 3),
    (v_wedding_cat_id, 'Griha Pravesh (Post Wedding)', 'griha-pravesh-wedding', 'Welcoming the bride home', 'Traditional ceremony for welcoming the bride into her new home with Vedic rituals.', '1-2 hours', 'Contact for pricing', false, 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Hawan & Yagna
  INSERT INTO services (category_id, name, slug, short_description, full_description, duration, price, is_featured, sort_order) VALUES
    (v_hawan_cat_id, 'Hawan Ceremony', 'hawan-ceremony', 'Sacred fire ritual for purification', 'Hawan is a sacred fire ceremony performed to purify the environment and invoke divine blessings.', '1-2 hours', 'Contact for pricing', true, 0),
    (v_hawan_cat_id, 'Yagna', 'yagna', 'Grand fire sacrifice ceremony', 'Yagna is a more elaborate fire sacrifice performed for specific purposes like prosperity, health, or peace.', '3-5 hours', 'Contact for pricing', false, 1),
    (v_hawan_cat_id, 'Ganapati Atharvashirsha Hawan', 'ganapati-hawan', 'Fire ceremony for Lord Ganesha', 'This hawan is performed with Ganapati Atharvashirsha chanting for obstacle removal and success.', '2-3 hours', 'Contact for pricing', false, 2),
    (v_hawan_cat_id, 'Maha Mrityunjaya Hawan', 'maha-mrityunjaya-hawan', 'For health and longevity', 'This powerful hawan invokes Lord Shiva for protection from illness and for longevity.', '2-3 hours', 'Contact for pricing', true, 3)
  ON CONFLICT (slug) DO NOTHING;

  -- Life Events
  INSERT INTO services (category_id, name, slug, short_description, full_description, duration, price, is_featured, sort_order) VALUES
    (v_life_cat_id, 'Namkaran (Naming Ceremony)', 'namkaran', 'Auspicious naming ceremony for newborn', 'The Namkaran ceremony is performed to give a name to the newborn with proper Vedic rituals and blessings.', '1-2 hours', 'Contact for pricing', true, 0),
    (v_life_cat_id, 'Annaprashan', 'annaprashan', 'First rice feeding ceremony', 'Annaprashan marks the beginning of solid food for the baby, performed with traditional rituals.', '1 hour', 'Contact for pricing', false, 1),
    (v_life_cat_id, 'Mundan (First Haircut)', 'mundan', 'Sacred first haircut ceremony', 'The Mundan ceremony is the child''s first haircut, performed at a temple or home with proper rituals.', '1-2 hours', 'Contact for pricing', false, 2),
    (v_life_cat_id, 'Upanayana (Thread Ceremony)', 'upanayana', 'Sacred thread initiation', 'The Upanayana or Janeu ceremony marks the beginning of formal education and spiritual learning.', '2-3 hours', 'Contact for pricing', true, 3),
    (v_life_cat_id, 'Birthday Puja', 'birthday-puja', 'Blessings on your special day', 'Birthday puja is performed to seek divine blessings for health, success, and happiness in the coming year.', '1 hour', 'Contact for pricing', false, 4),
    (v_life_cat_id, 'Anniversary Puja', 'anniversary-puja', 'Celebrate your union with blessings', 'Anniversary puja celebrates the bond of marriage with traditional rituals and blessings for a happy life.', '1-2 hours', 'Contact for pricing', false, 5),
    (v_life_cat_id, 'Shashtipoorthi (60th Birthday)', 'shashtipoorthi', 'Grand 60th birthday celebration', 'Shashtipoorthi is a significant ceremony celebrating 60 years of life with elaborate Vedic rituals.', '3-4 hours', 'Contact for pricing', false, 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Spiritual Guidance
  INSERT INTO services (category_id, name, slug, short_description, full_description, duration, price, is_featured, sort_order) VALUES
    (v_spiritual_cat_id, 'Horoscope Consultation', 'horoscope-consultation', 'Vedic astrology consultation', 'Get detailed insights into your life through Vedic astrology. Analysis of birth chart and personalized guidance.', '1-2 hours', 'Contact for pricing', true, 0),
    (v_spiritual_cat_id, 'Muhurat Selection', 'muhurat-selection', 'Auspicious timing for events', 'Selection of auspicious dates and times for important events like weddings, housewarmings, and new ventures.', '30 mins - 1 hour', 'Contact for pricing', true, 1),
    (v_spiritual_cat_id, 'Spiritual Counseling', 'spiritual-counseling', 'Guidance for life challenges', 'One-on-one spiritual counseling sessions based on Hindu philosophy and Vedic wisdom.', '1 hour', 'Contact for pricing', false, 2),
    (v_spiritual_cat_id, 'Mantra Initiation', 'mantra-initiation', 'Learn sacred mantras', 'Personalized mantra initiation (Diksha) based on your horoscope and spiritual needs.', '1-2 hours', 'Contact for pricing', false, 3)
  ON CONFLICT (slug) DO NOTHING;

  -- Special Ceremonies
  INSERT INTO services (category_id, name, slug, short_description, full_description, duration, price, is_featured, sort_order) VALUES
    (v_special_cat_id, 'Griha Pravesh', 'griha-pravesh', 'Housewarming ceremony', 'The Griha Pravesh ceremony purifies a new home and invites positive energies and divine blessings.', '2-3 hours', 'Contact for pricing', true, 0),
    (v_special_cat_id, 'Office/Shop Opening', 'office-shop-opening', 'Business inauguration ceremony', 'Auspicious ceremony for opening a new business, office, or shop with divine blessings for success.', '1-2 hours', 'Contact for pricing', true, 1),
    (v_special_cat_id, 'Vehicle Puja', 'vehicle-puja', 'Blessing for new vehicle', 'Puja ceremony for new vehicles to ensure safe journeys and protection from accidents.', '30 mins - 1 hour', 'Contact for pricing', false, 2),
    (v_special_cat_id, 'Shradh/Pitra Puja', 'shradh-pitra-puja', 'Ancestral rites and offerings', 'Sacred rituals performed to honor departed ancestors and seek their blessings.', '2-3 hours', 'Contact for pricing', false, 3),
    (v_special_cat_id, 'Kaal Sarp Dosh Puja', 'kaal-sarp-dosh-puja', 'Remedy for Kaal Sarp Dosh', 'Special puja to nullify the effects of Kaal Sarp Dosh in one''s horoscope.', '2-3 hours', 'Contact for pricing', false, 4),
    (v_special_cat_id, 'Pitra Dosh Shanti', 'pitra-dosh-shanti', 'Remedy for ancestral afflictions', 'Puja to pacify Pitra Dosh and receive blessings from ancestors.', '2-3 hours', 'Contact for pricing', false, 5),
    (v_special_cat_id, 'Sunderkand Path', 'sunderkand-path', 'Recitation of Sunderkand', 'Complete recitation of Sunderkand from Ramcharitmanas for fulfillment of wishes.', '2-3 hours', 'Contact for pricing', false, 6),
    (v_special_cat_id, 'Akhand Ramayan Path', 'akhand-ramayan-path', 'Continuous Ramayan recitation', 'Continuous non-stop recitation of the complete Ramayan over 24 hours.', '24 hours', 'Contact for pricing', false, 7)
  ON CONFLICT (slug) DO NOTHING;
END $$;
