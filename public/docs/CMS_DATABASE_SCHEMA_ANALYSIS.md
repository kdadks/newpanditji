# CMS Database Schema Analysis

## Executive Summary

The admin CMS currently stores page content in **localStorage** instead of the database. This document provides a detailed breakdown of all CMS components, their data structures, and the required database schema to migrate everything to Supabase.

---

## Current State Analysis

### localStorage Keys Currently Used

| Key | Content Type | Data Structure |
|-----|--------------|----------------|
| `cms_home` | HomePageContent | Hero, Gallery, Services, Sacred Spaces, Features, CTA |
| `cms_about` | AboutPageContent | Hero, Profile, Stats, Journey, Expertise, Gallery, Cards |
| `cms_whyChoose` | WhyChooseContent | Hero, Quick Benefits, Reasons (6), CTA |
| `cms_books` | BooksPageContent | Hero only |
| `cms_contact` | ContactPageContent | Hero, Email, Phone, WhatsApp, Address |
| `cms_charity` | CharityPageContent | Hero, Statistics, Featured Projects, Service Areas, Mission, CTA |
| `cms_header` | HeaderContent | Logo, Site Name, Tagline, CTA |
| `cms_footer` | FooterContent | Description, Copyright, Social URLs |
| `cms_menu` | MenuItem[] | Label, URL, Order |

### Existing Database Tables (Already in Use)

| Table | Purpose | Used By |
|-------|---------|---------|
| `site_settings` | Global site config (email, phone, social, colors) | `useSiteSettings` hook |
| `menus` | Menu definitions | `useMenus` hook |
| `menu_items` | Menu navigation items | `useMenus` hook |
| `pages` | Page SEO metadata | `usePageContent` hook |
| `page_sections` | Section content (JSONB) | `usePageContent` hook |
| `services` | Service catalog | `useServices` hook |
| `books` | Book catalog | `useBooks` hook |
| `videos` | Video gallery | `useVideos` hook |
| `gallery_photos` | Photo gallery | `usePhotos` hook |
| `testimonials` | Client testimonials | `useTestimonials` hook |
| `charity_projects` | Charity projects | `useCharity` hook |
| `blog_posts` | Blog articles | `useBlogs` hook |

---

## Detailed CMS Component Breakdown

### 1. HOME PAGE (`cms_home`)

```typescript
interface HomePageContent {
  hero: {
    title: string;              // "Experience Authentic Hindu Ceremonies"
    subtitle: string;           // "Traditional Hindu Priest & Spiritual Guide"  
    description: string;        // Main description text
    backgroundImages: string[]; // Array of 4 background image URLs
    profileImage: string;       // Pandit ji's photo
    statistics: Array<{
      label: string;
      value: string;
    }>;                         // 4 stats: Poojas, Clients, Years, Books
    ctaButtons: Array<{
      text: string;
      link: string;
      variant: 'primary' | 'outline';
    }>;                         // 3 CTA buttons
  };
  photoGallery: {
    badge: string;              // "Our Journey"
    title: string;              
    description: string;
    images: string[];           // 6 gallery images
  };
  services: {
    badge: string;              // "Our Sacred Services"
    title: string;
    description: string;
    buttonText: string;         // "View All 40+ Services"
  };
  sacredSpaces: Array<{
    image: string;
    title: string;
    location: string;
  }>;                           // 4 temple/space images
  featureCards: Array<{
    title: string;
    description: string;
    icon: string;               // Phosphor icon name
  }>;                           // 3 feature cards
  ctaSection: {
    title: string;
    description: string;
    ctaButtons: Array<{
      text: string;
      link: string;
      variant: string;
    }>;
  };
}
```

**Sections to Store:** `hero`, `photo_gallery`, `services_preview`, `sacred_spaces`, `feature_cards`, `cta_section`

---

### 2. ABOUT PAGE (`cms_about`)

