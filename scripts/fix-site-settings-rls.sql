-- Fix RLS policies for site_settings table
-- Run in: Supabase Dashboard → SQL Editor

-- Ensure RLS is enabled
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop any old/conflicting policies
DROP POLICY IF EXISTS site_settings_admin_all ON site_settings;
DROP POLICY IF EXISTS site_settings_anon_read ON site_settings;
DROP POLICY IF EXISTS site_settings_public_read ON site_settings;

-- Authenticated users (logged-in admins) can do everything
CREATE POLICY site_settings_admin_all ON site_settings
  FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Public (anon) users can only read
CREATE POLICY site_settings_anon_read ON site_settings
  FOR SELECT TO anon
  USING (true);

-- Verify policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'site_settings';
