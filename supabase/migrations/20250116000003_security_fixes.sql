-- ============================================================================
-- MIGRATION: Security Fixes for RLS and Function Search Path
-- ============================================================================
-- This migration addresses security linter warnings by:
-- 1. Ensuring RLS is enabled on all public tables
-- 2. Setting search_path on trigger functions to prevent injection attacks
-- ============================================================================

-- Enable RLS on site_settings if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'site_settings' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Fix search_path for update_page_sections_timestamp function
CREATE OR REPLACE FUNCTION update_page_sections_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Fix search_path for update_site_settings_updated_at function
-- (Note: This function is created by the generic update_updated_at_column trigger)
-- We ensure it exists with secure search_path
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- Note: The following warnings are intentional and do not require fixes:
-- - contact_inquiries allows anonymous inserts (contact form submissions)
-- - page_views allows public inserts (analytics tracking)
-- - user_cookie_consents allows public inserts (GDPR compliance)
-- - static_pages allows authenticated users full access (admin functionality)
