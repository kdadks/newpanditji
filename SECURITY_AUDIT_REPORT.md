# Security Audit Report
**Project:** NewPanditJi - Hindu Services Website
**Date:** January 27, 2026
**Auditor:** Claude Code Security Scanner
**Technology Stack:** Next.js 16, React 19, Supabase (PostgreSQL), TypeScript

---

## Executive Summary

This security audit identifies **14 vulnerabilities** across various severity levels in the application. The audit covers authentication, authorization, input validation, XSS protection, data exposure, and infrastructure security.

### Risk Distribution
- **Critical:** 2 vulnerabilities
- **High:** 4 vulnerabilities
- **Medium:** 5 vulnerabilities
- **Low:** 3 vulnerabilities

### Key Findings
1. Client-side only authentication without server-side route protection
2. XSS vulnerabilities via dangerouslySetInnerHTML
3. Weak RLS policies allowing any authenticated user full admin access
4. Missing CSRF protection
5. No rate limiting on public endpoints
6. Sensitive data exposure in client-side code

---

## Detailed Vulnerabilities

### 1. Client-Side Only Authentication [CRITICAL]

**Severity:** Critical
**CWE:** CWE-602 (Client-Side Enforcement of Server-Side Security)
**Location:** `src/app/admin/page.tsx`, `src/components/pages/AdminPage.tsx`

**Description:**
Admin routes are protected only on the client-side using React components. There is no server-side middleware or API route protection.

**Evidence:**
```typescript
// src/app/admin/page.tsx
export default function Admin() {
  return <AdminPage />  // No server-side auth check
}

// src/components/pages/AdminPage.tsx
if (!isAuthenticated) {
  return <LoginForm />  // Client-side check only
}
```

**Impact:**
- Attackers can bypass client-side authentication by:
  - Disabling JavaScript
  - Manipulating React state/localStorage
  - Directly accessing API endpoints from tools like Postman
- All admin operations rely solely on Supabase RLS, but direct database access is unprotected

**Recommendation:**
1. Implement Next.js middleware for server-side route protection:
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession()

  if (request.nextUrl.pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

2. Add server-side API route handlers with authentication checks
3. Use Next.js Server Components for admin pages to enforce server-side rendering

---

### 2. Weak Row Level Security (RLS) Policies [CRITICAL]

**Severity:** Critical
**CWE:** CWE-285 (Improper Authorization)
**Location:** `supabase/migrations/20241203000014_rls_policies.sql`

**Description:**
RLS policies grant full access to ANY authenticated user without role verification.

**Evidence:**
```sql
-- Any authenticated user gets full admin access!
CREATE POLICY services_admin_all ON services
  FOR ALL
  USING (auth.uid() IS NOT NULL)  -- Only checks if logged in
  WITH CHECK (auth.uid() IS NOT NULL);
```

**Impact:**
- Any user who creates a Supabase account can:
  - Modify all services, blogs, and content
  - Delete critical data
  - Access analytics and sensitive information
  - Upload/delete files from storage buckets
- No role-based access control (RBAC)

**Recommendation:**
1. Implement role-based RLS policies:
```sql
-- Create role check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
    AND role IN ('owner', 'admin')
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update policies
CREATE POLICY services_admin_all ON services
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

2. Add role column to auth.users or create admin_roles table
3. Verify role on both client and server side

---

### 3. XSS Vulnerabilities via dangerouslySetInnerHTML [HIGH]

**Severity:** High
**CWE:** CWE-79 (Cross-Site Scripting)
**Location:** Multiple files

**Description:**
Multiple components use `dangerouslySetInnerHTML` without sanitization to render user-controlled content.

**Evidence:**
Files using `dangerouslySetInnerHTML`:
- `src/components/pages/BlogDetailPage.tsx`
- `src/components/pages/ServicesPage.tsx`
- `src/components/pages/CharityPage.tsx`
- `src/components/pages/AboutPage.tsx`
- `src/components/pages/DakshinaPage.tsx`
- `src/components/admin/AdminServices.tsx`
- `src/components/admin/AdminBlogs.tsx`
- `src/components/admin/AdminCharity.tsx`

**Impact:**
- Stored XSS attacks through admin panel
- Malicious scripts can:
  - Steal session tokens
  - Perform actions on behalf of users
  - Redirect users to phishing sites
  - Deface the website

**Recommendation:**
1. Install and use DOMPurify for HTML sanitization:
```bash
npm install dompurify @types/dompurify
```

2. Create a sanitization utility:
```typescript
// src/utils/sanitize.ts
import DOMPurify from 'dompurify'

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  })
}
```

3. Replace all dangerouslySetInnerHTML with sanitized version:
```typescript
<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
```

---

### 4. Missing CSRF Protection [HIGH]

**Severity:** High
**CWE:** CWE-352 (Cross-Site Request Forgery)
**Location:** All state-changing operations

**Description:**
No CSRF tokens or SameSite cookie attributes are implemented for state-changing operations.

**Evidence:**
- No CSRF token generation or validation found
- Supabase auth tokens stored in localStorage (not cookies)
- No SameSite cookie attributes configured

**Impact:**
- Attackers can craft malicious requests to:
  - Create/update/delete content
  - Upload files
  - Modify admin settings
- Users can be tricked into performing unwanted actions

**Recommendation:**
1. Configure Supabase auth with secure cookie settings:
```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: cookieStorage,
    flowType: 'pkce',
    cookieOptions: {
      sameSite: 'strict',
      secure: true,
      httpOnly: true
    }
  }
})
```

2. Implement CSRF token middleware for Next.js
3. Add CSRF token validation for all POST/PUT/DELETE operations

---

### 5. No Rate Limiting [HIGH]

**Severity:** High
**CWE:** CWE-770 (Allocation of Resources Without Limits or Throttling)
**Location:** All public endpoints

**Description:**
No rate limiting is implemented for public forms, authentication, or analytics endpoints.

**Evidence:**
```sql
-- Public insert policies with no rate limiting
CREATE POLICY contact_inquiries_public_insert ON contact_inquiries
  FOR INSERT WITH CHECK (true);  -- No limits!