```typescript
interface AboutPageContent {
  hero: HeroContent;            // Same structure as home hero
  profileImage: string;
  badge: string;                // "Hindu Scholar & Spiritual Guide"
  name: string;
  title: string;                // "eYogi Raj"
  shortBio: string;
  statistics: StatisticItem[];  // 4 stats
  ctaButtons: CTAButton[];      // 3 buttons
  spiritualJourney: {
    title: string;
    content: string;            // Rich HTML content
    meditationPrograms: string[];
    literaryContributions: {
      title: string;
      description: string;
      books: string[];
    };
    poetrySection: {
      title: string;
      description: string;
    };
  };
  expertiseAreas: string[];     // 8 expertise tags
  academicCard: CardInfo;
  industrialistCard: CardInfo;
  gurukulCard: CardInfo;
  photoGallery: {
    badge: string;
    title: string;
    description: string;
    images: Array<{ src: string; alt: string }>;
  };
  whatToExpect: {
    badge: string;
    title: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
    }>;                         // 7 features
  };
  communityService: {
    badge: string;
    title: string;
    services: Array<{
      title: string;
      description: string;
    }>;                         // 2 services
  };
}
```

**Sections to Store:** `hero`, `profile`, `spiritual_journey`, `expertise`, `info_cards`, `photo_gallery`, `what_to_expect`, `community_service`

---

### 3. WHY CHOOSE US PAGE (`cms_whyChoose`)

```typescript
interface WhyChooseContent {
  hero: HeroContent;
  quickBenefits: Array<{
    icon: string;
    label: string;
  }>;                           // 6 quick benefit icons
  reasons: Array<{
    title: string;
    description: string;
    impact: string;
    highlights: string[];
    shloka?: {
      sanskrit: string;
      reference: string;
      hindi: string;
      english: string;
    };
  }>;                           // 6 detailed reasons
  ctaSection: {
    title: string;
    description: string;
    buttons: CTAButton[];
  };
}
```

**Sections to Store:** `hero`, `quick_benefits`, `reasons`, `cta_section`

---

### 4. BOOKS PAGE (`cms_books`)

```typescript
interface BooksPageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImages: string[];
  };
}
```

**Sections to Store:** `hero`
**Note:** Actual books data comes from `books` table via `useBooks` hook

---

### 5. CONTACT PAGE (`cms_contact`)

```typescript
interface ContactPageContent {
  hero: HeroContent;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
}
```

**Sections to Store:** `hero`, `contact_info`
**Note:** Email, phone, whatsapp, address also exist in `site_settings` - consolidate!

---

### 6. CHARITY PAGE (`cms_charity`)

```typescript
interface CharityPageContent {
  hero: {
    badge: string;              // "Serving Since 2001"
    title: string;              // "eYogi Gurukul"
    subtitle: string;
    description: string;
    backgroundImages: string[];
  };
  statistics: Array<{
    value: string;
    label: string;
  }>;                           // 4 statistics
  featuredProjects: {
    badge: string;
    title: string;
    description: string;
    videoUrl: string;
    stats: Array<{ value: string; label: string }>;
  };
  serviceAreas: Array<{
    icon: string;
    title: string;
    description: string;
    stats: string;
  }>;                           // 3 service areas
  missionStatement: {
    title: string;
    description: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  ctaSection: {
    title: string;
    description: string;
    buttons: CTAButton[];
  };
}
```

**Sections to Store:** `hero`, `statistics`, `featured_projects`, `service_areas`, `mission_statement`, `cta_section`

---

### 7. HEADER (`cms_header`)

```typescript
interface HeaderContent {
  logoUrl: string;              // Also in site_settings.site_logo_url
  siteName: string;
  tagline: string;
  ctaText: string;
  ctaLink: string;
}
```

**Storage:** Should be in `site_settings` table (partially already is)

---

### 8. FOOTER (`cms_footer`)

```typescript
interface FooterContent {
  description: string;          // Also in site_settings.footer_text
  copyrightText: string;        // Also in site_settings.copyright_text
  facebookUrl: string;          // Also in site_settings.facebook_page_url
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  pinterestUrl: string;
}
```

**Storage:** Already mostly in `site_settings` table - migrate fully!

---

### 9. MENU (`cms_menu`)

```typescript
interface MenuItem {
  id?: string;
  label: string;
  url: string;
  order: number;
}
```

**Storage:** Already in `menus` + `menu_items` tables via `useMenus` hook

---

## Recommended Database Schema Changes

### Option A: Use Existing `page_sections` Table (Recommended)

The `page_sections` table already exists with a JSONB `content` column perfect for storing flexible content:

