-- ============================================================================
-- MIGRATION: Setup bi-weekly database backup via pg_cron + Edge Function
-- ============================================================================
--
-- BEFORE running this migration, you must:
--
--   1. Deploy the Edge Function:
--      supabase functions deploy backup-and-email --no-verify-jwt
--
--   2. Add these secrets in Supabase Dashboard →
--      Project Settings → Edge Functions → Secrets:
--        SMTP_HOST        = smtp.office365.com
--        SMTP_PORT        = 587
--        SMTP_USER        = your-exchange-email@domain.com
--        SMTP_PASSWORD    = your-password-or-app-password
--        CRON_SECRET      = <paste the same value used in step 3 below>
--
--   3. Replace the three placeholder values in this file:
--        __YOUR_SUPABASE_PROJECT_URL__       e.g. https://abcdefgh.supabase.co
--        __YOUR_SUPABASE_SERVICE_ROLE_KEY__  from Project Settings → API
--        __YOUR_CRON_SECRET__                any random string you choose
--
-- The backup email will be sent to: kdadks@outlook.com
-- Schedule: 09:00 UTC on the 1st and 15th of every month (~every 2 weeks)
-- ============================================================================

-- Enable required extensions
-- (pg_cron and pg_net are available on all Supabase Pro+ projects;
--  on Free tier, enable them manually: Dashboard → Database → Extensions)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ── Helper function: invoke the backup edge function ────────────────────────
-- ⚠️  Replace the three placeholder values below before running this migration:
--      __YOUR_SUPABASE_PROJECT_URL__       e.g. https://abcdefgh.supabase.co
--      __YOUR_SUPABASE_SERVICE_ROLE_KEY__  from Project Settings → API
--      __YOUR_CRON_SECRET__                any random string you choose
CREATE OR REPLACE FUNCTION trigger_database_backup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_url         CONSTANT TEXT := 'https://rhwzwjaqbobmrxmrebht.supabase.co';
  v_auth_key    CONSTANT TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3p3amFxYm9ibXJ4bXJlYmh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzgyNDg1NCwiZXhwIjoyMDc5NDAwODU0fQ.VfGLTDPbzITrNHLa-O75vmqSRc8VJqVTCP6PkGQH3B4';
  v_cron_secret CONSTANT TEXT := 'e9458e50701aa886924ae3b1d6fc734015aa8d86f6ee2f2840badbfae58515f9';
BEGIN
  IF v_url = '' OR v_url = '__YOUR_SUPABASE_PROJECT_URL__' THEN
    RAISE WARNING 'backup: supabase project URL is not configured — skipping';
    RETURN;
  END IF;

  PERFORM net.http_post(
    url     := v_url || '/functions/v1/backup-and-email',
    headers := jsonb_build_object(
                 'Content-Type',    'application/json',
                 'Authorization',   'Bearer ' || v_auth_key,
                 'x-cron-secret',   v_cron_secret
               ),
    body    := jsonb_build_object(
                 'trigger',       'cron',
                 'scheduled_at',  now()::text
               )
  );

  RAISE NOTICE 'backup: HTTP request dispatched at %', now();
END;
$$;

-- ── Schedule: 09:00 UTC on the 1st and 15th of every month ──────────────────
-- Remove any existing job first to allow re-running this migration safely
SELECT cron.unschedule('biweekly-database-backup')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'biweekly-database-backup'
);

SELECT cron.schedule(
  'biweekly-database-backup',   -- job name
  '0 9 1,15 * *',               -- cron expression: 09:00 UTC, 1st & 15th of month
  $$SELECT trigger_database_backup();$$
);

-- ── Verify the job was created ───────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'biweekly-database-backup') THEN
    RAISE NOTICE '✅ Cron job "biweekly-database-backup" created successfully';
    RAISE NOTICE '   Next runs: 1st and 15th of each month at 09:00 UTC';
  ELSE
    RAISE WARNING '⚠️  Cron job was NOT created — check pg_cron extension is enabled';
  END IF;
END;
$$;

-- ── Manual test query (run after setup to trigger an immediate backup) ────────
-- Uncomment and run this to test without waiting for the schedule:
--
-- SELECT trigger_database_backup();
--
-- Then check: Dashboard → Database → pg_net → net.http_response_queue
-- or check your email at kdadks@outlook.com