CREATE POLICY page_views_public_insert ON page_views
  FOR INSERT WITH CHECK (true);  -- No limits!
```

**Impact:**
- Brute force attacks on login endpoint
- Spam submissions to contact forms
- Analytics data pollution
- Resource exhaustion (DoS)
- Database bloat from spam entries

**Recommendation:**
1. Implement rate limiting using Supabase Edge Functions or Vercel middleware:
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function middleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }
}
```

2. Add database-level rate limiting using PostgreSQL:
```sql
-- Limit contact form submissions per IP
CREATE TABLE rate_limits (
  ip_address inet PRIMARY KEY,
  submission_count int DEFAULT 0,
  last_reset timestamptz DEFAULT NOW()
);
```

3. Configure Supabase Realtime rate limits in dashboard

---

### 6. Sensitive Data Exposure in Client Code [HIGH]

**Severity:** High
**CWE:** CWE-200 (Exposure of Sensitive Information)
**Location:** `src/utils/seo.ts`, Client-side analytics

**Description:**
Sensitive information like email addresses, phone numbers, and business details are hardcoded in client-side JavaScript.

**Evidence:**
```typescript
// src/utils/seo.ts - Hardcoded in client bundle
contactPoint: {
  email: 'panditjoshirajesh@gmail.com',  // Exposed to scrapers
  telephone: '+353-XXX-XXXX'
}

// Structured data exposed in page source
sameAs: [
  'https://www.facebook.com/panditrajesh',
  'https://www.instagram.com/panditrajesh',
  // ... all social media links
]
```

**Impact:**
- Email harvesting by spam bots
- Contact information scraping
- Social engineering attacks
- Increased spam and phishing attempts

**Recommendation:**
1. Move sensitive data to environment variables:
```typescript
// .env.local
NEXT_PUBLIC_CONTACT_EMAIL=panditjoshirajesh@gmail.com
```

2. Use server-side rendering for structured data:
```typescript
// Server Component
export async function generateMetadata() {
  return {
    other: {
      'schema:contactPoint': process.env.CONTACT_EMAIL
    }
  }
}
```

3. Implement email obfuscation or contact forms instead of direct email display
4. Use reCAPTCHA for contact forms

