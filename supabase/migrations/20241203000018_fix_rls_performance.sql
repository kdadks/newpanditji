-- ============================================================================
-- MIGRATION 18: Fix RLS Performance Issues
-- ============================================================================
-- This migration fixes two performance issues flagged by Supabase linter:
-- 1. auth_rls_initplan: Replace auth.<function>() with (select auth.<function>())
-- 2. multiple_permissive_policies: Consolidate overlapping SELECT policies
-- ============================================================================

-- ============================================================================
-- DROP EXISTING POLICIES (to recreate with optimizations)
-- ============================================================================

-- Admin policies with auth.uid() that need optimization
DROP POLICY IF EXISTS admin_users_admin_all ON admin_users;
DROP POLICY IF EXISTS admin_sessions_admin_all ON admin_sessions;
DROP POLICY IF EXISTS activity_logs_admin_all ON activity_logs;
DROP POLICY IF EXISTS pages_admin_all ON pages;
DROP POLICY IF EXISTS page_sections_admin_all ON page_sections;
DROP POLICY IF EXISTS service_categories_admin_all ON service_categories;
DROP POLICY IF EXISTS services_admin_all ON services;
DROP POLICY IF EXISTS blog_categories_admin_all ON blog_categories;
DROP POLICY IF EXISTS blog_posts_admin_all ON blog_posts;
DROP POLICY IF EXISTS blog_tags_admin_all ON blog_tags;
DROP POLICY IF EXISTS blog_post_tags_admin_all ON blog_post_tags;
DROP POLICY IF EXISTS media_files_admin_all ON media_files;
DROP POLICY IF EXISTS photo_galleries_admin_all ON photo_galleries;
DROP POLICY IF EXISTS gallery_photos_admin_all ON gallery_photos;
DROP POLICY IF EXISTS videos_admin_all ON videos;
DROP POLICY IF EXISTS charity_projects_admin_all ON charity_projects;
DROP POLICY IF EXISTS testimonials_admin_all ON testimonials;
DROP POLICY IF EXISTS books_admin_all ON books;
DROP POLICY IF EXISTS contact_inquiries_admin_all ON contact_inquiries;
DROP POLICY IF EXISTS seo_settings_admin_all ON seo_settings;
DROP POLICY IF EXISTS seo_redirects_admin_all ON seo_redirects;
DROP POLICY IF EXISTS page_views_admin_read ON page_views;
DROP POLICY IF EXISTS analytics_summary_admin_all ON analytics_summary;
DROP POLICY IF EXISTS cookie_categories_admin_all ON cookie_categories;
DROP POLICY IF EXISTS cookies_admin_all ON cookies;
DROP POLICY IF EXISTS user_cookie_consents_admin_read ON user_cookie_consents;
DROP POLICY IF EXISTS cookie_policy_versions_admin_all ON cookie_policy_versions;
DROP POLICY IF EXISTS site_settings_admin_all ON site_settings;
DROP POLICY IF EXISTS menus_admin_all ON menus;
DROP POLICY IF EXISTS menu_items_admin_all ON menu_items;

-- Public read policies that overlap with admin policies (causing multiple_permissive_policies)
DROP POLICY IF EXISTS pages_public_read ON pages;
DROP POLICY IF EXISTS page_sections_public_read ON page_sections;
DROP POLICY IF EXISTS service_categories_public_read ON service_categories;
DROP POLICY IF EXISTS services_public_read ON services;
DROP POLICY IF EXISTS blog_categories_public_read ON blog_categories;
DROP POLICY IF EXISTS blog_posts_public_read ON blog_posts;
DROP POLICY IF EXISTS blog_tags_public_read ON blog_tags;
DROP POLICY IF EXISTS blog_post_tags_public_read ON blog_post_tags;
DROP POLICY IF EXISTS photo_galleries_public_read ON photo_galleries;
DROP POLICY IF EXISTS gallery_photos_public_read ON gallery_photos;
DROP POLICY IF EXISTS videos_public_read ON videos;
DROP POLICY IF EXISTS charity_projects_public_read ON charity_projects;
DROP POLICY IF EXISTS testimonials_public_read ON testimonials;
DROP POLICY IF EXISTS books_public_read ON books;
DROP POLICY IF EXISTS seo_settings_public_read ON seo_settings;
DROP POLICY IF EXISTS seo_redirects_public_read ON seo_redirects;
DROP POLICY IF EXISTS cookie_categories_public_read ON cookie_categories;
DROP POLICY IF EXISTS cookies_public_read ON cookies;
DROP POLICY IF EXISTS cookie_policy_versions_public_read ON cookie_policy_versions;
DROP POLICY IF EXISTS site_settings_public_read ON site_settings;
DROP POLICY IF EXISTS menus_public_read ON menus;
DROP POLICY IF EXISTS menu_items_public_read ON menu_items;

-- Public insert policies that overlap with admin policies
DROP POLICY IF EXISTS contact_inquiries_public_insert ON contact_inquiries;

