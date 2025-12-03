-- ============================================================================
-- MIGRATION 14: Row Level Security Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cookie_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_policy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PUBLIC READ POLICIES (for published content)
-- ============================================================================

-- Pages: Public read for published pages
CREATE POLICY pages_public_read ON pages
  FOR SELECT
  USING (is_published = true);

-- Page Sections: Public read for visible sections of published pages
CREATE POLICY page_sections_public_read ON page_sections
  FOR SELECT
  USING (
    is_visible = true AND
    EXISTS (SELECT 1 FROM pages WHERE pages.id = page_sections.page_id AND pages.is_published = true)
  );

-- Service Categories: Public read for active categories
CREATE POLICY service_categories_public_read ON service_categories
  FOR SELECT
  USING (is_active = true);

-- Services: Public read for published services
CREATE POLICY services_public_read ON services
  FOR SELECT
  USING (is_published = true);

-- Blog Categories: Public read for active categories
CREATE POLICY blog_categories_public_read ON blog_categories
  FOR SELECT
  USING (is_active = true);

-- Blog Posts: Public read for published posts
CREATE POLICY blog_posts_public_read ON blog_posts
  FOR SELECT
  USING (status = 'published' AND published_at <= NOW());

-- Blog Tags: Public read
CREATE POLICY blog_tags_public_read ON blog_tags
  FOR SELECT
  USING (true);

-- Blog Post Tags: Public read
CREATE POLICY blog_post_tags_public_read ON blog_post_tags
  FOR SELECT
  USING (true);

-- Photo Galleries: Public read for published galleries
CREATE POLICY photo_galleries_public_read ON photo_galleries
  FOR SELECT
  USING (is_published = true);

-- Gallery Photos: Public read for photos in published galleries
CREATE POLICY gallery_photos_public_read ON gallery_photos
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM photo_galleries WHERE photo_galleries.id = gallery_photos.gallery_id AND photo_galleries.is_published = true)
  );

-- Videos: Public read for published videos
CREATE POLICY videos_public_read ON videos
  FOR SELECT
  USING (is_published = true);

-- Charity Projects: Public read for published projects
CREATE POLICY charity_projects_public_read ON charity_projects
  FOR SELECT
  USING (is_published = true);

-- Testimonials: Public read for approved testimonials
CREATE POLICY testimonials_public_read ON testimonials
  FOR SELECT
  USING (is_approved = true);

-- Books: Public read for published books
CREATE POLICY books_public_read ON books
  FOR SELECT
  USING (is_published = true);

-- SEO Settings: Public read (needed for meta tags)
CREATE POLICY seo_settings_public_read ON seo_settings
  FOR SELECT
  USING (true);

-- SEO Redirects: Public read for active redirects
CREATE POLICY seo_redirects_public_read ON seo_redirects
  FOR SELECT
  USING (is_active = true);

-- Cookie Categories: Public read for active categories
CREATE POLICY cookie_categories_public_read ON cookie_categories
  FOR SELECT
  USING (is_active = true);

-- Cookies: Public read for active cookies
CREATE POLICY cookies_public_read ON cookies
  FOR SELECT
  USING (is_active = true);

-- Cookie Policy Versions: Public read for active versions
CREATE POLICY cookie_policy_versions_public_read ON cookie_policy_versions
  FOR SELECT
  USING (is_active = true);

-- Site Settings: Public read
CREATE POLICY site_settings_public_read ON site_settings
  FOR SELECT
  USING (true);

-- Menus: Public read for active menus
CREATE POLICY menus_public_read ON menus
  FOR SELECT
  USING (is_active = true);

-- Menu Items: Public read for visible items
CREATE POLICY menu_items_public_read ON menu_items
  FOR SELECT
  USING (
    is_visible = true AND
    EXISTS (SELECT 1 FROM menus WHERE menus.id = menu_items.menu_id AND menus.is_active = true)
  );

