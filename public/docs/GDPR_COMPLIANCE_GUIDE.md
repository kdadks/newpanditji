# GDPR Compliance - Cookie Consent Implementation

## Overview

This implementation provides a complete GDPR-compliant cookie consent workflow that:
- ✅ Shows users a consent banner on first visit
- ✅ Stores consent preferences in database
- ✅ Respects user choices for analytics tracking
- ✅ Displays consent statistics in analytics dashboard
- ✅ Complies with GDPR, CCPA, and other privacy regulations

## Features

### 1. **Cookie Consent Banner** 🍪
- Beautiful, modern UI that appears on first visit
- Four cookie categories:
  - **Necessary** (Always Active) - Essential for website functionality
  - **Analytics** - Track user behavior and improve UX
  - **Marketing** - Display relevant advertisements
  - **Preferences** - Remember user settings (language, theme, etc.)
- Three consent options:
  - Accept All
  - Necessary Only
  - Customize (granular control)

### 2. **Consent Persistence** 💾
- Stored in localStorage for instant access
- Stored in database for analytics
- Cookie consent ID stored in browser cookie (365 days)
- Automatic expiry after 1 year (GDPR requirement)

### 3. **Analytics Integration** 📊
- Analytics only track users who have consented
- Automatic consent check before tracking
- Clear console logs when tracking is skipped
- No data collection without consent

### 4. **Admin Dashboard** 📈
- View total consent count
- See percentage of users accepting each cookie type
- Monitor consent trends
- GDPR compliance indicators

## Database Schema

### `user_cookie_consents` Table

```sql
CREATE TABLE user_cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_id TEXT NOT NULL UNIQUE,
  necessary_cookies BOOLEAN DEFAULT true,
  analytics_cookies BOOLEAN DEFAULT false,
  marketing_cookies BOOLEAN DEFAULT false,
  preferences_cookies BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  consent_version TEXT,
  consented_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
```

## How It Works

### User Journey

1. **First Visit**
   - User lands on site
   - Cookie consent banner appears
   - User chooses consent preferences
   - Consent saved to localStorage + database
   - Banner disappears

2. **Subsequent Visits**
   - Consent loaded from localStorage
   - Banner does not appear
   - Analytics respects consent choices

3. **After 1 Year**
   - Consent expires
   - User sees banner again (GDPR requirement)

### Technical Flow

```
User Visit → Check localStorage
           ↓
    Has Consent?
    ├─ YES → Load consent preferences
    │        ↓
    │        Analytics Tracking (if consented)
    │
    └─ NO → Show Cookie Banner
             ↓
             User Makes Choice
             ↓
             Save to localStorage + Database
             ↓
             Hide Banner
             ↓
             Analytics Tracking (if consented)
```

## Files Created/Modified

### New Files:

1. **`src/hooks/useCookieConsent.ts`**
   - Cookie consent management hook
   - Functions: acceptAll, acceptNecessary, acceptCustom, resetConsent
   - Storage in localStorage + database

2. **`src/components/CookieConsentBanner.tsx`**
   - Beautiful cookie consent UI
   - Customizable cookie categories
   - Accept/Reject/Customize options

### Modified Files:

1. **`src/app/layout.tsx`**
   - Added `<CookieConsentBanner />` component

2. **`src/lib/analytics-utils.ts`**
   - Added consent check to `shouldTrackAnalytics()`
   - Only tracks if user has consented

3. **`src/components/AnalyticsProvider.tsx`**
   - Updated to respect cookie consent
   - Better logging for consent status

4. **`src/hooks/useAnalytics.ts`**
   - Added `useConsentStats()` hook
   - Fetches consent statistics

5. **`src/components/admin/AdminAnalytics.tsx`**
   - Added GDPR consent statistics card
   - Shows acceptance rates for each category

6. **`supabase/migrations/20250126000001_fix_analytics_rls.sql`**
   - Added RLS policies for consent tables
   - Allows public inserts, admin reads

## Setup Instructions

### 1. Apply Database Migration

Run the migration in Supabase SQL Editor:

```bash
# Copy contents of:
supabase/migrations/20250126000001_fix_analytics_rls.sql

# Paste and run in: Supabase Dashboard → SQL Editor
```

Or using CLI:
```bash
supabase db push
```

### 2. Deploy to Production

```bash
npm run build
# Deploy to your hosting provider
```

### 3. Test the Implementation

1. Open your site in **incognito/private mode**
2. You should see the cookie consent banner
3. Try all three options:
   - Accept All
   - Necessary Only
   - Customize (toggle individual cookies)
