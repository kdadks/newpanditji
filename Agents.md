# AI Agent & Developer Operating Guide (`Agents.md`)

Welcome to the **Pandit Rajesh Joshi Platform** (`pandit-rajesh-joshi`) codebase. This guide outlines standard operating procedures, architectural boundaries, coding conventions, and verification checklists for AI agents (and human contributors) modifying this project.

---

## 1. Core Principles & Guardrails

### 1.1 Non-Negotiable Security Rules
1. **Never Expose Service Role Secrets**:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are public client keys.
   - Any Supabase `SERVICE_ROLE_KEY` or `GMAIL_APP_PASSWORD` must **never** be placed in client components (`'use client'`) or committed to source control.
2. **Mandatory HTML Sanitization**:
   - All rich-text content originating from Tiptap, Quill, or database JSON fields MUST be sanitized using `sanitizeHtml()` from `src/utils/sanitize.ts` (powered by DOMPurify) prior to rendering with `dangerouslySetInnerHTML`.
3. **Respect Row Level Security (RLS)**:
   - When introducing or altering tables in `supabase/migrations/`, always add explicit RLS policies for `anon` (SELECT on published data only) and `authenticated` (full CRUD).
   - Never disable RLS on public-facing tables.
4. **Preserve SSR Cookie Authentication**:
   - Do not revert authentication to raw `localStorage`. The platform relies on `@supabase/ssr` `createBrowserClient` with PKCE to maintain sessions in HTTP cookies, enabling server-side security checks (mitigating CWE-602).
5. **Enforce Schema Isolation & Layer 2 Project Binding**:
   - The database resides in the dedicated PostgreSQL schema `panditji` on a shared Supabase instance.
   - All Supabase clients (`src/lib/supabase.ts`, `src/lib/supabase-server.ts`) MUST specify `db: { schema: 'panditji' }`.
   - In authentication checks and API guards, always verify `user.app_metadata.project === 'panditji'`.
6. **Air-Gapped Storage Buckets**:
   - Assets must use project-prefixed storage buckets: `panditji-media`, `panditji-documents`, `panditji-videos`, and `panditji-resources`. Never hardcode unprefixed legacy bucket names.

---

## 2. Tech Stack & Architectural Conventions

### 2.1 Next.js 16 (App Router) & React 19
- **Client vs. Server Components**:
  - The site relies on rich client interactivity (TanStack Query, stateful forms, animations). Add `'use client'` at the top of components utilizing hooks, browser events, or browser APIs.
  - Server route handlers live in `src/app/api/*/route.ts`. Use `NextRequest` and `NextResponse`.
  - Dynamic page slugs (e.g. `src/app/[slug]/page.tsx`, `src/app/blog/[slug]/page.tsx`) handle both static pages and dynamic database records.

### 2.2 Styling with Tailwind CSS v4 & Theming
- **Class Merging**: Always use `cn(...)` from `src/lib/utils.ts` when combining dynamic class names:
  ```tsx
  import { cn } from '@/lib/utils'
  // e.g. className={cn('base-classes', isActive && 'active-class', className)}
  ```
- **Design Tokens**: Sacred and cultural saffron/gold accents, earthy tones, and warm surfaces are defined via CSS variables in `src/styles/theme.css` and `src/main.css`. Avoid hardcoding ad-hoc hex values when theme variables are available.

### 2.3 Remote State & Data Fetching (TanStack React Query)
- **Hooks Pattern**: Public pages and admin panels access Supabase data via dedicated hooks in `src/hooks/` (e.g. `useServices.ts`, `useBlogs.ts`, `useSiteSettings.ts`).
- **Cache Invalidation**: On mutations (insert, update, delete), immediately call `queryClient.invalidateQueries({ queryKey: [...] })` to refresh data across all views.
- **Feedback**: Pair every user-initiated mutation with a `sonner` toast notification (`toast.success(...)` or `toast.error(...)`).

---

## 3. Directory Navigation & Modification Guide

| To Implement Or Edit... | Go To This Location |
| :--- | :--- |
| **New Public Page** | `src/app/<route>/page.tsx` and matching presentation component in `src/components/pages/` |
| **Global Layout, Nav, or Footer** | `src/app/layout.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx` |
| **Admin Panel Modules** | `src/components/admin/Admin[Entity].tsx` and route `src/app/admin/page.tsx` |
| **Reusable UI Atoms** | `src/components/ui/` (Radix primitives, Buttons, Dialogs, Inputs) |
| **Database Types & Interfaces** | `src/lib/types.ts` and `src/lib/supabase.ts` |
| **Data Fetching Hooks** | `src/hooks/use[Entity].ts` |
| **File / Media Upload Logic** | `src/lib/storage.ts` (uploads to `media` or `documents` Supabase buckets) |
| **Server API Handlers** | `src/app/api/<route>/route.ts` (protect with `requireAuth()` if private) |
| **Database Migrations** | `supabase/migrations/<timestamp>_<description>.sql` |

---

## 4. How-To: Common Development Recipes