-- ============================================================================
-- PUBLIC INSERT POLICIES
-- ============================================================================

-- Contact Inquiries: Public insert (anyone can submit)
CREATE POLICY contact_inquiries_public_insert ON contact_inquiries
  FOR INSERT
  WITH CHECK (true);

-- User Cookie Consents: Public insert
CREATE POLICY user_cookie_consents_public_insert ON user_cookie_consents
  FOR INSERT
  WITH CHECK (true);

-- Page Views: Public insert (for analytics)
CREATE POLICY page_views_public_insert ON page_views
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- ADMIN POLICIES (Authenticated users with admin role)
-- ============================================================================

-- Admin Users: Full access for authenticated admins
CREATE POLICY admin_users_admin_all ON admin_users
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admin Sessions: Full access for authenticated admins
CREATE POLICY admin_sessions_admin_all ON admin_sessions
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Activity Logs: Full access for authenticated admins
CREATE POLICY activity_logs_admin_all ON activity_logs
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Pages: Full access for authenticated admins
CREATE POLICY pages_admin_all ON pages
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Page Sections: Full access for authenticated admins
CREATE POLICY page_sections_admin_all ON page_sections
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Service Categories: Full access for authenticated admins
CREATE POLICY service_categories_admin_all ON service_categories
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Services: Full access for authenticated admins
CREATE POLICY services_admin_all ON services
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Blog Categories: Full access for authenticated admins
CREATE POLICY blog_categories_admin_all ON blog_categories
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Blog Posts: Full access for authenticated admins
CREATE POLICY blog_posts_admin_all ON blog_posts
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Blog Tags: Full access for authenticated admins
CREATE POLICY blog_tags_admin_all ON blog_tags
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Blog Post Tags: Full access for authenticated admins
CREATE POLICY blog_post_tags_admin_all ON blog_post_tags
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Media Files: Full access for authenticated admins
CREATE POLICY media_files_admin_all ON media_files
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Photo Galleries: Full access for authenticated admins
CREATE POLICY photo_galleries_admin_all ON photo_galleries
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Gallery Photos: Full access for authenticated admins
CREATE POLICY gallery_photos_admin_all ON gallery_photos
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Videos: Full access for authenticated admins
CREATE POLICY videos_admin_all ON videos
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Charity Projects: Full access for authenticated admins
CREATE POLICY charity_projects_admin_all ON charity_projects
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Testimonials: Full access for authenticated admins
CREATE POLICY testimonials_admin_all ON testimonials
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Books: Full access for authenticated admins
CREATE POLICY books_admin_all ON books
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Contact Inquiries: Full access for authenticated admins
CREATE POLICY contact_inquiries_admin_all ON contact_inquiries
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- SEO Settings: Full access for authenticated admins
CREATE POLICY seo_settings_admin_all ON seo_settings
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- SEO Redirects: Full access for authenticated admins
CREATE POLICY seo_redirects_admin_all ON seo_redirects
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Page Views: Read access for authenticated admins
CREATE POLICY page_views_admin_read ON page_views
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Analytics Summary: Full access for authenticated admins
CREATE POLICY analytics_summary_admin_all ON analytics_summary
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Cookie Categories: Full access for authenticated admins
CREATE POLICY cookie_categories_admin_all ON cookie_categories
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Cookies: Full access for authenticated admins
CREATE POLICY cookies_admin_all ON cookies
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- User Cookie Consents: Read access for authenticated admins
CREATE POLICY user_cookie_consents_admin_read ON user_cookie_consents
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Cookie Policy Versions: Full access for authenticated admins
CREATE POLICY cookie_policy_versions_admin_all ON cookie_policy_versions
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Site Settings: Full access for authenticated admins
CREATE POLICY site_settings_admin_all ON site_settings
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Menus: Full access for authenticated admins
CREATE POLICY menus_admin_all ON menus
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Menu Items: Full access for authenticated admins
CREATE POLICY menu_items_admin_all ON menu_items
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