4. Check that banner doesn't appear on refresh
5. Open DevTools Console to see tracking logs

## GDPR Compliance Checklist

✅ **Consent Before Tracking**
- Analytics only run after user consent
- No tracking cookies set without permission

✅ **Clear Information**
- Banner explains what each cookie type does
- Links to Privacy Policy and Terms of Service

✅ **Granular Control**
- Users can accept/reject individual cookie categories
- Easy to customize preferences

✅ **Consent Storage**
- Consent preferences stored securely
- Expiry date set (365 days)
- Can be revoked at any time

✅ **Audit Trail**
- All consents logged in database
- Includes timestamp, user agent, IP address
- Version tracking for policy updates

✅ **Easy Access to Preferences**
- Users can change preferences anytime
- Clear reset mechanism

## Resetting Consent (For Testing)

To test the banner again:

### In Browser Console:
```javascript
// Clear consent
localStorage.removeItem('cookie_consent')
document.cookie = 'cookie_consent_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
location.reload()
```

### Using the Hook:
```typescript
const { resetConsent } = useCookieConsent()
resetConsent() // Clears consent and shows banner
```

## Analytics Dashboard

### Consent Statistics Card

The admin analytics dashboard now shows:

- **Total Consents** - Number of users who have made a choice
- **Analytics Acceptance** - % who accepted analytics cookies
- **Marketing Acceptance** - % who accepted marketing cookies
- **Preferences Acceptance** - % who accepted preference cookies

### Sample SQL Queries

```sql
-- View all consents
SELECT * FROM user_cookie_consents
ORDER BY consented_at DESC
LIMIT 100;

-- Consent acceptance rates
SELECT
  COUNT(*) as total_consents,
  SUM(CASE WHEN analytics_cookies THEN 1 ELSE 0 END) as analytics_accepted,
  SUM(CASE WHEN marketing_cookies THEN 1 ELSE 0 END) as marketing_accepted,
  ROUND(100.0 * SUM(CASE WHEN analytics_cookies THEN 1 ELSE 0 END) / COUNT(*), 2) as analytics_percentage
FROM user_cookie_consents;

-- Expired consents (need re-consent)
SELECT COUNT(*) as expired_consents
FROM user_cookie_consents
WHERE expires_at < NOW();
```

## Customization

### Changing Consent Expiry

Edit `useCookieConsent.ts`:
```typescript
const CONSENT_EXPIRY_DAYS = 365 // Change to desired days
```

### Adding New Cookie Categories

1. Update `CookieConsent` interface in `useCookieConsent.ts`
2. Add column to `user_cookie_consents` table
3. Add UI element in `CookieConsentBanner.tsx`
4. Update consent storage logic

### Styling the Banner

Edit `CookieConsentBanner.tsx`:
- Modify Tailwind classes
- Change colors to match brand
- Adjust layout and positioning

## Legal Considerations

### What This Implementation Provides:

✅ Technical consent mechanism
✅ Consent storage and audit trail
✅ Respect for user choices
✅ Clear information about cookies

### What You Still Need:

⚠️ **Privacy Policy** - Document your data collection practices
⚠️ **Terms of Service** - Legal terms for using your website
⚠️ **Cookie Policy** - Detailed list of all cookies used
⚠️ **Legal Review** - Have a lawyer review your implementation

## Troubleshooting

### Banner Not Showing

1. Check browser console for errors
2. Verify `CookieConsentBanner` is in layout
3. Clear localStorage and cookies
4. Try incognito mode

### Analytics Still Tracking Without Consent

1. Check `shouldTrackAnalytics()` returns false
2. Verify consent in localStorage: `localStorage.getItem('cookie_consent')`
3. Check console logs for tracking status

### Consent Not Saving to Database

1. Check Supabase connection
2. Verify RLS policies applied
3. Check browser network tab for errors
4. Run migration SQL manually

## Best Practices

1. **Always show consent on first visit** - Required by GDPR
2. **Don't pre-check optional cookies** - User must actively consent
3. **Make it easy to reject** - "Necessary Only" button visible
4. **Allow preference changes** - Provide settings page
5. **Respect Do Not Track** - Honor browser DNT header
6. **Log all changes** - Keep audit trail of consent updates
7. **Regular reminders** - Re-request consent annually

## Resources

- [GDPR Official Site](https://gdpr.eu/)
- [Cookie Consent Guide](https://gdpr.eu/cookies/)
- [ICO Cookie Guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/)

---

**Implementation Date**: January 26, 2026
**Version**: 1.0
**Compliance**: GDPR, CCPA, ePrivacy Directive
