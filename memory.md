# Project Memory & Knowledge Base – Pandit Rajesh Joshi Platform

## 1. Project Background & Identity

- **Platform Name**: Pandit Rajesh Joshi – Hindu Priest & Spiritual Guide (`pandit-rajesh-joshi`)
- **Primary Stakeholder**: Pandit Rajesh Joshi (based in Dublin / Ireland, serving the UK and Europe).
- **Core Mission**: Providing authentic Vedic rituals, Sanatan Dharma education, sanskars, spiritual counseling, and cultural resources to the Hindu diaspora in Ireland and Europe, alongside charitable community work in India and worldwide.
- **Repository Type**: Production Next.js full-stack web application with embedded headless CMS and Supabase PostgreSQL persistence.

---

## 2. Domain Models & Core Terminology

| Term | Domain Meaning & Implementation |
| :--- | :--- |
| **Pooja** | Vedic worship ceremonies (e.g., Satyanarayan, Griha Pravesh, Ganesh Puja, Navgraha Shanti). Represented in the `services` table under `category = 'pooja'`. |
| **Sanskar** | Sacred life-stage rituals (e.g., Vivah/Wedding, Naamkaran, Upanayan/Janeu, Antyeshti/Funeral rites). Category `sanskar`. |
| **Paath** | Scriptural recitations (e.g., Srimad Bhagavad Gita, Ramcharitmanas, Sundarkand, Chandi Paath). Category `paath`. |
| **Consultation** | Personal spiritual, horoscope, and astrological consultations (online or in-person). Category `consultation`. |
| **Service Packages** | Bundled offerings with package savings, included sub-services (`package_services` UUID array), and highlights. Stored in `services` with `is_package = true`. |
| **Samagri List** | Itemized list of ritual ingredients and ceremonial items needed by the family. Uploaded as PDF/document files to Supabase Storage `documents` bucket, stored as `samagri_file_url`. |
| **Dakshina** | Traditional voluntary honorarium for Vedic priests. The platform dedicates a `/dakshina` page detailing spiritual guidance, cultural ethics, and voluntary contribution structures. |
| **Resource Center** | Modular knowledge hub (`/pandit-resource-center`) containing Vedic mantras, stotras, festival calendars, and ritual instructions divided into dynamic modules (RichText, MediaGallery, FileAttachments). |
| **Charity Projects** | Philanthropic initiatives (e.g., cow care/Gaushala, child education, food distribution) tracked in `charity_projects`. |

---

## 3. Key Architectural Decisions & History

### 3.1 Migration from Vite SPA to Next.js App Router
- **Context**: The site originally started as a single-page Vite/React application.
- **Decision**: Migrated to Next.js 16 (App Router) to gain server-side rendering for blog posts, dynamic SEO open-graph tags, server API routes, and improved performance for international users.
- **Artifacts**: Legacy remnants like `src/App.tsx` and `src/vite-end.d.ts` still exist for compatibility reference, while Next.js App Router (`src/app/`) drives 100% of the active routing.

### 3.2 Database Upgrade to PostgreSQL 17 & Complete RLS Overhaul
- **Context**: Supabase upgraded to PostgreSQL 17, which enforces stricter schema validation and permissions.
- **Decision**: Executed `supabase-pg17-migration.mjs` and migration `pg17_rls_migration.sql` to explicitly declare granular Row Level Security (RLS) policies for all tables.
- **Principle**: Public anonymous role (`anon`) has read-only access to published records (`is_published = true`), while authenticated administrators (`authenticated`) have full write permissions.

### 3.3 Session Management: Shift from localStorage to SSR Cookies (CWE-602 Mitigation)
- **Problem**: Client-only authentication stored tokens in browser `localStorage`, which could not be read or verified by edge servers before page render.
- **Solution**: Implemented `@supabase/ssr` with `createBrowserClient` and `flowType: 'pkce'`. Auth cookies are now shared between client and Next.js server handlers.
- **Server Guard**: Added `src/lib/auth-guard.ts` using `supabase.auth.getUser()` to re-verify credentials with Supabase servers rather than trusting client claims.

