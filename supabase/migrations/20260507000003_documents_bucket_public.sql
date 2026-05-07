-- ============================================================================
-- MIGRATION: Make documents bucket public and expand allowed MIME types
-- Resource Center file attachments (PDF, PPT, Word, Excel) must be publicly
-- downloadable by site visitors without authentication.
-- ============================================================================

-- Make the bucket public and expand the allowed MIME types to cover all
-- document formats used by the Resource Center file picker.
UPDATE storage.buckets
SET
  public = true,
  file_size_limit = 31457280, -- 30 MB
  allowed_mime_types = ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
WHERE id = 'documents';

-- Add a public read policy so unauthenticated visitors can download files.
-- (Uploads still require authentication via the existing documents_admin_all policy.)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND schemaname = 'storage'
      AND policyname = 'documents_public_read'
  ) THEN
    CREATE POLICY documents_public_read ON storage.objects
      FOR SELECT
      USING (bucket_id = 'documents');
  END IF;
END $$;
