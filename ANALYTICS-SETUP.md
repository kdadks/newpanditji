# Analytics System Setup Guide

## Overview

A comprehensive analytics system has been added to track:
- **Page views** with location data (country, city, region)
- **Service views** for each pooja/service
- **Traffic sources** and referrers
- **Device types** (mobile, desktop, tablet)
- **Visitor sessions** and unique visitors

## Database Setup

### Step 1: Run the Migration

The analytics tables and views are defined in the migration file. Run it against your Supabase database:

```bash
# Connect to your Supabase database and run:
supabase/migrations/20241203000021_analytics.sql
```

Or use the Supabase CLI:
```bash
supabase db push
```

### Step 2: Verify Tables Created

The migration creates:
- `page_views` - Tracks all page visits
- `service_views` - Tracks service detail page views
- `referrer_sources` - Aggregates traffic sources
- `analytics_summary` - Materialized view for quick stats
- Views: `popular_pages`, `popular_services`, `top_referrers`, `location_stats`

## Features

### 📊 Analytics Dashboard

Access at: **Admin Panel → Analytics**

#### Key Metrics:
1. **Total Page Views** - Last 30 days
2. **Unique Visitors** - Based on session tracking
3. **Service Views** - How many times services were viewed
4. **Countries Reached** - Geographic distribution

#### Device Breakdown:
- Mobile, Desktop, and Tablet percentages
- Visual representation of device preferences

### 📈 Detailed Analytics Tabs:

#### 1. Popular Pages
- Top 10 most visited pages
- View count and unique visitors per page
- Last viewed timestamp

#### 2. Services Analytics
- Most viewed services
- Helps identify popular offerings
- Unique visitor tracking per service

#### 3. Location Statistics
- Countries ranked by visits
- City-level granularity
- Unique visitors per country

#### 4. Traffic Sources
- Top referrer domains
- Track where visitors come from
- Direct vs referral traffic

### 🔍 Recent Activity
- Real-time visitor feed
- Shows latest 20 page views
- Displays device type, location, and timestamp

## Analytics Tracking

### Automatic Page View Tracking

To enable automatic tracking on all pages, add to your main App component:

```typescript
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from './lib/analytics-tracker'

function App() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname)
  }, [location])

  // ... rest of your app
}
```

### Manual Service Tracking

Track when users view service details:

```typescript
import { trackServiceView } from './lib/analytics-tracker'

function ServiceDetailPage({ service }) {
  useEffect(() => {
    trackServiceView(service.id, service.name)
  }, [service])

  // ... render service details
}
```

## Location Data

### How It Works

The system uses the free **ipapi.co** service to get:
- Country name
- City
- Region/State
- Latitude/Longitude
- IP Address

### Privacy Considerations

- IP addresses are stored for analytics only
- No personally identifiable information is collected
- Session IDs are temporary and browser-based
- Location data is approximate (city-level)

### Alternative Geolocation Services

If you want to use a different service, edit `src/lib/analytics-tracker.ts`:

```typescript
async function getLocationData() {
  // Option 1: ipapi.co (current - free, 1000 requests/day)
  const response = await fetch('https://ipapi.co/json/')

  // Option 2: ipinfo.io (50k requests/month free)
  // const response = await fetch('https://ipinfo.io/json?token=YOUR_TOKEN')

  // Option 3: ip-api.com (45 requests/minute free)
  // const response = await fetch('http://ip-api.com/json/')

  const data = await response.json()
  return { /* map to your schema */ }
}
```

## Performance Optimization

### Materialized View Refresh

The `analytics_summary` materialized view should be refreshed periodically:

```sql
-- Manual refresh
SELECT refresh_analytics_summary();

-- Or set up a cron job (Supabase Edge Functions)
-- Refresh every hour
SELECT cron.schedule(
  'refresh-analytics',
  '0 * * * *',
  $$SELECT refresh_analytics_summary()$$
);
```

### Indexing

The migration includes optimized indexes for:
- Fast queries by date
- Country/location lookups
- Session-based aggregations
- Service view tracking

## Data Retention

Consider setting up data retention policies:

```sql
-- Delete page views older than 1 year
DELETE FROM page_views
WHERE created_at < NOW() - INTERVAL '1 year';

-- Or create a scheduled cleanup
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  DELETE FROM page_views WHERE created_at < NOW() - INTERVAL '1 year';
  DELETE FROM service_views WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;
```

## Row Level Security (RLS)

Add RLS policies to protect analytics data:

```sql
-- Only admins can read analytics
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read access"
  ON page_views FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Public can insert (for tracking)
CREATE POLICY "Public insert access"
  ON page_views FOR INSERT
  TO anon
  WITH CHECK (true);
```

## Troubleshooting

### No data appearing?

1. Check if tracking is enabled on your pages
2. Verify the database migration ran successfully
3. Check browser console for errors
4. Ensure Supabase anon key has insert permissions

### Location data not showing?

1. ipapi.co has rate limits (1000 requests/day for free tier)
2. Check if the API is responding: `curl https://ipapi.co/json/`
3. Consider upgrading or switching geolocation providers

### Performance issues?

1. Refresh materialized view: `SELECT refresh_analytics_summary()`
2. Check database indexes are created
3. Implement data retention policy
4. Consider archiving old data

## Next Steps

1. ✅ Run the database migration
2. ✅ Add page view tracking to your main App component
3. ✅ Add service tracking to service detail pages
4. ✅ Set up materialized view refresh schedule
5. ✅ Configure RLS policies for security
6. ✅ Set up data retention policy

## Advanced Features (Future)

- Custom event tracking
- A/B testing support
- Conversion funnels
- User journey tracking
- Export analytics data
- Email reports
- Real-time dashboard

## API Reference

### Tracking Functions

```typescript
// Track page view
trackPageView(pagePath: string, pageTitle?: string): Promise<void>

// Track service view
trackServiceView(serviceId: string, serviceName: string): Promise<void>

// Custom event (for future use)
trackEvent(eventName: string, eventData?: Record<string, any>): Promise<void>
```

### Analytics Hooks

```typescript
// Get analytics summary
useAnalyticsSummary(): { data: AnalyticsSummary[], isLoading: boolean }

// Get popular pages
usePopularPages(): { data: PopularPage[], isLoading: boolean }

// Get popular services
usePopularServices(): { data: PopularService[], isLoading: boolean }

// Get location stats
useLocationStats(): { data: LocationStat[], isLoading: boolean }

// Get top referrers
useTopReferrers(): { data: TopReferrer[], isLoading: boolean }

// Get recent views
useRecentPageViews(limit?: number): { data: PageView[], isLoading: boolean }

// Get total stats
useTotalStats(): { data: TotalStats, isLoading: boolean }
```