### 3.4 Media Migration to Supabase Storage
- **Context**: Historical images were previously stored in Git or hotlinked across external hosts.
- **Execution**: Script `scripts/migrate-images-to-supabase.ts` uploaded all legacy imagery into the Supabase `media` bucket, and `scripts/migrate-cms-to-db.ts` remapped JSON/local links to immutable CDN URLs.

### 3.5 Dynamic Content Sections Pattern (JSONB in PostgreSQL)
- **Design**: Rather than enforcing rigid relational columns for each service section, services support dynamic expandable blocks (`core_aspects`, `special_notes`, `faqs`, `where_and_who`) stored as JSONB arrays with structured schema validation.
- **Benefits**: Allows the admin to construct bespoke layouts with custom icons, video links, bullet points, and background colors without altering database schemas.

### 3.6 Multi-Tenant Schema Isolation & `app.metadata` Binding Model
- **Context**: Migrating from dedicated standalone instance (`rhwzwjaqbobmrxmrebht`) to shared Supabase instance (`gsqfaguqsmnuoeuhpxro`) under dedicated PostgreSQL schema `panditji`.
- **3-Layer Security Architecture**:
  - **Layer 1: Anonymous (Unauthenticated) Isolation**: `anon` visitors can only read published content (`is_published = true`) and insert into public visitor tables (`contact_inquiries`, `user_cookie_consents`, `page_views`, `service_views`, `referrer_sources`, `testimonials`).
  - **Layer 2: Irreversible 1-to-1 User Project Binding**: Global `auth.users` accounts are bound to project `'panditji'` via `raw_app_meta_data->>'project' = 'panditji'` and role `'super_admin'`. Helper `panditji.is_admin()` verifies both auth and project claim.
  - **Layer 3: Database RLS Air-Gap**: 100% of tables in schema `panditji` enforce RLS requiring `panditji.is_admin()`. Users authenticated to other projects on the shared Supabase instance are completely air-gapped from draft content and write operations.
  - **Prefixed Storage**: Shared storage uses `panditji-media`, `panditji-documents`, `panditji-videos`, and `panditji-resources` with air-gapped storage RLS policies.
- **Supabase GoTrue & Auth Admin Permissions**:
  - Supabase Auth (GoTrue) executes internal auth queries and updates `last_sign_in_at` as the system role `supabase_auth_admin`.
  - Attaching triggers directly to `auth.users` that call functions in custom schemas will cause GoTrue to fail with `500: Database error querying schema` unless `supabase_auth_admin` has explicit `USAGE` and `EXECUTE` privileges. To prevent auth failures, triggers on `auth.users` were dropped and `panditji` schema access was granted to `supabase_auth_admin`.
- **Migration Artifacts**:
  - `supabase/migrations/20261126000001_panditji_schema_ddl.sql`: Complete DDL, RLS, functions, triggers, and storage setup.
  - `supabase/migrations/20261126000002_panditji_data_migration.sql`: Idempotent data migration, URL remapping, and user binding.
  - `supabase/migrations/20261126000003_panditji_baseline_seed.sql`: Production baseline seed data.
  - `supabase/migrations/20261126000004_analytics_schema_fix.sql`: Analytics aggregate table and page views compatibility triggers.
  - `scripts/migrate-to-shared-schema.ts`: Automated CLI migration utility (`npm run migrate:shared [table_or_group]`).
  - `scripts/create-admin-user.ts`: Dedicated admin creation and binding CLI (`npm run create:admin`).

