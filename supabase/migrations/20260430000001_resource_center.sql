-- ============================================================================
-- MIGRATION: Pandit Resource Center page + storage bucket
-- ============================================================================
-- Adds a new CMS page (slug = 'pandit-resource-center') of template_type
-- 'resource_center' whose page_sections rows store the modular
-- (text / mediaGallery / fileAttachments) blocks built in the admin UI.
-- Also provisions a public 'resources' storage bucket that accepts the
-- images and document formats listed in the spec.
-- ============================================================================

-- 1. Seed the page row (idempotent)
INSERT INTO pages (
  slug,
  title,
  meta_title,
  meta_description,
  template_type,
  is_published,
  is_indexed,
  sort_order
) VALUES (
  'pandit-resource-center',
  'Pandit Resource Center',
  'Pandit Resource Center | Resources, Guides & Downloads',
  'Curated resources, study materials, photos, videos and downloadable files maintained by the pandit team.',
  'resource_center',
  true,
  true,
  900
)
ON CONFLICT (slug) DO UPDATE
SET template_type = EXCLUDED.template_type,
    is_published  = COALESCE(pages.is_published, EXCLUDED.is_published);

-- 2. Storage bucket for module media + file attachments (public read).
--    Allowed MIME types cover both the image formats (JPEG/PNG) and the
--    document formats (PDF, PPTX, DOCX, XLSX, ZIP) called out in the spec.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resources',
  'resources',
  true,
  20971520, -- 20 MB hard cap (images additionally enforced ≤ 5 MB client-side)
  ARRAY[
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public            = EXCLUDED.public,
    file_size_limit   = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. RLS policies: public read; authenticated (admin) full write.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'resources_public_read'
  ) THEN
    CREATE POLICY resources_public_read ON storage.objects
      FOR SELECT
      USING (bucket_id = 'resources');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'resources_admin_insert'
  ) THEN
    CREATE POLICY resources_admin_insert ON storage.objects
      FOR INSERT
      WITH CHECK (bucket_id = 'resources' AND auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'resources_admin_update'
  ) THEN
    CREATE POLICY resources_admin_update ON storage.objects
      FOR UPDATE
      USING (bucket_id = 'resources' AND auth.uid() IS NOT NULL)
      WITH CHECK (bucket_id = 'resources' AND auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'resources_admin_delete'
  ) THEN
    CREATE POLICY resources_admin_delete ON storage.objects
      FOR DELETE
      USING (bucket_id = 'resources' AND auth.uid() IS NOT NULL);
  END IF;
END $$;