### 4.1 Adding a New Service or Package
1. **Model Definition**: Ensure fields align with `ServiceRow` in `src/lib/supabase.ts` and `Service` in `src/lib/types.ts`.
2. **Admin Editor**: Add or edit the form controls in `src/components/admin/AdminServices.tsx`.
3. **Storage Uploads**: For Samagri checklists or custom brochures, utilize the file uploader connected to `src/lib/storage.ts` targeting the `documents` bucket.
4. **Display**: Verify the service renders accurately in `src/components/pages/ServicesPage.tsx`, checking category tabs and package highlight badges.

### 4.2 Adding a Dynamic Resource Center Module
1. Reference the specification in `plans/pandit-resource-center-spec.md`.
2. Edit module definitions in `src/components/admin/AdminResourceCenter.tsx`.
3. Validate module rendering in `src/components/pages/ResourceCenterPage.tsx` for all three module types: `text` (RichText), `mediaGallery` (photos/videos), and `fileAttachments` (PDF stotras/mantras).

### 4.3 Adding a Protected Admin API Endpoint
1. Create `src/app/api/<endpoint>/route.ts`.
2. Import `requireAuth` from `@/lib/auth-guard`:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { requireAuth } from '@/lib/auth-guard'

   export async function POST(request: NextRequest) {
     const auth = await requireAuth(request)
     if (auth instanceof NextResponse) return auth // Returns 401 if unauthorized
     const { user } = auth

     // Execute privileged logic...
     return NextResponse.json({ success: true })
   }
   ```

### 4.4 Creating or Updating Admin Users (Layer 2 Binding)
Never insert admin users via raw SQL directly into `auth.users`. Always use the canonical admin creation tool:
```bash
npm run create:admin <email> <password>
```
This utility:
- Calls the Supabase GoTrue Admin API to hash the password properly.
- Creates the required matching row in `auth.identities`.
- Attaches the Layer 2 binding: `app_metadata: { project: 'panditji', role: 'super_admin' }`.
- Syncs the admin record into `panditji.admin_users`.

### 4.5 Data & Analytics Cross-Database Migration
When migrating data from legacy or staging databases to the shared `panditji` schema:
```bash
# Migrate all tables, CMS content, and storage files
npm run migrate:shared

# Fast-sync analytics and visitor tracking tables only
npm run migrate:shared analytics
```

---

## 5. Verification & Pre-Commit Checklist

Before marking any task complete, verify your work using these steps:

- [ ] **Type Check & Build**:
  ```bash
  npm run build
  ```
  Ensure the Next.js production compilation completes without TypeScript or ESLint errors.
- [ ] **Lint Check**:
  ```bash
  npm run lint
  ```
- [ ] **Environment Resilience**:
  Verify the app gracefully handles missing optional environment variables (e.g. Gmail credentials for contact form, or GA4 tokens).
- [ ] **Sanitization Check**:
  Confirm any newly rendered HTML runs through `DOMPurify` / `src/utils/sanitize.ts`.
- [ ] **Mobile Responsiveness**:
  Check UI elements on mobile breakpoints (`md:`, `lg:` classes) to ensure responsiveness for users accessing ceremonies and contact forms on mobile devices.
- [ ] **No Secrets in Output**:
  Confirm no API keys, private passwords, or production database connection strings were introduced into client-accessible files.

---

## 6. Troubleshooting Common Agent Pitfalls

- **Issue**: `Module not found` or React 19 hook errors.
  - *Fix*: Check whether the file needs `'use client'` at line 1. Third-party UI components or hooks interacting with DOM/browser window require client directive.
- **Issue**: Supabase returns `42501` (permission denied / RLS violation).
  - *Fix*: Check `supabase/migrations/` to ensure an appropriate policy exists for the query role (`anon` for public reads, `authenticated` for admin mutations).
- **Issue**: Supabase GoTrue returns `500: Database error querying schema`.
  - *Root Cause*: (1) A custom trigger on `auth.users` failed because `supabase_auth_admin` lacked schema permissions; (2) Manual SQL inserted `NULL` values into string token columns (`confirmation_token`, `recovery_token`, `email_change`, etc.) which Go cannot scan into string primitives; or (3) A row is missing in `auth.identities`.
  - *Fix*: Drop custom triggers on `auth.users`, grant `USAGE` on schema `panditji` to `supabase_auth_admin`, and use `npm run create:admin` to create/bind users cleanly.
- **Issue**: Browser warning `User admin@... is not bound to project 'panditji' in app_metadata`.
  - *Root Cause*: When sharing a Supabase instance, localhost holds a session cookie from another project on the same instance (e.g. `seamusfoy`).
  - *Fix*: The platform automatically clears stale session cookies on login. In development, open an Incognito window or clear browser cookies for `localhost:3000`.
- **Issue**: PostgREST returns `PGRST205: Could not find the table 'panditji.<table_name>' in the schema cache`.
  - *Fix*: Verify the table exists in schema `panditji` and check Supabase Dashboard -> Project Settings -> API -> "Exposed schemas" includes `panditji`.
- **Issue**: Admin redirected to login repeatedly.
  - *Fix*: Check browser cookie storage. Supabase session cookies (`sb-*-auth-token`) must be present. Run `src/utils/clear-auth-tokens.ts` if corrupted legacy tokens conflict.
- **Issue**: Contact form returns 503 status code.
  - *Fix*: Verify `.env` contains `GMAIL_USER` and `GMAIL_APP_PASSWORD`.
