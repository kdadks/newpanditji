# Auth Token Error Fix

## Problem
Console error: `AuthApiError: Invalid Refresh Token: Refresh Token Not Found`

This error occurs when:
- A stored Supabase refresh token becomes invalid or expired
- The token was revoked or deleted from the database
- The token exists in localStorage but is no longer valid on the server

## Solution Implemented

### 1. Enhanced Supabase Client Configuration
**File:** `src/lib/supabase.ts`

- Added PKCE flow type for better security
- Configured proper storage key
- Added automatic cleanup of invalid tokens on initialization
- Added storage event listener to detect token changes

### 2. Improved Auth Service Error Handling
**File:** `src/services/auth.ts`

- Added `clearAllAuthData()` helper function
- Enhanced `initializeAuth()` with specific refresh token error handling
- Updated `onAuthStateChange` to handle additional error events
- Improved `clearSession()` method to use centralized cleanup

### 3. Global Auth Error Handler Component
**File:** `src/components/AuthErrorHandler.tsx`

- Catches unhandled auth errors globally
- Automatically clears invalid sessions
- Suppresses error logs for known token issues
- Prevents error messages from appearing in console

### 4. Manual Cleanup Utility
**File:** `src/utils/clear-auth-tokens.ts`

- Provides manual token cleanup function
- Can be run in browser console or with URL parameter
- Clears localStorage and sessionStorage
- Auto-redirects after cleanup

## Usage

### Automatic Fix (Recommended)
The error handler now automatically detects and clears invalid tokens. Simply refresh the page after seeing the error.

### Manual Fix (If Needed)

#### Option 1: Browser Console
```javascript
// Open browser console (F12) and run:
localStorage.clear()
sessionStorage.clear()
// Then refresh the page
```

#### Option 2: URL Parameter
```
https://yoursite.com/?clear-tokens=true
```

#### Option 3: Using the utility
```javascript
import { clearAuthTokens } from '@/utils/clear-auth-tokens'
clearAuthTokens()
```

## What Changed

### Before
- Refresh token errors would appear repeatedly in console
- Invalid sessions persisted in localStorage
- Manual cleanup required

### After
- Errors are automatically caught and handled
- Invalid tokens are immediately cleared
- Session state is properly reset
- No user intervention needed

## Testing the Fix

1. **Development Environment:**
   ```bash
   npm run dev
   ```

2. **Check Console:** The error should no longer appear

3. **Test Authentication:**
   - Visit `/admin`
   - Login should work normally
   - Logout clears all tokens properly

4. **Force Token Error (Optional):**
   - Manually edit localStorage token
   - Refresh page
   - Error should be caught and handled automatically

## Prevention

To avoid this error in the future:

1. **Always sign out properly** when done with admin tasks
2. **Don't manually edit** Supabase tokens in localStorage
3. **Clear browser data** if switching between environments
4. **Use the same browser session** for development

## Related Files

- `src/lib/supabase.ts` - Supabase client configuration
- `src/services/auth.ts` - Authentication service
- `src/hooks/useAuth.ts` - Authentication React hook
- `src/components/AuthErrorHandler.tsx` - Global error handler
- `src/utils/clear-auth-tokens.ts` - Manual cleanup utility
- `src/app/layout.tsx` - Root layout with error handler

## Additional Notes

- The fix works on both client and server side
- Compatible with Next.js App Router
- No breaking changes to existing authentication flow
- Backward compatible with existing code

## Troubleshooting

### Error Still Appears?
1. Clear browser cache completely
2. Run `npm run build` to rebuild the app
3. Check that environment variables are set correctly:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Login Not Working?
1. Verify Supabase project is accessible
2. Check that auth is enabled in Supabase dashboard
3. Verify user exists in auth.users table
4. Check network tab for API errors

### Need Help?
Review the console logs for detailed error messages - they now include helpful context about what's being cleaned up.