---

### 7. Unrestricted File Upload [MEDIUM]

**Severity:** Medium
**CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
**Location:** `supabase/migrations/20241203000015_storage.sql`, `src/lib/storage.ts`

**Description:**
File upload MIME type restrictions are defined in database but not enforced in client-side code.

**Evidence:**
```sql
-- Storage bucket configuration
INSERT INTO storage.buckets (id, name, allowed_mime_types)
VALUES ('media', 'media', ARRAY[
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'
]);
```

**Concerns:**
- SVG files can contain JavaScript (XSS vector)
- File size limits may not be enforced client-side
- No filename sanitization visible
- No antivirus scanning

**Impact:**
- Upload of malicious SVG files with embedded scripts
- File storage abuse
- Potential server-side script execution

**Recommendation:**
1. Remove SVG from allowed types or sanitize:
```typescript
// Remove SVG: 'image/svg+xml' from allowed types
// OR sanitize SVG uploads
import sanitizeSVG from 'sanitize-svg'
```

2. Add client-side validation:
```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function validateFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large')
  }
}
```

3. Sanitize filenames to prevent path traversal:
```typescript
const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
```

4. Consider adding ClamAV or similar antivirus scanning

---

### 8. Insufficient Input Validation [MEDIUM]

**Severity:** Medium
**CWE:** CWE-20 (Improper Input Validation)
**Location:** Form handlers across admin components

**Description:**
While Zod is installed (`package.json`), no comprehensive input validation schema is visible for admin forms.

**Evidence:**
```typescript
// src/components/admin/AdminServices.tsx
const handleSubmit = async () => {
  // Direct submission without validation
  await createService(formData)
}
```

**Impact:**
- Malformed data in database
- Potential SQL injection (mitigated by Supabase parameterization)
- Business logic bypasses
- Data integrity issues

**Recommendation:**
1. Create Zod validation schemas:
```typescript
import { z } from 'zod'

const ServiceSchema = z.object({
  name: z.string().min(3).max(200),
  category: z.enum(['pooja', 'sanskar', 'paath', 'consultation', 'wellness']),
  description: z.string().min(10).max(5000),
  duration: z.string().regex(/^\d+\s*(min|minutes|hour|hours)$/),
  price: z.string().regex(/^€?\d+(\.\d{2})?$/),
  email: z.string().email().optional(),
  url: z.string().url().optional()
})
```

2. Validate all form inputs before submission:
```typescript
const handleSubmit = async () => {
  try {
    const validated = ServiceSchema.parse(formData)
    await createService(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Show validation errors
    }
  }
}
```

---

### 9. innerHTML Usage in SEO Utils [MEDIUM]

**Severity:** Medium
**CWE:** CWE-79 (Cross-Site Scripting)
**Location:** `src/utils/seo.ts:109`

**Description:**
Using `innerHTML` to inject structured data without sanitization.

**Evidence:**
```typescript
// src/utils/seo.ts
const script = document.createElement('script')
script.type = 'application/ld+json'
script.innerHTML = JSON.stringify(schema)  // Potential XSS if schema is tainted
```

**Impact:**
- XSS if schema data contains user input
- JSON injection attacks
- Script injection in structured data

**Recommendation:**
1. Use textContent instead of innerHTML:
```typescript
script.textContent = JSON.stringify(schema)
```

2. Validate schema structure before injection:
```typescript
function isValidSchema(obj: any): boolean {
  // Validate against allowed schema.org types
  const allowedTypes = ['Organization', 'Person', 'Service', ...]
  return allowedTypes.includes(obj['@type'])
}
```

---

### 10. Missing Security Headers [MEDIUM]

**Severity:** Medium
**CWE:** CWE-693 (Protection Mechanism Failure)
**Location:** Next.js configuration

**Description:**
No security headers configuration found in `next.config.js` or middleware.

**Missing Headers:**
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

**Impact:**
- Clickjacking attacks
- MIME-sniffing vulnerabilities
- Cross-origin data leaks
- Reduced defense-in-depth

**Recommendation:**
1. Add security headers to `next.config.js`:
```typescript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
          }
        ]
      }
    ]
  }
}
```