### 3.7 Analytics & Visitor Tracking Architecture
- **Analytics Aggregation**: The dashboard queries `panditji.analytics_summary` for 30-day traffic metrics, top pages, device breakdowns, and bounce rates.
- **Bidirectional Column Synchronization**: Legacy tracking code sends `page_slug` and `viewed_at`, whereas standard schema definitions specify `page_path` and `created_at`. PostgreSQL trigger `panditji.sync_page_views_compat()` automatically cross-populates both pairs on `INSERT` or `UPDATE`.
- **Foreign Key Resiliency for Service Views**: Old databases often accumulate view logs for services that have since been deleted. `scripts/migrate-to-shared-schema.ts` nulls orphaned `service_id`s, retaining the full visitor count, timestamp, and `service_name` without foreign key constraint violations.

---

## 4. Known Gotchas, Quirks & Workarounds

1. **`middleware.ts.disabled` File**:
   - The server middleware file is named `middleware.ts.disabled` with matcher set to `/_middleware_disabled_`.
   - **Reason**: During the Vercel dxb1 incident (2026-03-02), edge middleware builds were failing deployment. Route security is actively enforced via `src/lib/auth-guard.ts` on API routes and client-side auth redirection in `AdminLayout.tsx` & `useAuth.ts`.
   - **Action**: When reactivating edge middleware, rename to `middleware.ts` and set matcher back to `['/admin/:path*']`.

2. **React 19 Compatibility**:
   - The project runs on React 19 (`^19.0.0`).
   - Some legacy third-party editor packages require careful handling of types or dynamic client-only imports (`'use client'`).

3. **Client-Side Document Title Hydration**:
   - In `src/app/layout.tsx`, dynamic SEO metadata is fetched from `site_metadata` on mount and modifies `document.title` and meta tags dynamically. When editing layouts, avoid interfering with this hook to keep CMS-configured titles intact.

4. **Contact Form Email Prerequisites**:
   - The contact form (`/api/contact`) uses Nodemailer with Gmail SMTP.
   - It requires `GMAIL_USER` and `GMAIL_APP_PASSWORD` in the environment. If missing, the API responds with a graceful 503 error instructing the devotee to contact via phone or WhatsApp.

5. **Cache Control for Real-Time CMS Updates**:
   - `next.config.js` sets `Cache-Control: no-cache, no-store, must-revalidate` for all HTML pages.
   - This ensures that when Panditji edits a service or publishes a blog post in the admin panel, visitors see the updates immediately without stale caching.

6. **Cross-Project Shared Auth Cookie Pollution**:
   - When sharing a Supabase instance between multiple websites (e.g. `seamusfoy` and `panditji`), browsers test-running both projects on `localhost` will retain cookies for the foreign user.
   - `src/services/auth.ts` calls `clearAllAuthData()` prior to login attempts, clearing conflicting local keys and invalidating stale foreign tokens.

7. **Supabase GoTrue Scan Errors (`Database error querying schema`)**:
   - GoTrue (written in Go) parses `auth.users` text fields into primitive string struct fields. If columns like `confirmation_token`, `recovery_token`, or `email_change` are `NULL` rather than `''`, Go's database driver crashes with `converting NULL to string is unsupported` (HTTP 500).
   - Furthermore, GoTrue requires every user to have a matching row in `auth.identities` (with UUID `id`, `provider = 'email'`, `provider_id = user.id::text`).
   - Use `npm run create:admin <email> <password>` rather than manual SQL inserts to guarantee safe user creation.

8. **Next.js Dev Overlay on Operational Log Warnings**:
   - `src/components/AuthErrorHandler.tsx` intercepts `console.error` calls. To prevent standard login validation errors or empty analytics state queries from popping up full-screen red error screens, auth and analytics services use `console.warn` for expected operational errors.

---

## 5. Environment Variables & Configuration

The application requires specific environment variables for core runtime functionality, email notifications, and administrative data migrations.

### 5.1 Runtime Environment Variables Matrix

