-- Cleanup duplicate menu items and restructure properly
-- This fixes the duplication issue by converting existing top-level items to submenus

DO $$
DECLARE
  v_main_menu_id UUID := '4bb85acc-2e5d-4a5a-a4b9-8a6075af712e';
  v_about_item_id UUID := '165fad44-4d8c-4a44-9aa8-ef77c1f7c5cf';
  v_books_top_level_id UUID := '3c7806ae-c03a-44d7-9726-bd2ba2254cb8';
  v_charity_top_level_id UUID := '5200fa7e-f6ae-4f84-933d-74b5e5b56151';
BEGIN
  -- Step 1: Delete the duplicate submenu items that were just created
  DELETE FROM menu_items 
  WHERE menu_id = v_main_menu_id 
  AND parent_id = v_about_item_id
  AND label IN ('Books', 'Charity Work')
  AND created_at::date = CURRENT_DATE;
  
  RAISE NOTICE 'Deleted duplicate submenu items created today';

  -- Step 2: Convert the original top-level "Books" to a submenu of About
  UPDATE menu_items 
  SET 
    parent_id = v_about_item_id,
    sort_order = 13,
    updated_at = NOW()
  WHERE id = v_books_top_level_id;
  
  RAISE NOTICE 'Converted Books to submenu of About';

  -- Step 3: Convert the original top-level "Charity" to a submenu of About and rename it
  UPDATE menu_items 
  SET 
    parent_id = v_about_item_id,
    label = 'Charity Work',
    sort_order = 14,
    updated_at = NOW()
  WHERE id = v_charity_top_level_id;
  
  RAISE NOTICE 'Converted Charity to "Charity Work" submenu of About';

  -- Step 4: Delete any duplicate Testimonials (keep original if exists, delete today's creation)
  DELETE FROM menu_items 
  WHERE menu_id = v_main_menu_id 
  AND label = 'Testimonials'
  AND parent_id IS NULL
  AND created_at::date = CURRENT_DATE;
  
  RAISE NOTICE 'Deleted duplicate Testimonials';

  -- Step 5: Ensure Testimonials exists as top-level (if not already present)
  INSERT INTO menu_items (menu_id, label, url, sort_order, is_visible, parent_id, target, css_class) 
  SELECT v_main_menu_id, 'Testimonials', '/testimonials', 8, true, NULL, '_self', NULL
  WHERE NOT EXISTS (
    SELECT 1 FROM menu_items 
    WHERE menu_id = v_main_menu_id 
    AND label = 'Testimonials' 
    AND parent_id IS NULL
  );

  -- Step 6: Final sort order adjustment to ensure proper sequence
  -- Home=0, About=1, Services=2, Gallery=3, Dakshina=4, Blog=5, Testimonials=8, Contact=9
  UPDATE menu_items SET sort_order = 5, updated_at = NOW() 
  WHERE id = 'ed631b7a-ac3f-4df0-81b8-e0cc802bf15a'; -- Blog
  
  UPDATE menu_items SET sort_order = 8, updated_at = NOW() 
  WHERE menu_id = v_main_menu_id AND label = 'Testimonials' AND parent_id IS NULL;
  
  UPDATE menu_items SET sort_order = 9, updated_at = NOW() 
  WHERE id = '150fccfa-a650-47a2-8741-6932ee317b86'; -- Contact

  RAISE NOTICE 'Menu cleanup completed successfully';
  RAISE NOTICE 'Top-level items: %', 
    (SELECT COUNT(*) FROM menu_items WHERE menu_id = v_main_menu_id AND parent_id IS NULL);
  RAISE NOTICE 'Submenu items under About: %', 
    (SELECT COUNT(*) FROM menu_items WHERE menu_id = v_main_menu_id AND parent_id = v_about_item_id);

END $$;