---

### 11. Weak Session Storage [MEDIUM]

**Severity:** Medium
**CWE:** CWE-522 (Insufficiently Protected Credentials)
**Location:** `src/lib/supabase.ts:22`

**Description:**
Authentication tokens are stored in localStorage, which is vulnerable to XSS attacks.

**Evidence:**
```typescript
storage: typeof window !== 'undefined' ? window.localStorage : undefined,
storageKey: 'sb-auth-token',
```

**Impact:**
- Session tokens accessible to JavaScript (XSS vulnerability)
- Tokens persist across browser sessions
- No HttpOnly protection
- Vulnerable to XSS token theft

**Recommendation:**
1. Switch to secure cookie storage:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: cookieStorage,
      cookieOptions: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      }
    }
  }
)
```

2. Implement token rotation
3. Set appropriate session timeout

---

### 12. Analytics Data Injection [LOW]

**Severity:** Low
**CWE:** CWE-89 (SQL Injection - via data pollution)
**Location:** `supabase/migrations/20241203000014_rls_policies.sql:174-176`

**Description:**
Public can insert unlimited analytics data without validation.

**Evidence:**
```sql
CREATE POLICY page_views_public_insert ON page_views
  FOR INSERT
  WITH CHECK (true);  -- No validation!
```

**Impact:**
- Analytics data pollution
- Resource exhaustion
- Inaccurate metrics
- Potential database bloat

**Recommendation:**
1. Add validation to analytics insertion:
```sql
CREATE POLICY page_views_public_insert ON page_views
  FOR INSERT
  WITH CHECK (
    page_url IS NOT NULL AND
    LENGTH(page_url) < 500 AND
    (user_agent IS NULL OR LENGTH(user_agent) < 500) AND
    (referrer IS NULL OR LENGTH(referrer) < 500)
  );
```

2. Implement server-side analytics processing
3. Add rate limiting (see #5)

---

### 13. Insufficient Error Handling [LOW]

**Severity:** Low
**CWE:** CWE-209 (Information Exposure Through Error Messages)
**Location:** Multiple auth and service files

**Description:**
Error messages may expose sensitive information about system internals.

**Evidence:**
```typescript
// src/services/auth.ts
if (error) {
  console.error('Login error:', error.message)  // May log sensitive data
  return false
}
```

**Impact:**
- Information disclosure about system architecture
- Database structure exposure
- Enumeration of valid usernames

**Recommendation:**
1. Implement generic error messages for users:
```typescript
catch (error) {
  console.error('Internal error:', error)  // Server logs only
  toast.error('An error occurred. Please try again.')  // Generic user message
}
```

2. Use structured logging
3. Never expose stack traces to users in production

---

### 14. Outdated Dependencies Risk [LOW]

**Severity:** Low
**CWE:** CWE-1395 (Dependency on Vulnerable Third-Party Component)
**Location:** `package.json`

**Description:**
No automated dependency vulnerability scanning detected. Some packages may have known vulnerabilities.

**Dependencies to Monitor:**
- `@supabase/supabase-js`: 2.86.0 (current: check for updates)
- `next`: 16.1.0 (ensure latest patch version)
- `react`: 19.0.0 (newly released, monitor for security patches)
- `marked`: 15.0.7 (Markdown parser - potential XSS)

**Impact:**
- Potential exploitation of known vulnerabilities
- Supply chain attacks
- Zero-day vulnerabilities

**Recommendation:**
1. Set up automated dependency scanning:
```bash
npm install -g npm-check-updates
npm audit
```

2. Add to CI/CD pipeline:
```yaml
# .github/workflows/security.yml
name: Security Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run npm audit
        run: npm audit --audit-level=moderate