-- Drop anon policies if they already exist (in case of re-run)
DROP POLICY IF EXISTS pages_anon_read ON pages;
DROP POLICY IF EXISTS page_sections_anon_read ON page_sections;
DROP POLICY IF EXISTS service_categories_anon_read ON service_categories;
DROP POLICY IF EXISTS services_anon_read ON services;
DROP POLICY IF EXISTS blog_categories_anon_read ON blog_categories;
DROP POLICY IF EXISTS blog_posts_anon_read ON blog_posts;
DROP POLICY IF EXISTS blog_tags_anon_read ON blog_tags;
DROP POLICY IF EXISTS blog_post_tags_anon_read ON blog_post_tags;
DROP POLICY IF EXISTS photo_galleries_anon_read ON photo_galleries;
DROP POLICY IF EXISTS gallery_photos_anon_read ON gallery_photos;
DROP POLICY IF EXISTS videos_anon_read ON videos;
DROP POLICY IF EXISTS charity_projects_anon_read ON charity_projects;
DROP POLICY IF EXISTS testimonials_anon_read ON testimonials;
DROP POLICY IF EXISTS books_anon_read ON books;
DROP POLICY IF EXISTS seo_settings_anon_read ON seo_settings;
DROP POLICY IF EXISTS seo_redirects_anon_read ON seo_redirects;
DROP POLICY IF EXISTS cookie_categories_anon_read ON cookie_categories;
DROP POLICY IF EXISTS cookies_anon_read ON cookies;
DROP POLICY IF EXISTS cookie_policy_versions_anon_read ON cookie_policy_versions;
DROP POLICY IF EXISTS site_settings_anon_read ON site_settings;
DROP POLICY IF EXISTS menus_anon_read ON menus;
DROP POLICY IF EXISTS menu_items_anon_read ON menu_items;
DROP POLICY IF EXISTS contact_inquiries_anon_insert ON contact_inquiries;

-- ============================================================================
-- RECREATE ADMIN POLICIES WITH OPTIMIZED auth.uid() CALLS
-- Using (select auth.uid()) instead of auth.uid() for performance
-- Restricting to 'authenticated' role to avoid overlap with anon policies
-- ============================================================================

-- Admin Users: Full access for authenticated admins
CREATE POLICY admin_users_admin_all ON admin_users
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Admin Sessions: Full access for authenticated admins
CREATE POLICY admin_sessions_admin_all ON admin_sessions
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Activity Logs: Full access for authenticated admins
CREATE POLICY activity_logs_admin_all ON activity_logs
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Pages: Full access for authenticated admins
CREATE POLICY pages_admin_all ON pages
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Page Sections: Full access for authenticated admins
CREATE POLICY page_sections_admin_all ON page_sections
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Service Categories: Full access for authenticated admins
CREATE POLICY service_categories_admin_all ON service_categories
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Services: Full access for authenticated admins
CREATE POLICY services_admin_all ON services
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Blog Categories: Full access for authenticated admins
CREATE POLICY blog_categories_admin_all ON blog_categories
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Blog Posts: Full access for authenticated admins
CREATE POLICY blog_posts_admin_all ON blog_posts
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Blog Tags: Full access for authenticated admins
CREATE POLICY blog_tags_admin_all ON blog_tags
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Blog Post Tags: Full access for authenticated admins
CREATE POLICY blog_post_tags_admin_all ON blog_post_tags
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Media Files: Full access for authenticated admins
CREATE POLICY media_files_admin_all ON media_files
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Photo Galleries: Full access for authenticated admins
CREATE POLICY photo_galleries_admin_all ON photo_galleries
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Gallery Photos: Full access for authenticated admins
CREATE POLICY gallery_photos_admin_all ON gallery_photos
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Videos: Full access for authenticated admins
CREATE POLICY videos_admin_all ON videos
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Charity Projects: Full access for authenticated admins
CREATE POLICY charity_projects_admin_all ON charity_projects
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Testimonials: Full access for authenticated admins
CREATE POLICY testimonials_admin_all ON testimonials
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Books: Full access for authenticated admins
CREATE POLICY books_admin_all ON books
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Contact Inquiries: Full access for authenticated admins
CREATE POLICY contact_inquiries_admin_all ON contact_inquiries
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- SEO Settings: Full access for authenticated admins
CREATE POLICY seo_settings_admin_all ON seo_settings
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- SEO Redirects: Full access for authenticated admins
CREATE POLICY seo_redirects_admin_all ON seo_redirects
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Page Views: Read access for authenticated admins
CREATE POLICY page_views_admin_read ON page_views
  FOR SELECT TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- Analytics Summary: Full access for authenticated admins
CREATE POLICY analytics_summary_admin_all ON analytics_summary
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Cookie Categories: Full access for authenticated admins
CREATE POLICY cookie_categories_admin_all ON cookie_categories
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Cookies: Full access for authenticated admins
CREATE POLICY cookies_admin_all ON cookies
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- User Cookie Consents: Read access for authenticated admins
CREATE POLICY user_cookie_consents_admin_read ON user_cookie_consents
  FOR SELECT TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- Cookie Policy Versions: Full access for authenticated admins
