-- ============================================================================
-- PANDIT RAJESH JOSHI PLATFORM - DATA MIGRATION & STORAGE REMAPPING
-- Source Schema: public (Legacy database: rhwzwjaqbobmrxmrebht)
-- Target Schema: panditji (Shared database: gsqfaguqsmnuoeuhpxro)
--
-- This script performs:
-- 1. Idempotent Data Transfer from public.* to panditji.*
-- 2. Storage Bucket Prefixing & Object Migration
-- 3. In-Database Media URL Remapping (media -> panditji-media, etc.)
-- 4. User Project Binding in auth.users (Layer 2 binding)
-- ============================================================================

-- ============================================================================
-- STEP 1: MIGRATE DATA FROM public SCHEMA TO panditji SCHEMA
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Starting data migration from public to panditji schema...';

  -- 1.1 Admin Users
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_users') THEN
    INSERT INTO panditji.admin_users (id, email, full_name, avatar_url, role, is_active, last_login_at, created_at, updated_at)
    SELECT id, email, full_name, avatar_url, role, is_active, last_login_at, created_at, updated_at
    FROM public.admin_users
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url,
      role = EXCLUDED.role,
      is_active = EXCLUDED.is_active;
    RAISE NOTICE 'Migrated admin_users';
  END IF;

  -- 1.2 Service Categories
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_categories') THEN
    INSERT INTO panditji.service_categories (id, name, slug, description, icon, color, sort_order, is_active, created_at, updated_at)
    SELECT id, name, slug, description, icon, color, sort_order, is_active, created_at, updated_at
    FROM public.service_categories
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      icon = EXCLUDED.icon,
      color = EXCLUDED.color,
      sort_order = EXCLUDED.sort_order,
      is_active = EXCLUDED.is_active;
    RAISE NOTICE 'Migrated service_categories';
  END IF;

  -- 1.3 Services
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'services') THEN
    INSERT INTO panditji.services (
      id, category_id, name, slug, short_description, full_description,
      duration, price, featured_image_url, samagri_file_url, where_and_who,
      core_aspects, special_notes, is_featured, is_popular, is_published,
      is_package, package_services, package_savings_text, package_highlights,
      view_count, inquiry_count, meta_title, meta_description, meta_keywords,
      sort_order, created_at, updated_at
    )
    SELECT
      id, category_id, name, slug, short_description, full_description,
      duration, price, featured_image_url, samagri_file_url, where_and_who,
      core_aspects, 
      CASE WHEN jsonb_typeof(special_notes::jsonb) IS NOT NULL THEN special_notes::jsonb ELSE NULL END,
      COALESCE(is_featured, false), COALESCE(is_popular, false), COALESCE(is_published, true),
      COALESCE(is_package, false), package_services, package_savings_text, package_highlights,
      COALESCE(view_count, 0), COALESCE(inquiry_count, 0), meta_title, meta_description, meta_keywords,
      COALESCE(sort_order, 0), created_at, updated_at
    FROM public.services
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      category_id = EXCLUDED.category_id,
      short_description = EXCLUDED.short_description,
      full_description = EXCLUDED.full_description,
      duration = EXCLUDED.duration,
      price = EXCLUDED.price,
      featured_image_url = EXCLUDED.featured_image_url,
      samagri_file_url = EXCLUDED.samagri_file_url,
      where_and_who = EXCLUDED.where_and_who,
      core_aspects = EXCLUDED.core_aspects,
      special_notes = EXCLUDED.special_notes,
      is_package = EXCLUDED.is_package,
      package_services = EXCLUDED.package_services,
      package_savings_text = EXCLUDED.package_savings_text,
      package_highlights = EXCLUDED.package_highlights,
      sort_order = EXCLUDED.sort_order;
    RAISE NOTICE 'Migrated services';
  END IF;

  -- 1.4 Service Package Items
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_package_items') THEN
    INSERT INTO panditji.service_package_items (id, package_id, service_id, sort_order, service_snapshot, package_price_override, notes, created_at, updated_at)
    SELECT id, package_id, service_id, sort_order, service_snapshot, package_price_override, notes, created_at, updated_at
    FROM public.service_package_items
    ON CONFLICT (package_id, service_id) DO UPDATE SET
      sort_order = EXCLUDED.sort_order,
      service_snapshot = EXCLUDED.service_snapshot,
      package_price_override = EXCLUDED.package_price_override;
    RAISE NOTICE 'Migrated service_package_items';
  END IF;

  -- 1.5 Blog Categories & Posts
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_categories') THEN
    INSERT INTO panditji.blog_categories (id, name, slug, description, color, sort_order, is_active, created_at, updated_at)
    SELECT id, name, slug, description, color, sort_order, is_active, created_at, updated_at
    FROM public.blog_categories
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description;
    RAISE NOTICE 'Migrated blog_categories';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts') THEN
    INSERT INTO panditji.blog_posts (
      id, category_id, title, slug, excerpt, content, featured_image_url,
      meta_title, meta_description, meta_keywords, canonical_url,
      reading_time_minutes, view_count, status, is_featured, published_at,
      hero_bg_type, hero_bg_value, hero_title_color, hero_title_shadow, hero_meta_color,
      created_by, updated_by, created_at, updated_at
    )
    SELECT
      id, category_id, title, slug, excerpt, content, featured_image_url,
      meta_title, meta_description, meta_keywords, canonical_url,
      reading_time_minutes, COALESCE(view_count, 0), COALESCE(status, 'draft'), COALESCE(is_featured, false), published_at,
      hero_bg_type, hero_bg_value, hero_title_color, hero_title_shadow, hero_meta_color,
      created_by, updated_by, created_at, updated_at
    FROM public.blog_posts
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      excerpt = EXCLUDED.excerpt,
      featured_image_url = EXCLUDED.featured_image_url,
      status = EXCLUDED.status;
    RAISE NOTICE 'Migrated blog_posts';
  END IF;

  -- 1.6 Blog Tags & Blog Post Tags
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_tags') THEN
    INSERT INTO panditji.blog_tags (id, name, slug, usage_count, created_at)
    SELECT id, name, slug, usage_count, created_at
    FROM public.blog_tags
    ON CONFLICT (slug) DO UPDATE SET usage_count = EXCLUDED.usage_count;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_post_tags') THEN
      INSERT INTO panditji.blog_post_tags (post_id, tag_id)
      SELECT post_id, tag_id FROM public.blog_post_tags
      ON CONFLICT (post_id, tag_id) DO NOTHING;
    END IF;
    RAISE NOTICE 'Migrated blog_tags & associations';
  END IF;

  -- 1.7 Media Files & Galleries
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'media_files') THEN
    INSERT INTO panditji.media_files (
      id, file_name, original_name, file_type, mime_type, file_size, file_url,
      thumbnail_url, width, height, duration, alt_text, caption, description,
      folder, tags, usage_count, last_used_at, uploaded_by, created_at, updated_at
    )
    SELECT
      id, file_name, original_name, file_type, mime_type, file_size, file_url,
      thumbnail_url, width, height, duration, alt_text, caption, description,
      folder, tags, usage_count, last_used_at, uploaded_by, created_at, updated_at
    FROM public.media_files
    ON CONFLICT (id) DO UPDATE SET
      file_url = EXCLUDED.file_url,
      thumbnail_url = EXCLUDED.thumbnail_url;
    RAISE NOTICE 'Migrated media_files';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'photo_galleries') THEN
    INSERT INTO panditji.photo_galleries (id, title, slug, description, category, cover_image_url, is_published, sort_order, created_by, created_at, updated_at)
    SELECT id, title, slug, description, category, cover_image_url, is_published, sort_order, created_by, created_at, updated_at
    FROM public.photo_galleries
    ON CONFLICT (slug) DO UPDATE SET cover_image_url = EXCLUDED.cover_image_url;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gallery_photos') THEN
      INSERT INTO panditji.gallery_photos (id, gallery_id, media_file_id, caption, sort_order, created_at)
      SELECT id, gallery_id, media_file_id, caption, sort_order, created_at
      FROM public.gallery_photos
      ON CONFLICT (id) DO NOTHING;
    END IF;
    RAISE NOTICE 'Migrated photo_galleries and photos';
  END IF;

  -- 1.8 Videos
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'videos') THEN
    INSERT INTO panditji.videos (id, title, slug, description, video_url, thumbnail_url, category, duration, view_count, is_featured, is_published, sort_order, created_by, created_at, updated_at)
    SELECT id, title, slug, description, video_url, thumbnail_url, category, duration, view_count, is_featured, is_published, sort_order, created_by, created_at, updated_at
    FROM public.videos
    ON CONFLICT (slug) DO UPDATE SET
      video_url = EXCLUDED.video_url,
      thumbnail_url = EXCLUDED.thumbnail_url;
    RAISE NOTICE 'Migrated videos';
  END IF;

  -- 1.9 Charity Projects
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'charity_projects') THEN
    INSERT INTO panditji.charity_projects (id, title, slug, short_description, full_description, category, start_date, end_date, is_ongoing, beneficiaries_count, items_distributed, funds_raised, featured_image_url, video_url, gallery_images, is_published, is_featured, sort_order, created_by, created_at, updated_at)
    SELECT id, title, slug, short_description, full_description, category, start_date, end_date, is_ongoing, beneficiaries_count, items_distributed, funds_raised, featured_image_url, video_url, gallery_images, is_published, is_featured, sort_order, created_by, created_at, updated_at
    FROM public.charity_projects
    ON CONFLICT (slug) DO UPDATE SET
      featured_image_url = EXCLUDED.featured_image_url,
      gallery_images = EXCLUDED.gallery_images;
    RAISE NOTICE 'Migrated charity_projects';
  END IF;

  -- 1.10 Testimonials
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'testimonials') THEN
    INSERT INTO panditji.testimonials (id, client_name, client_location, client_image_url, service_name, service_id, testimonial_text, rating, is_approved, is_featured, is_published, source, submitted_at, approved_by, approved_at, created_at, updated_at)
    SELECT id, client_name, client_location, client_image_url, service_name, service_id, testimonial_text, rating, is_approved, is_featured, is_published, source, submitted_at, approved_by, approved_at, created_at, updated_at
    FROM public.testimonials
    ON CONFLICT (id) DO UPDATE SET client_image_url = EXCLUDED.client_image_url;
    RAISE NOTICE 'Migrated testimonials';
  END IF;

  -- 1.11 Books
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') THEN
    INSERT INTO panditji.books (id, title, subtitle, slug, author, isbn, description, full_description, category, key_topics, target_audience, chapter_list, cover_image_url, preview_pdf_url, amazon_url, flipkart_url, other_purchase_urls, publication_date, page_count, language, is_published, is_featured, sort_order, created_by, created_at, updated_at)
    SELECT id, title, subtitle, slug, author, isbn, description, full_description, category, key_topics, target_audience, chapter_list, cover_image_url, preview_pdf_url, amazon_url, flipkart_url, other_purchase_urls, publication_date, page_count, language, is_published, is_featured, sort_order, created_by, created_at, updated_at
    FROM public.books
    ON CONFLICT (slug) DO UPDATE SET
      cover_image_url = EXCLUDED.cover_image_url,
      preview_pdf_url = EXCLUDED.preview_pdf_url;
    RAISE NOTICE 'Migrated books';
  END IF;

  -- 1.12 CMS Pages & Sections
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pages') THEN
    INSERT INTO panditji.pages (id, slug, title, meta_title, meta_description, meta_keywords, og_title, og_description, og_image_url, canonical_url, is_published, is_indexed, template_type, custom_css, custom_js, sort_order, created_by, updated_by, created_at, updated_at)
    SELECT id, slug, title, meta_title, meta_description, meta_keywords, og_title, og_description, og_image_url, canonical_url, is_published, is_indexed, template_type, custom_css, custom_js, sort_order, created_by, updated_by, created_at, updated_at
    FROM public.pages
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      og_image_url = EXCLUDED.og_image_url;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'page_sections') THEN
      INSERT INTO panditji.page_sections (id, page_id, section_key, section_type, title, subtitle, content, background_color, background_image_url, sort_order, is_visible, created_at, updated_at)
      SELECT id, page_id, section_key, section_type, title, subtitle, content, background_color, background_image_url, sort_order, is_visible, created_at, updated_at
      FROM public.page_sections
      ON CONFLICT (page_id, section_key) DO UPDATE SET
        content = EXCLUDED.content,
        background_image_url = EXCLUDED.background_image_url;
    END IF;
    RAISE NOTICE 'Migrated pages & sections';
  END IF;

  -- 1.13 Site Settings & Site Metadata
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'site_settings') THEN
    INSERT INTO panditji.site_settings (
      id, primary_email, secondary_email, primary_phone, secondary_phone, whatsapp_number,
      address, address_line2, city, state, country, postal_code, business_hours, timezone,
      footer_contact_location, facebook_page_url, instagram_url, youtube_channel_url, twitter_url, linkedin_url,
      enable_contact_form, enable_testimonials, enable_blog, enable_gallery, enable_books, enable_charity,
      enable_booking, enable_newsletter, maintenance_mode, maintenance_message, maintenance_end_time,
      site_logo_url, site_logo_dark_url, site_favicon_url, primary_color, secondary_color, accent_color,
      footer_text, copyright_text, singleton_guard, updated_by, updated_at
    )
    SELECT
      id, primary_email, secondary_email, primary_phone, secondary_phone, whatsapp_number,
      address, address_line2, city, state, country, postal_code, business_hours, timezone,
      footer_contact_location, facebook_page_url, instagram_url, youtube_channel_url, twitter_url, linkedin_url,
      enable_contact_form, enable_testimonials, enable_blog, enable_gallery, enable_books, enable_charity,
      enable_booking, enable_newsletter, maintenance_mode, maintenance_message, maintenance_end_time,
      site_logo_url, site_logo_dark_url, site_favicon_url, primary_color, secondary_color, accent_color,
      footer_text, copyright_text, singleton_guard, updated_by, updated_at
    FROM public.site_settings
    ON CONFLICT (singleton_guard) DO UPDATE SET
      site_logo_url = EXCLUDED.site_logo_url,
      site_logo_dark_url = EXCLUDED.site_logo_dark_url,
      site_favicon_url = EXCLUDED.site_favicon_url;
    RAISE NOTICE 'Migrated site_settings';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'site_metadata') THEN
    INSERT INTO panditji.site_metadata (id, setting_key, setting_value, setting_type, description, category, created_at, updated_at)
    SELECT id, setting_key, setting_value, setting_type, description, category, created_at, updated_at
    FROM public.site_metadata
    ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;
    RAISE NOTICE 'Migrated site_metadata';
  END IF;

  -- 1.14 Menus & Menu Items
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'menus') THEN
    INSERT INTO panditji.menus (id, name, location, is_active, created_at, updated_at)
    SELECT id, name, location, is_active, created_at, updated_at
    FROM public.menus
    ON CONFLICT (name) DO UPDATE SET is_active = EXCLUDED.is_active;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'menu_items') THEN
      INSERT INTO panditji.menu_items (id, menu_id, parent_id, label, url, page_id, icon, target, css_class, sort_order, is_visible, created_at, updated_at)
      SELECT id, menu_id, parent_id, label, url, page_id, icon, target, css_class, sort_order, is_visible, created_at, updated_at
      FROM public.menu_items
      ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url, label = EXCLUDED.label;
    END IF;
    RAISE NOTICE 'Migrated menus & menu items';
  END IF;

  -- 1.15 Resource Sections
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'resource_sections') THEN
    INSERT INTO panditji.resource_sections (id, title, slug, description, image_urls, video_links, file_links, status, sort_order, meta_title, meta_description, created_at, updated_at)
    SELECT id, title, slug, description, image_urls, video_links, file_links, status, sort_order, meta_title, meta_description, created_at, updated_at
    FROM public.resource_sections
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      image_urls = EXCLUDED.image_urls,
      file_links = EXCLUDED.file_links,
      status = EXCLUDED.status;
    RAISE NOTICE 'Migrated resource_sections';
  END IF;

  -- 1.16 Contact Inquiries & Cookies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_inquiries') THEN
    INSERT INTO panditji.contact_inquiries (id, name, email, phone, service_id, service_name, subject, message, preferred_contact_method, preferred_date, preferred_time, location, status, priority, response_text, responded_by, responded_at, ip_address, user_agent, referrer_url, created_at, updated_at)
    SELECT id, name, email, phone, service_id, service_name, subject, message, preferred_contact_method, preferred_date, preferred_time, location, status, priority, response_text, responded_by, responded_at, ip_address, user_agent, referrer_url, created_at, updated_at
    FROM public.contact_inquiries
    ON CONFLICT (id) DO NOTHING;
    RAISE NOTICE 'Migrated contact_inquiries';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cookie_categories') THEN
    INSERT INTO panditji.cookie_categories (id, name, display_name, description, is_required, sort_order, is_active, created_at, updated_at)
    SELECT id, name, display_name, description, is_required, sort_order, is_active, created_at, updated_at
    FROM public.cookie_categories
    ON CONFLICT (name) DO UPDATE SET display_name = EXCLUDED.display_name;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cookies') THEN
      INSERT INTO panditji.cookies (id, category_id, name, provider, purpose, expiration, cookie_type, is_active, created_at, updated_at)
      SELECT id, category_id, name, provider, purpose, expiration, cookie_type, is_active, created_at, updated_at
      FROM public.cookies
      ON CONFLICT (id) DO NOTHING;
    END IF;
    RAISE NOTICE 'Migrated cookies';
  END IF;

