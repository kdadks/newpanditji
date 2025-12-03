-- ============================================================================
-- MIGRATION 12: Database Functions
-- ============================================================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Increment page view count
CREATE OR REPLACE FUNCTION increment_view_count(page_slug TEXT, user_agent TEXT DEFAULT NULL, referrer TEXT DEFAULT NULL)
RETURNS void AS $$
BEGIN
  -- Update pages view count
  UPDATE pages 
  SET view_count = view_count + 1 
  WHERE slug = page_slug;
  
  -- Insert detailed page view record
  INSERT INTO page_views (page_id, user_agent, referrer)
  SELECT id, user_agent, referrer
  FROM pages
  WHERE slug = page_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_admin_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO activity_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (p_admin_id, p_action, p_entity_type, p_entity_id, p_details)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Migrate localStorage data (one-time import)
CREATE OR REPLACE FUNCTION migrate_local_storage_data(p_data JSONB, p_admin_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB := '{}';
  v_item JSONB;
  v_count INTEGER := 0;
BEGIN
  -- Migrate services
  IF p_data ? 'admin-services' THEN
    FOR v_item IN SELECT jsonb_array_elements(p_data->'admin-services')
    LOOP
      INSERT INTO services (title, description, price, duration, icon)
      VALUES (
        v_item->>'title',
        v_item->>'description',
        (v_item->>'price')::DECIMAL,
        v_item->>'duration',
        v_item->>'icon'
      )
      ON CONFLICT DO NOTHING;
      v_count := v_count + 1;
    END LOOP;
    v_result := v_result || jsonb_build_object('services', v_count);
  END IF;
  
  -- Log migration activity
  PERFORM log_admin_activity(p_admin_id, 'MIGRATE_DATA', 'system', NULL, v_result);
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
  v_stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_services', (SELECT COUNT(*) FROM services WHERE is_active = true),
    'total_blog_posts', (SELECT COUNT(*) FROM blog_posts WHERE status = 'published'),
    'total_photos', (SELECT COUNT(*) FROM gallery_photos WHERE is_visible = true),
    'total_videos', (SELECT COUNT(*) FROM videos WHERE is_active = true),
    'total_testimonials', (SELECT COUNT(*) FROM testimonials WHERE is_approved = true),
    'total_charity_projects', (SELECT COUNT(*) FROM charity_projects WHERE is_active = true),
    'total_books', (SELECT COUNT(*) FROM books WHERE is_available = true),
    'total_inquiries', (SELECT COUNT(*) FROM contact_inquiries WHERE status = 'new'),
    'total_page_views', (SELECT COALESCE(SUM(view_count), 0) FROM pages),
    'views_today', (SELECT COUNT(*) FROM page_views WHERE viewed_at >= CURRENT_DATE),
    'views_this_week', (SELECT COUNT(*) FROM page_views WHERE viewed_at >= CURRENT_DATE - INTERVAL '7 days'),
    'views_this_month', (SELECT COUNT(*) FROM page_views WHERE viewed_at >= CURRENT_DATE - INTERVAL '30 days')
  ) INTO v_stats;
  
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Search content across tables
CREATE OR REPLACE FUNCTION search_content(search_term TEXT)
RETURNS TABLE (
  entity_type TEXT,
  entity_id UUID,
  title TEXT,
  excerpt TEXT,
  url TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- Search pages
  SELECT 
    'page'::TEXT,
    p.id,
    p.title,
    LEFT(p.meta_description, 150),
    '/' || p.slug
  FROM pages p
  WHERE 
    p.is_published = true AND
    (p.title ILIKE '%' || search_term || '%' OR p.content ILIKE '%' || search_term || '%')
  
  UNION ALL
  
  -- Search services
  SELECT 
    'service'::TEXT,
    s.id,
    s.title,
    LEFT(s.short_description, 150),
    '/services#' || s.slug
  FROM services s
  WHERE 
    s.is_active = true AND
    (s.title ILIKE '%' || search_term || '%' OR s.description ILIKE '%' || search_term || '%')
  
  UNION ALL
  
  -- Search blog posts
  SELECT 
    'blog'::TEXT,
    bp.id,
    bp.title,
    LEFT(bp.excerpt, 150),
    '/blog/' || bp.slug
  FROM blog_posts bp
  WHERE 
    bp.status = 'published' AND
    (bp.title ILIKE '%' || search_term || '%' OR bp.content ILIKE '%' || search_term || '%')
  
  UNION ALL
  
  -- Search books
  SELECT 
    'book'::TEXT,
    b.id,
    b.title,
    LEFT(b.description, 150),
    '/books'
  FROM books b
  WHERE 
    b.is_available = true AND
    (b.title ILIKE '%' || search_term || '%' OR b.description ILIKE '%' || search_term || '%')
  
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Generate sitemap data
CREATE OR REPLACE FUNCTION get_sitemap_data()
RETURNS TABLE (
  url TEXT,
  lastmod TIMESTAMPTZ,
  changefreq TEXT,
  priority DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  -- Pages
  SELECT 
    '/' || p.slug,
    p.updated_at,
    'weekly'::TEXT,
    CASE 
      WHEN p.slug = '' THEN 1.0
      WHEN p.slug IN ('services', 'about', 'contact') THEN 0.9
      ELSE 0.7
    END
  FROM pages p
  WHERE p.is_published = true AND p.no_index = false
  
  UNION ALL
  
  -- Blog posts
  SELECT 
    '/blog/' || bp.slug,
    bp.updated_at,
    'monthly'::TEXT,
    0.6::DECIMAL
  FROM blog_posts bp
  WHERE bp.status = 'published'
  
  UNION ALL
  
  -- Services (individual)
  SELECT 
    '/services/' || s.slug,
    s.updated_at,
    'monthly'::TEXT,
    0.8::DECIMAL
  FROM services s
  WHERE s.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Clean up old analytics data (for scheduled job)
CREATE OR REPLACE FUNCTION cleanup_old_analytics(retention_days INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM page_views 
  WHERE viewed_at < NOW() - (retention_days || ' days')::INTERVAL;
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  
  -- Log cleanup
  INSERT INTO activity_logs (action, entity_type, details)
  VALUES ('CLEANUP', 'analytics', jsonb_build_object('deleted_records', v_deleted, 'retention_days', retention_days));
  
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get popular services
CREATE OR REPLACE FUNCTION get_popular_services(limit_count INTEGER DEFAULT 6)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  short_description TEXT,
  icon TEXT,
  view_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    s.slug,
    s.short_description,
    s.icon,
    s.view_count
  FROM services s
  WHERE s.is_active = true AND s.is_featured = true
  ORDER BY s.view_count DESC, s.sort_order ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