CREATE POLICY cookie_policy_versions_admin_all ON cookie_policy_versions
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Site Settings: Full access for authenticated admins
CREATE POLICY site_settings_admin_all ON site_settings
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Menus: Full access for authenticated admins
CREATE POLICY menus_admin_all ON menus
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Menu Items: Full access for authenticated admins
CREATE POLICY menu_items_admin_all ON menu_items
  FOR ALL TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- ============================================================================
-- RECREATE PUBLIC READ POLICIES (using anon role to avoid overlap with admin)
-- These use RESTRICTIVE type to work alongside admin policies without overlap
-- ============================================================================

-- Pages: Public read for published pages (anon only)
CREATE POLICY pages_anon_read ON pages
  FOR SELECT TO anon
  USING (is_published = true);

-- Page Sections: Public read for visible sections of published pages (anon only)
CREATE POLICY page_sections_anon_read ON page_sections
  FOR SELECT TO anon
  USING (
    is_visible = true AND
    EXISTS (SELECT 1 FROM pages WHERE pages.id = page_sections.page_id AND pages.is_published = true)
  );

-- Service Categories: Public read for active categories (anon only)
CREATE POLICY service_categories_anon_read ON service_categories
  FOR SELECT TO anon
  USING (is_active = true);

-- Services: Public read for published services (anon only)
CREATE POLICY services_anon_read ON services
  FOR SELECT TO anon
  USING (is_published = true);

-- Blog Categories: Public read for active categories (anon only)
CREATE POLICY blog_categories_anon_read ON blog_categories
  FOR SELECT TO anon
  USING (is_active = true);

-- Blog Posts: Public read for published posts (anon only)
CREATE POLICY blog_posts_anon_read ON blog_posts
  FOR SELECT TO anon
  USING (status = 'published' AND published_at <= NOW());

-- Blog Tags: Public read (anon only)
CREATE POLICY blog_tags_anon_read ON blog_tags
  FOR SELECT TO anon
  USING (true);

-- Blog Post Tags: Public read (anon only)
CREATE POLICY blog_post_tags_anon_read ON blog_post_tags
  FOR SELECT TO anon
  USING (true);

-- Photo Galleries: Public read for published galleries (anon only)
CREATE POLICY photo_galleries_anon_read ON photo_galleries
  FOR SELECT TO anon
  USING (is_published = true);

-- Gallery Photos: Public read for photos in published galleries (anon only)
CREATE POLICY gallery_photos_anon_read ON gallery_photos
  FOR SELECT TO anon
  USING (
    EXISTS (SELECT 1 FROM photo_galleries WHERE photo_galleries.id = gallery_photos.gallery_id AND photo_galleries.is_published = true)
  );

-- Videos: Public read for published videos (anon only)
CREATE POLICY videos_anon_read ON videos
  FOR SELECT TO anon
  USING (is_published = true);

-- Charity Projects: Public read for published projects (anon only)
CREATE POLICY charity_projects_anon_read ON charity_projects
  FOR SELECT TO anon
  USING (is_published = true);

-- Testimonials: Public read for approved testimonials (anon only)
CREATE POLICY testimonials_anon_read ON testimonials
  FOR SELECT TO anon
  USING (is_approved = true);

-- Books: Public read for published books (anon only)
CREATE POLICY books_anon_read ON books
  FOR SELECT TO anon
  USING (is_published = true);

-- SEO Settings: Public read (anon only)
CREATE POLICY seo_settings_anon_read ON seo_settings
  FOR SELECT TO anon
  USING (true);

-- SEO Redirects: Public read for active redirects (anon only)
CREATE POLICY seo_redirects_anon_read ON seo_redirects
  FOR SELECT TO anon
  USING (is_active = true);

-- Cookie Categories: Public read for active categories (anon only)
CREATE POLICY cookie_categories_anon_read ON cookie_categories
  FOR SELECT TO anon
  USING (is_active = true);

-- Cookies: Public read for active cookies (anon only)
CREATE POLICY cookies_anon_read ON cookies
  FOR SELECT TO anon
  USING (is_active = true);

-- Cookie Policy Versions: Public read for active versions (anon only)
CREATE POLICY cookie_policy_versions_anon_read ON cookie_policy_versions
  FOR SELECT TO anon
  USING (is_active = true);

-- Site Settings: Public read (anon only)
CREATE POLICY site_settings_anon_read ON site_settings
  FOR SELECT TO anon
  USING (true);

-- Menus: Public read for active menus (anon only)
CREATE POLICY menus_anon_read ON menus
  FOR SELECT TO anon
  USING (is_active = true);

-- Menu Items: Public read for visible items (anon only)
CREATE POLICY menu_items_anon_read ON menu_items
  FOR SELECT TO anon
  USING (
    is_visible = true AND
    EXISTS (SELECT 1 FROM menus WHERE menus.id = menu_items.menu_id AND menus.is_active = true)
  );

-- ============================================================================
-- PUBLIC INSERT POLICIES (anon role only to avoid overlap)
-- ============================================================================

-- Contact Inquiries: Public insert (anon only)
CREATE POLICY contact_inquiries_anon_insert ON contact_inquiries
  FOR INSERT TO anon
  WITH CHECK (true);

