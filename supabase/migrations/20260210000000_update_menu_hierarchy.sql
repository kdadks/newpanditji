-- Update menu items to support hierarchical structure matching the current header
-- This migration adds parent-child relationships to EXISTING menu items without deleting data
-- NOTE: This is superseded by 20260210000001_cleanup_menu_duplicates.sql which handles the conversion properly

DO $$
DECLARE
  v_main_menu_id UUID;
  v_about_item_id UUID;
BEGIN
  -- Check if submenu items already exist - if so, skip this migration
  SELECT id INTO v_main_menu_id FROM menus WHERE location = 'header' AND is_active = true LIMIT 1;
  
  IF v_main_menu_id IS NULL THEN
    RAISE NOTICE 'No active header menu found. Skipping migration.';
    RETURN;
  END IF;

  -- Check if submenu items already exist under About
  IF EXISTS (
    SELECT 1 FROM menu_items 
    WHERE menu_id = v_main_menu_id 
    AND parent_id IS NOT NULL
  ) THEN
    RAISE NOTICE 'Submenu items already exist. Skipping to avoid duplicates. Use cleanup migration instead.';
    RETURN;
  END IF;

  -- Only proceed if no submenu items exist yet
  SELECT id INTO v_about_item_id 
  FROM menu_items 
  WHERE menu_id = v_main_menu_id AND label = 'About' AND parent_id IS NULL;

  IF v_about_item_id IS NULL THEN
    RAISE NOTICE 'About menu item not found. Skipping migration.';
    RETURN;
  END IF;

  -- Add "About Us" and "Why Choose Us" as new submenu items
  -- Note: Books and Charity should be converted from top-level, not created new
  INSERT INTO menu_items (menu_id, label, url, sort_order, is_visible, parent_id, target, css_class) 
  SELECT v_main_menu_id, 'About Us', '/about', 11, true, v_about_item_id, '_self', NULL
  WHERE NOT EXISTS (
    SELECT 1 FROM menu_items 
    WHERE menu_id = v_main_menu_id AND label = 'About Us' AND parent_id = v_about_item_id
  );

  INSERT INTO menu_items (menu_id, label, url, sort_order, is_visible, parent_id, target, css_class) 
  SELECT v_main_menu_id, 'Why Choose Us', '/why-choose-us', 12, true, v_about_item_id, '_self', NULL
  WHERE NOT EXISTS (
    SELECT 1 FROM menu_items 
    WHERE menu_id = v_main_menu_id AND label = 'Why Choose Us' AND parent_id = v_about_item_id
  );

  -- Add Dakshina if it doesn't exist
  INSERT INTO menu_items (menu_id, label, url, sort_order, is_visible, parent_id, target, css_class) 
  SELECT v_main_menu_id, 'Dakshina', '/dakshina', 4, true, NULL, '_self', NULL
  WHERE NOT EXISTS (
    SELECT 1 FROM menu_items 
    WHERE menu_id = v_main_menu_id AND label = 'Dakshina' AND parent_id IS NULL
  );

  RAISE NOTICE 'Basic menu structure added. Run cleanup migration to convert top-level items to submenus.';

END $$;
