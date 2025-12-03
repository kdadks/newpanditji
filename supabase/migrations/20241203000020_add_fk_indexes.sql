-- ============================================================================
-- MIGRATION 20: Add Indexes for Foreign Keys
-- ============================================================================
-- This migration adds indexes for foreign key columns that were missing,
-- which improves JOIN and DELETE performance
-- ============================================================================

-- blog_posts foreign keys
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_by ON blog_posts(created_by);
CREATE INDEX IF NOT EXISTS idx_blog_posts_updated_by ON blog_posts(updated_by);

-- books foreign keys
CREATE INDEX IF NOT EXISTS idx_books_created_by ON books(created_by);

-- charity_projects foreign keys
CREATE INDEX IF NOT EXISTS idx_charity_projects_created_by ON charity_projects(created_by);

-- contact_inquiries foreign keys
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_responded_by ON contact_inquiries(responded_by);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_service_id ON contact_inquiries(service_id);

-- cookie_policy_versions foreign keys
CREATE INDEX IF NOT EXISTS idx_cookie_policy_versions_created_by ON cookie_policy_versions(created_by);

-- gallery_photos foreign keys
CREATE INDEX IF NOT EXISTS idx_gallery_photos_media_file_id ON gallery_photos(media_file_id);

-- media_files foreign keys
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);

-- menu_items foreign keys
CREATE INDEX IF NOT EXISTS idx_menu_items_page_id ON menu_items(page_id);

-- pages foreign keys
CREATE INDEX IF NOT EXISTS idx_pages_created_by ON pages(created_by);
CREATE INDEX IF NOT EXISTS idx_pages_updated_by ON pages(updated_by);

-- photo_galleries foreign keys
CREATE INDEX IF NOT EXISTS idx_photo_galleries_created_by ON photo_galleries(created_by);

-- seo_redirects foreign keys
CREATE INDEX IF NOT EXISTS idx_seo_redirects_created_by ON seo_redirects(created_by);

-- seo_settings foreign keys
CREATE INDEX IF NOT EXISTS idx_seo_settings_updated_by ON seo_settings(updated_by);

-- services foreign keys
CREATE INDEX IF NOT EXISTS idx_services_created_by ON services(created_by);
CREATE INDEX IF NOT EXISTS idx_services_updated_by ON services(updated_by);

-- site_settings foreign keys
CREATE INDEX IF NOT EXISTS idx_site_settings_updated_by ON site_settings(updated_by);

-- testimonials foreign keys
CREATE INDEX IF NOT EXISTS idx_testimonials_approved_by ON testimonials(approved_by);

-- videos foreign keys
CREATE INDEX IF NOT EXISTS idx_videos_created_by ON videos(created_by);
