-- ============================================================================
-- MIGRATION 15: Storage Buckets and Policies
-- ============================================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('media', 'media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']),
  ('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('videos', 'videos', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/ogg'])
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for media bucket (public read, authenticated write)
CREATE POLICY media_public_read ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY media_admin_insert ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.uid() IS NOT NULL);

CREATE POLICY media_admin_update ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'media' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'media' AND auth.uid() IS NOT NULL);

CREATE POLICY media_admin_delete ON storage.objects
  FOR DELETE
  USING (bucket_id = 'media' AND auth.uid() IS NOT NULL);

-- Storage Policies for documents bucket (authenticated access only)
CREATE POLICY documents_admin_all ON storage.objects
  FOR ALL
  USING (bucket_id = 'documents' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

-- Storage Policies for videos bucket (public read, authenticated write)
CREATE POLICY videos_public_read ON storage.objects
  FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY videos_admin_insert ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'videos' AND auth.uid() IS NOT NULL);

CREATE POLICY videos_admin_update ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'videos' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'videos' AND auth.uid() IS NOT NULL);

CREATE POLICY videos_admin_delete ON storage.objects
  FOR DELETE
  USING (bucket_id = 'videos' AND auth.uid() IS NOT NULL);
