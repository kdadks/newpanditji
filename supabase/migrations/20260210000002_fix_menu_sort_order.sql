-- Fix sort_order gaps in header menu to have continuous sequence
-- This ensures proper menu ordering without gaps

DO $$
DECLARE
  v_header_menu_id UUID := '4bb85acc-2e5d-4a5a-a4b9-8a6075af712e';
BEGIN
  -- Update top-level items to have continuous sort order
  UPDATE menu_items 
  SET sort_order = 0, updated_at = NOW()
  WHERE id = '682ce2fe-f4ee-4530-a509-42b97b2d2bf0'; -- Home

  UPDATE menu_items 
  SET sort_order = 1, updated_at = NOW()
  WHERE id = '312d9085-60cd-445e-b077-0c0c4cdf178a'; -- Services

  UPDATE menu_items 
  SET sort_order = 2, updated_at = NOW()
  WHERE id = '165fad44-4d8c-4a44-9aa8-ef77c1f7c5cf'; -- About

  UPDATE menu_items 
  SET sort_order = 3, updated_at = NOW()
  WHERE id = '887915ed-f5b4-47d6-ab91-0c5e743be99b'; -- Dakshina

  UPDATE menu_items 
  SET sort_order = 4, updated_at = NOW()
  WHERE id = '95cf7e06-c7d6-4fa8-8d6a-bac339a8e865'; -- Gallery

  UPDATE menu_items 
  SET sort_order = 5, updated_at = NOW()
  WHERE id = 'ed631b7a-ac3f-4df0-81b8-e0cc802bf15a'; -- Blog

  UPDATE menu_items 
  SET sort_order = 6, updated_at = NOW()
  WHERE id = 'c933b33e-e17b-4870-a9aa-72fcd3b1c171'; -- Testimonials

  UPDATE menu_items 
  SET sort_order = 7, updated_at = NOW()
  WHERE id = '150fccfa-a650-47a2-8741-6932ee317b86'; -- Contact

  -- Update submenu items (keep them at 11-14)
  UPDATE menu_items 
  SET sort_order = 11, updated_at = NOW()
  WHERE id = 'aa7be2e6-0b56-4085-ab68-1418335ba812'; -- About Us

  UPDATE menu_items 
  SET sort_order = 12, updated_at = NOW()
  WHERE id = 'e96f4232-03b3-4a7d-86b4-aa3a82b6e537'; -- Why Choose Us

  UPDATE menu_items 
  SET sort_order = 13, updated_at = NOW()
  WHERE id = '3c7806ae-c03a-44d7-9726-bd2ba2254cb8'; -- Books

  UPDATE menu_items 
  SET sort_order = 14, updated_at = NOW()
  WHERE id = '5200fa7e-f6ae-4f84-933d-74b5e5b56151'; -- Charity Work

  RAISE NOTICE 'Menu sort order fixed successfully';
END $$;