| Variable Name | Scope | Required? | Default / Fallback | Purpose & Details |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client + Server) | **Yes** | Fallback to hardcoded URL if not set | The URL of your Supabase instance (e.g. `https://xxxx.supabase.co`). Needed by `@supabase/ssr` to query the database and verify authentication. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public (Client + Server) | **Yes** | `SUPABASE_PUBLISHABLE_KEY` or `'dummy_key_for_build'` | Public anonymous/publishable key (`anon` key). Used for browser client queries under RLS. |
| `NEXT_PUBLIC_SUPABASE_SCHEMA` | Public (Client + Server) | Recommended | `'panditji'` | Custom PostgreSQL schema name for multi-tenant isolation. |
| `GMAIL_USER` | Server Only (`/api/contact`) | **Yes** (for contact form) | `None` (returns 503 if omitted) | Gmail account username/email used by Nodemailer to dispatch devotee inquiries to `panditjoshirajesh@gmail.com`. |
| `GMAIL_APP_PASSWORD` | Server Only (`/api/contact`) | **Yes** (for contact form) | `None` (returns 503 if omitted) | 16-character Google App Password generated in Google Account Security settings (2FA required). |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public (Client) | Optional | Fallback to `site_metadata` in Supabase | Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`). If not provided at build time, the client queries `site_metadata` for `ga4_measurement_id`. |
| `NODE_ENV` | Runtime | Auto-set | `'development'` / `'production'` | Controls debug logging, error boundary propagation, and localhost analytics bypass. |

### 5.2 Scripts & Database Maintenance Variables

These variables are **never exposed to the browser client** and are used only when running CLI scripts in `scripts/`:

| Variable Name | Scope | Required For | Purpose & Details |
| :--- | :--- | :--- | :--- |
| `TARGET_SUPABASE_KEY` (or `SUPABASE_SECRET_KEY`) | Server / CLI Scripts Only | Data migrations & DB cleanup | Supabase Service Role key (must start with `sb_secret_` or legacy service key). Bypasses RLS to insert and migrate records into schema `panditji`. |
| `SOURCE_SUPABASE_URL` / `SOURCE_SUPABASE_KEY` | CLI Scripts Only | `scripts/migrate-to-shared-schema.ts` | Credentials to read records and binary assets from the legacy source database. |
| `DATABASE_URL` (or `POSTGRES_URL` / `SUPABASE_DB_URL`) | CLI Scripts Only | Low-level DDL migrations | Direct PostgreSQL connection string with credentials used for low-level DDL migrations. |

### 5.3 Common Environment Gotchas
- **Spelling Errors**: Be careful of typos in `.env` names (such as `NEXT_PUBLIC_SUPASBASE_URL` with an extra "S"). The codebase specifically looks for `NEXT_PUBLIC_SUPABASE_URL`.
- **Legacy Aliases**:
  - `SUPABASE_PUBLISHABLE_KEY` is recognized as a fallback for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
  - `VITE_SUPABASE_URL` is accepted as a fallback by standalone migration scripts in `scripts/`.
- **Secret Key vs Publishable Key**: The migration tool (`migrate:shared`) and admin creation CLI (`create:admin`) require a Secret Key (`sb_secret_...`). Supplying a publishable key will cause RLS to reject all insert mutations.
- **Security Check**: Never commit `.env` or files containing `SUPABASE_SECRET_KEY` or `GMAIL_APP_PASSWORD` to public version control.

---

## 6. Database Schema Reference

| Table Name | Description | Key Attributes |
| :--- | :--- | :--- |
| `services` | All ritual services & packages | `id`, `slug`, `name`, `category_id`, `price`, `duration`, `is_package`, `package_services`, `core_aspects`, `samagri_file_url`, `is_published` |
| `blog_posts` | Spiritual articles and guides | `id`, `slug`, `title`, `content`, `excerpt`, `featured_image_url`, `tags`, `is_published`, `view_count` |
| `books` | Published spiritual literature | `id`, `title`, `author`, `cover_image_url`, `preview_pdf_url`, `amazon_url`, `flipkart_url`, `page_count`, `is_published` |
| `videos` | YouTube discourses and rituals | `id`, `youtube_id`, `title`, `description`, `category`, `is_featured`, `is_published` |
| `gallery_photos` | Photo gallery of rituals | `id`, `title`, `image_url`, `category`, `sort_order`, `is_featured`, `is_published` |
| `charity_projects`| Charitable initiatives | `id`, `title`, `description`, `goal_amount`, `current_amount`, `image_url`, `status`, `is_published` |
| `testimonials` | Devotee testimonials & reviews | `id`, `client_name`, `location`, `rating`, `comment`, `service_received`, `is_approved`, `is_featured` |
| `site_settings` | Global contact & branding | `id`, `primary_email`, `primary_phone`, `whatsapp_number`, `address`, `city`, `business_hours`, `maintenance_mode` |
| `site_metadata` | Dynamic SEO & tracking tokens | `setting_key`, `setting_value`, `category` (e.g. `ga4_measurement_id`, `site_title`) |
| `menus` / `menu_items` | Dynamic navigation hierarchy | `menu_id`, `parent_id`, `label`, `url`, `sort_order`, `is_visible` |
| `resource_sections`| Pandit Resource Center modules | `id`, `title`, `slug`, `description`, `content_json`, `documents`, `sort_order`, `is_published` |
| `analytics_summary`| Daily aggregated metrics | `id`, `date`, `total_page_views`, `unique_visitors`, `total_sessions`, `top_pages`, `device_breakdown` |
| `page_views` | Devotee page visit telemetry | `id`, `page_slug`, `page_path`, `referrer_domain`, `country`, `country_code`, `city`, `viewed_at` |
| `service_views` | Ritual package interest logs | `id`, `service_id`, `service_name`, `country`, `city`, `session_id`, `created_at` |
| `referrer_sources` | Inbound traffic channels | `id`, `source_url`, `source_domain`, `visit_count`, `last_visit` |
| `user_cookie_consents`| GDPR compliance records | `id`, `consent_token`, `categories`, `ip_address`, `created_at` |

---

## 7. Scripts & Utility Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server (default port 3000) |
| `npm run build` | Builds optimized production bundle via Next.js compiler |
| `npm run start` | Runs the production build locally |
| `npm run lint` | Runs ESLint checks across the codebase |
| `npm run migrate:shared` | Migrates all tables, schemas, and storage objects to target schema `panditji` |
| `npm run migrate:shared analytics` | Fast sync of analytics tables (`referrer_sources`, `page_views`, `service_views`, etc.) |
| `npm run create:admin <email> <pass>` | Creates or updates admin user with Layer 2 project binding and identities |
| `npm run migrate` | Executes `scripts/migrate-data.ts` to sync local CMS JSON fixtures to Supabase |
| `npm run migrate:images` | Runs `scripts/migrate-images-to-supabase.ts` to upload local assets to Supabase Storage |
| `npm run migrate:pg17` | Runs `scripts/supabase-pg17-migration.mjs` for PostgreSQL 17 RLS policy alignment |
| `npx tsx scripts/cleanup-db.ts` | Cleans up orphaned or duplicate records in database |

---

## 8. Strategic Roadmap & Future Considerations

1. **Online Booking & Calendar Integration**:
   - Currently, devotees inquire via contact form and WhatsApp.
   - Future milestone: Interactive ceremony calendar booking with automated date-availability checks for Panditji.
2. **Re-activation of Server Edge Middleware**:
   - Test and re-enable `middleware.ts` for edge-level route authorization once deployment provider constraints permit.
3. **Multi-Language Expansion**:
   - Adding native Hindi / Sanskrit script toggle alongside English for mantras and stotras in the Pandit Resource Center.
4. **Enhanced Search Experience**:
   - Full-text search or vector embeddings for the Blog and Pandit Resource Center articles.