END $$;

-- ============================================================================
-- STEP 2: STORAGE OBJECTS MIGRATION
-- Copy/reassign existing objects in storage.objects to panditji-* buckets
-- ============================================================================

DO $$
BEGIN
  -- If old bucket objects exist in the same instance, transfer them to panditji-*
  IF EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'media') THEN
    UPDATE storage.objects
    SET bucket_id = 'panditji-media'
    WHERE bucket_id = 'media';
    RAISE NOTICE 'Reassigned storage.objects from media to panditji-media';
  END IF;

  IF EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'documents') THEN
    UPDATE storage.objects
    SET bucket_id = 'panditji-documents'
    WHERE bucket_id = 'documents';
    RAISE NOTICE 'Reassigned storage.objects from documents to panditji-documents';
  END IF;

  IF EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'videos') THEN
    UPDATE storage.objects
    SET bucket_id = 'panditji-videos'
    WHERE bucket_id = 'videos';
    RAISE NOTICE 'Reassigned storage.objects from videos to panditji-videos';
  END IF;

  IF EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'resources') THEN
    UPDATE storage.objects
    SET bucket_id = 'panditji-resources'
    WHERE bucket_id = 'resources';
    RAISE NOTICE 'Reassigned storage.objects from resources to panditji-resources';
  END IF;