```sql
-- Already exists in migration 20241203000002_pages.sql
CREATE TABLE page_sections (
  id UUID PRIMARY KEY,
  page_id UUID REFERENCES pages(id),
  section_key TEXT NOT NULL,      -- 'hero', 'photo_gallery', 'cta_section', etc.
  section_type TEXT NOT NULL,     -- 'hero', 'gallery', 'features', etc.
  title TEXT,
  subtitle TEXT,
  content JSONB DEFAULT '{}',     -- All section-specific content
  background_color TEXT,
  background_image_url TEXT,
  sort_order INTEGER,
  is_visible BOOLEAN,
  UNIQUE(page_id, section_key)
);
```

**Required Actions:**
1. Ensure pages exist for: `home`, `about`, `why-choose-us`, `books`, `contact`, `charity`
2. Add sections to `page_sections` for each page's content

### Option B: Update `site_settings` Table

Add missing header/footer fields:

```sql
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS 
  site_name TEXT DEFAULT 'Pandit Rajesh Joshi',
  site_tagline TEXT DEFAULT 'Hindu Priest & Spiritual Guide',
  header_cta_text TEXT DEFAULT 'Book Consultation',
  header_cta_link TEXT DEFAULT '/contact',
  pinterest_url TEXT;
```

---

## Migration Steps

### Step 1: Seed Pages Table

```sql
INSERT INTO pages (slug, title, template_type, is_published) VALUES
  ('home', 'Home', 'home', true),
  ('about', 'About Us', 'about', true),
  ('why-choose-us', 'Why Choose Us', 'static_content', true),
  ('books', 'Books', 'books', true),
  ('contact', 'Contact', 'contact', true),
  ('charity', 'Charity', 'charity', true)
ON CONFLICT (slug) DO NOTHING;
```

### Step 2: Create Hook for CMS Content

```typescript
// src/hooks/useCmsContent.ts
export function useCmsContent(pageSlug: string) {
  // Fetch page and its sections
  // Provide typed content getters
  // Handle save operations
}
```

### Step 3: Update AdminContent.tsx

Replace localStorage reads/writes with:
- `useCmsContent('home')` for home page
- `useCmsContent('about')` for about page
- etc.

### Step 4: Data Migration Script

```typescript
// scripts/migrate-cms-to-db.ts
// Reads localStorage exports and inserts into page_sections
```

---

## Summary: What Needs Migration

| Content | Current Storage | Target Storage | Status |
|---------|-----------------|----------------|--------|
| Home Page | localStorage | page_sections | 🔴 Needs Migration |
| About Page | localStorage | page_sections | 🔴 Needs Migration |
| Why Choose Page | localStorage | page_sections | 🔴 Needs Migration |
| Books Page | localStorage | page_sections | 🔴 Needs Migration |
| Contact Page | localStorage | page_sections + site_settings | 🔴 Needs Migration |
| Charity Page | localStorage | page_sections | 🔴 Needs Migration |
| Header | localStorage + site_settings | site_settings (extend) | 🟡 Partial |
| Footer | localStorage + site_settings | site_settings | 🟡 Partial |
| Menu | localStorage + menu_items | menu_items (already exists) | 🟡 Partial |
| Services | Database (services table) | - | ✅ Done |
| Books Catalog | Database (books table) | - | ✅ Done |
| Videos | Database (videos table) | - | ✅ Done |
| Photos | Database (gallery_photos) | - | ✅ Done |
| Testimonials | Database (testimonials) | - | ✅ Done |
| Blog Posts | Database (blog_posts) | - | ✅ Done |

---

## Files to Create/Modify

### New Files
1. `supabase/migrations/20241203000021_seed_pages.sql` - Seed page records
2. `supabase/migrations/20241203000022_extend_site_settings.sql` - Add header fields
3. `src/hooks/useCmsContent.ts` - New hook for page content
4. `scripts/migrate-cms-to-db.ts` - Migration script

### Modified Files
1. `src/components/admin/AdminContent.tsx` - Use database instead of localStorage
2. `src/lib/supabase.ts` - Add CMS content types
3. `src/hooks/useSiteSettings.ts` - Handle new header fields

---

## Priority Implementation Order

1. **High Priority:** Create seed migration for pages
2. **High Priority:** Create `useCmsContent` hook  
3. **High Priority:** Update AdminContent.tsx
4. **Medium Priority:** Add header fields to site_settings
5. **Medium Priority:** Create data migration script
6. **Low Priority:** Remove localStorage fallbacks after migration

---

*Generated: Auto-analysis of CMS components for database migration*
