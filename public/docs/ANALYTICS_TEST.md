# Analytics Testing Guide

## Steps to Test Analytics Tracking

### 1. Run the Database Migration

First, apply the new migration to fix RLS policies:

```bash
# If using Supabase CLI locally
supabase db reset

# Or push just the new migration
supabase db push
```

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Test Page View Tracking

1. Open your browser to `http://localhost:3000`
2. Navigate to different pages:
   - Home page
   - Services page
   - About page
   - Blog page
   - Gallery page
3. Open browser DevTools Console (F12)
4. Look for any errors related to analytics
5. Wait 1-2 seconds on each page for tracking to complete

### 4. Test Service View Tracking

1. Go to the Services page
2. Click on any service to view details
3. The service view should be tracked when the dialog opens
4. Check console for any errors

### 5. Verify Data in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click on "Table Editor"
3. Check these tables:
   - **page_views** - Should show entries for each page you visited
   - **service_views** - Should show entries for services you clicked
   - **referrer_sources** - May be empty if you visited directly

### 6. Check Admin Analytics Dashboard

1. Login to admin panel at `http://localhost:3000/admin`
2. Go to Analytics section
3. You should see:
   - Total page views count
   - Unique visitors count
   - Device breakdown
   - Popular pages list
   - Recent activity

## Troubleshooting

### If No Data Appears:

1. **Check Console for Errors**
   - Open browser DevTools (F12)
   - Look for red errors mentioning "page_views" or "analytics"
   - Common issues:
     - RLS policy errors → Run the migration
     - CORS errors → Check Supabase URL configuration
     - Network errors → Check internet connection

2. **Verify Supabase Connection**
   - Check `.env.local` has correct:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Check Database Schema**
   - In Supabase Dashboard → SQL Editor, run:
   ```sql
   SELECT * FROM page_views LIMIT 10;
   SELECT * FROM service_views LIMIT 10;
   ```

4. **Verify RLS Policies**
   - In Supabase Dashboard → Authentication → Policies
   - Check that `page_views`, `service_views`, and `referrer_sources` have INSERT policies for public

### Manual Test Insert

You can manually test if inserts work by running this in Supabase SQL Editor:

```sql
-- Test page_views insert
INSERT INTO page_views (
  page_slug,
  page_title,
  device_type,
  session_id
) VALUES (
  '/test',
  'Test Page',
  'desktop',
  'test-session-123'
);

-- Check if it was inserted
SELECT * FROM page_views WHERE page_slug = '/test';
```

If this works, the issue is in the client-side tracking code.
If this fails, the issue is with RLS policies or database permissions.

## Expected Behavior

### Page Views Table Columns:
- `id` (UUID)
- `page_slug` (TEXT) - e.g., "/", "/services", "/about"
- `page_title` (TEXT) - Page title
- `session_id` (TEXT) - Unique session identifier
- `device_type` (TEXT) - "mobile", "desktop", or "tablet"
- `browser` (TEXT) - Browser name
- `operating_system` (TEXT) - OS name
- `country` (TEXT) - Country name (if geolocation works)
- `city` (TEXT) - City name
- `referrer_url` (TEXT) - Where user came from
- `referrer_domain` (TEXT) - Domain of referrer
- `viewed_at` (TIMESTAMPTZ) - When page was viewed

### Service Views Table Columns:
- `id` (UUID)
- `service_id` (UUID) - ID of the service
- `service_name` (TEXT) - Name of the service
- `session_id` (TEXT) - Same as page views
- `device_type` (TEXT)
- `country` (TEXT)
- `city` (TEXT)
- `created_at` (TIMESTAMPTZ)

## Notes

- Analytics tracking is **automatic** for all page views
- Service tracking happens when user **clicks** on a service
- Admin routes are **excluded** from tracking
- Geolocation data may take 1-2 seconds to load (uses ipapi.co free service)
- Analytics are **real-time** - no delay
- Dashboard refreshes every 5 minutes (React Query cache)