```

3. Enable Dependabot alerts in GitHub
4. Review and update dependencies monthly

---

## Infrastructure & Configuration Issues

### Environment Variables
**Status:** ✅ Good
- `.env` properly in `.gitignore`
- `.env.example` provided with placeholders
- No secrets hardcoded (except in `seo.ts` - see #6)

### Supabase Configuration
**Status:** ⚠️ Needs Improvement
- RLS enabled on all tables ✅
- Public insert policies too permissive ⚠️
- Storage policies need tightening ⚠️
- Missing role-based access control ❌

### Next.js Configuration
**Status:** ⚠️ Needs Improvement
- No security headers ❌
- No middleware for auth ❌
- Static export mode limits security features ⚠️

---

## GDPR & Privacy Compliance

### Cookie Consent
**Status:** ✅ Implemented
- Cookie consent banner present
- Granular consent options
- Analytics respects consent

### Data Privacy
**Status:** ⚠️ Partial
- Privacy policy links present ✅
- Terms of service links present ✅
- No data retention policy visible ⚠️
- No "right to be forgotten" implementation ❌

---

## Recommendations Priority Matrix

### Immediate Actions (Critical & High Priority)
1. ✅ Implement server-side route protection (#1)
2. ✅ Fix RLS policies with role-based access (#2)
3. ✅ Sanitize all HTML output with DOMPurify (#3)
4. ✅ Implement CSRF protection (#4)
5. ✅ Add rate limiting (#5)

### Short-term (1-2 weeks)
6. Move sensitive data from client code (#6)
7. Restrict file upload types (#7)
8. Add comprehensive input validation (#8)
9. Configure security headers (#10)
10. Switch to cookie-based auth storage (#11)

### Medium-term (1 month)
11. Improve error handling (#13)
12. Set up dependency scanning (#14)
13. Add WAF (Web Application Firewall)
14. Implement security logging and monitoring
15. Conduct penetration testing

### Long-term (Ongoing)
16. Regular security audits
17. Security training for developers
18. Incident response plan
19. Bug bounty program
20. Security documentation

---

## Testing Recommendations

### Security Testing Checklist
- [ ] Authentication bypass attempts
- [ ] SQL injection testing (Supabase handles this)
- [ ] XSS payload testing
- [ ] CSRF token validation
- [ ] File upload malicious file testing
- [ ] Rate limiting verification
- [ ] RLS policy testing
- [ ] Session management testing
- [ ] Authorization bypass testing

### Tools Recommended
- **OWASP ZAP** - Automated security scanner
- **Burp Suite** - Manual testing and proxy
- **npm audit** - Dependency vulnerabilities
- **Snyk** - Continuous security monitoring
- **SonarQube** - Code quality and security

---

## Compliance Checklist

### OWASP Top 10 (2021)
- [ ] A01:2021 – Broken Access Control ❌ (See #1, #2)
- [ ] A02:2021 – Cryptographic Failures ✅ (Supabase handles)
- [ ] A03:2021 – Injection ⚠️ (Partial - See #3, #8)
- [ ] A04:2021 – Insecure Design ⚠️ (Multiple issues)
- [ ] A05:2021 – Security Misconfiguration ❌ (See #10)
- [ ] A06:2021 – Vulnerable Components ⚠️ (See #14)
- [ ] A07:2021 – Identification/Authentication ❌ (See #1, #11)
- [ ] A08:2021 – Software/Data Integrity ⚠️ (See #7)
- [ ] A09:2021 – Security Logging Monitoring ❌ (Not implemented)
- [ ] A10:2021 – Server-Side Request Forgery ✅ (Not applicable)

---

## Conclusion

The application has a **moderate to high security risk** profile. The most critical issues are:

1. **Authentication/Authorization** - Client-side only protection with weak RLS
2. **XSS Vulnerabilities** - Multiple dangerouslySetInnerHTML usage
3. **CSRF Protection** - Completely missing
4. **Rate Limiting** - No protection against abuse

**Positive Aspects:**
- Supabase provides good foundational security (RLS, parameterized queries)
- GDPR-compliant cookie consent
- Environment variables properly managed
- Error boundary implementation

**Overall Security Score:** 4.5/10

**Recommended Timeline:**
- Fix critical issues within 1 week
- Address high priority issues within 2-3 weeks
- Complete medium priority items within 1 month
- Ongoing security improvements and monitoring

---

## Appendix: Security Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

### Tools
- [OWASP ZAP](https://www.zaproxy.org/)
- [Snyk](https://snyk.io/)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)

### Contact
For security concerns or to report vulnerabilities, please contact the development team immediately.

---

**End of Report**