END $$;

-- ============================================================================
-- STEP 3: URL REMAPPING FOR NEW SCHEMA & PREFIXED STORAGE
-- Rewrites old storage paths & domain URLs in all database content
-- ============================================================================

DO $$
DECLARE
  old_host TEXT := 'rhwzwjaqbobmrxmrebht.supabase.co';
  new_host TEXT := 'gsqfaguqsmnuoeuhpxro.supabase.co';
BEGIN
  RAISE NOTICE 'Remapping storage bucket URLs in database records...';

  -- 3.1 Services: featured_image_url, samagri_file_url, where_and_who, core_aspects
  UPDATE panditji.services
  SET
    featured_image_url = REPLACE(REPLACE(featured_image_url, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host),
    samagri_file_url = REPLACE(REPLACE(samagri_file_url, '/storage/v1/object/public/documents/', '/storage/v1/object/public/panditji-documents/'), old_host, new_host),
    where_and_who = REPLACE(REPLACE(where_and_who, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host),
    core_aspects = REPLACE(REPLACE(core_aspects::text, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host)::jsonb
  WHERE featured_image_url LIKE '%/media/%'
     OR samagri_file_url LIKE '%/documents/%'
     OR where_and_who LIKE '%/media/%'
     OR core_aspects::text LIKE '%/media/%';

  -- 3.2 Blog Posts: featured_image_url, content
  UPDATE panditji.blog_posts
  SET
    featured_image_url = REPLACE(REPLACE(featured_image_url, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host),
    content = REPLACE(REPLACE(content, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host)
  WHERE featured_image_url LIKE '%/media/%' OR content LIKE '%/media/%';

  -- 3.3 Books: cover_image_url, preview_pdf_url
  UPDATE panditji.books
  SET
    cover_image_url = REPLACE(REPLACE(cover_image_url, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host),
    preview_pdf_url = REPLACE(REPLACE(preview_pdf_url, '/storage/v1/object/public/documents/', '/storage/v1/object/public/panditji-documents/'), old_host, new_host)
  WHERE cover_image_url LIKE '%/media/%' OR preview_pdf_url LIKE '%/documents/%';

  -- 3.4 Media Files: file_url, thumbnail_url
  UPDATE panditji.media_files
  SET
    file_url = REPLACE(REPLACE(file_url, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host),
    thumbnail_url = REPLACE(REPLACE(thumbnail_url, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host)
  WHERE file_url LIKE '%/media/%' OR thumbnail_url LIKE '%/media/%';

  -- 3.5 Photo Galleries: cover_image_url
  UPDATE panditji.photo_galleries
  SET cover_image_url = REPLACE(REPLACE(cover_image_url, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host)
  WHERE cover_image_url LIKE '%/media/%';

  -- 3.6 Charity Projects: featured_image_url, gallery_images
  UPDATE panditji.charity_projects
  SET
    featured_image_url = REPLACE(REPLACE(featured_image_url, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host),
    gallery_images = ARRAY(
      SELECT REPLACE(REPLACE(u, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host)
      FROM unnest(gallery_images) AS u
    )
  WHERE featured_image_url LIKE '%/media/%' OR array_to_string(gallery_images, ',') LIKE '%/media/%';

  -- 3.7 Testimonials: client_image_url
  UPDATE panditji.testimonials
  SET client_image_url = REPLACE(REPLACE(client_image_url, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host)
  WHERE client_image_url LIKE '%/media/%';

  -- 3.8 Site Settings: site_logo_url, site_logo_dark_url, site_favicon_url
  UPDATE panditji.site_settings
  SET
    site_logo_url = REPLACE(REPLACE(site_logo_url, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host),
    site_logo_dark_url = REPLACE(REPLACE(site_logo_dark_url, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host),
    site_favicon_url = REPLACE(REPLACE(site_favicon_url, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host)
  WHERE site_logo_url LIKE '%/media/%' OR site_logo_dark_url LIKE '%/media/%' OR site_favicon_url LIKE '%/media/%';

  -- 3.9 Site Metadata: OG image
  UPDATE panditji.site_metadata
  SET setting_value = REPLACE(REPLACE(setting_value, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'), old_host, new_host)
  WHERE setting_value LIKE '%/media/%';

  -- 3.10 Resource Sections: image_urls, file_links, description
  UPDATE panditji.resource_sections
  SET
    image_urls = ARRAY(
      SELECT REPLACE(REPLACE(u, '/storage/v1/object/public/resources/', '/storage/v1/object/public/panditji-resources/'), old_host, new_host)
      FROM unnest(image_urls) AS u
    ),
    file_links = REPLACE(
      REPLACE(
        REPLACE(file_links::text, '/storage/v1/object/public/documents/', '/storage/v1/object/public/panditji-documents/'),
        '/storage/v1/object/public/resources/', '/storage/v1/object/public/panditji-resources/'
      ),
      old_host, new_host
    )::jsonb,
    description = REPLACE(
      REPLACE(
        REPLACE(description, '/storage/v1/object/public/media/', '/storage/v1/object/public/panditji-media/'),
        '/storage/v1/object/public/resources/', '/storage/v1/object/public/panditji-resources/'
      ),
      old_host, new_host
    )
  WHERE image_urls::text LIKE '%/resources/%'
     OR file_links::text LIKE '%/documents/%'
     OR file_links::text LIKE '%/resources/%'
     OR description LIKE '%/media/%';

  RAISE NOTICE 'Storage URL remapping completed successfully.';
END $$;

-- ============================================================================
-- STEP 4: LAYER 2 USER PROJECT BINDING
-- Binds existing admin users in auth.users to project 'panditji'
-- ============================================================================

DO $$
DECLARE
  adm RECORD;
BEGIN
  RAISE NOTICE 'Binding existing admin users to project panditji in auth.users...';

  FOR adm IN
    SELECT email FROM panditji.admin_users
  LOOP
    PERFORM panditji.bind_user_to_project(adm.email, 'super_admin');
  END LOOP;

  -- Also bind standard platform administrator email if exists
  PERFORM panditji.bind_user_to_project('panditjoshirajesh@gmail.com', 'super_admin');
  PERFORM panditji.bind_user_to_project('admin@panditrajesh.ie', 'super_admin');

  RAISE NOTICE 'User project binding completed.';
END $$;
