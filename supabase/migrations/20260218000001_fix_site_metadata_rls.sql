-- ============================================================================
-- MIGRATION: Fix site_metadata RLS policy
-- The previous policy required auth.uid() to exist in admin_users table,
-- which caused 42501 errors for authenticated admins not in that table.
-- Align with the pattern used by all other admin tables: check auth.uid() IS NOT NULL.
-- ============================================================================

DROP POLICY IF EXISTS site_metadata_admin_all ON site_metadata;

CREATE POLICY site_metadata_admin_all ON site_metadata
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);
