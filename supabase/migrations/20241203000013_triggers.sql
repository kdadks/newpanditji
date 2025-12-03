-- ============================================================================
-- MIGRATION 13: Database Triggers
-- ============================================================================

-- Trigger: Update timestamps for admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for pages
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for page_sections
DROP TRIGGER IF EXISTS update_page_sections_updated_at ON page_sections;
CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON page_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for service_categories
DROP TRIGGER IF EXISTS update_service_categories_updated_at ON service_categories;
CREATE TRIGGER update_service_categories_updated_at
  BEFORE UPDATE ON service_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for services
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for blog_categories
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for blog_posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for blog_tags
DROP TRIGGER IF EXISTS update_blog_tags_updated_at ON blog_tags;
CREATE TRIGGER update_blog_tags_updated_at
  BEFORE UPDATE ON blog_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for media_files
DROP TRIGGER IF EXISTS update_media_files_updated_at ON media_files;
CREATE TRIGGER update_media_files_updated_at
  BEFORE UPDATE ON media_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for photo_galleries
DROP TRIGGER IF EXISTS update_photo_galleries_updated_at ON photo_galleries;
CREATE TRIGGER update_photo_galleries_updated_at
  BEFORE UPDATE ON photo_galleries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for gallery_photos
DROP TRIGGER IF EXISTS update_gallery_photos_updated_at ON gallery_photos;
CREATE TRIGGER update_gallery_photos_updated_at
  BEFORE UPDATE ON gallery_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for videos
DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for charity_projects
DROP TRIGGER IF EXISTS update_charity_projects_updated_at ON charity_projects;
CREATE TRIGGER update_charity_projects_updated_at
  BEFORE UPDATE ON charity_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for testimonials
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for books
DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for contact_inquiries
DROP TRIGGER IF EXISTS update_contact_inquiries_updated_at ON contact_inquiries;
CREATE TRIGGER update_contact_inquiries_updated_at
  BEFORE UPDATE ON contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for seo_settings
DROP TRIGGER IF EXISTS update_seo_settings_updated_at ON seo_settings;
CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for seo_redirects
DROP TRIGGER IF EXISTS update_seo_redirects_updated_at ON seo_redirects;
CREATE TRIGGER update_seo_redirects_updated_at
  BEFORE UPDATE ON seo_redirects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for cookie_categories
DROP TRIGGER IF EXISTS update_cookie_categories_updated_at ON cookie_categories;
CREATE TRIGGER update_cookie_categories_updated_at
  BEFORE UPDATE ON cookie_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for cookies
DROP TRIGGER IF EXISTS update_cookies_updated_at ON cookies;
CREATE TRIGGER update_cookies_updated_at
  BEFORE UPDATE ON cookies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for site_settings
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for menus
DROP TRIGGER IF EXISTS update_menus_updated_at ON menus;
CREATE TRIGGER update_menus_updated_at
  BEFORE UPDATE ON menus
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update timestamps for menu_items
DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
