-- ============================================================================
-- MIGRATION: Add Pandit Resource Center to header & footer menus
-- ============================================================================
-- Idempotent: only inserts the menu item if it doesn't already exist.

DO $$
DECLARE
  v_header_menu_id UUID;
  v_footer_menu_id UUID;
  v_next_sort INTEGER;
BEGIN
  -- Header menu (matches the lookup the front-end uses: location = 'header')
  SELECT id INTO v_header_menu_id
  FROM menus
  WHERE location = 'header' AND is_active = true
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_header_menu_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM menu_items
      WHERE menu_id = v_header_menu_id
        AND url = '/pandit-resource-center'
    ) THEN
      SELECT COALESCE(MAX(sort_order), -1) + 1
      INTO v_next_sort
      FROM menu_items
      WHERE menu_id = v_header_menu_id AND parent_id IS NULL;

      INSERT INTO menu_items (menu_id, label, url, sort_order, is_visible)
      VALUES (v_header_menu_id, 'Resource Center', '/pandit-resource-center', v_next_sort, true);
    END IF;
  END IF;

  -- Footer menu (optional but useful)
  SELECT id INTO v_footer_menu_id
  FROM menus
  WHERE location = 'footer' AND is_active = true
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_footer_menu_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM menu_items
      WHERE menu_id = v_footer_menu_id
        AND url = '/pandit-resource-center'
    ) THEN
      SELECT COALESCE(MAX(sort_order), -1) + 1
      INTO v_next_sort
      FROM menu_items
      WHERE menu_id = v_footer_menu_id AND parent_id IS NULL;

      INSERT INTO menu_items (menu_id, label, url, sort_order, is_visible)
      VALUES (v_footer_menu_id, 'Resource Center', '/pandit-resource-center', v_next_sort, true);
    END IF;
  END IF;
END $$;
