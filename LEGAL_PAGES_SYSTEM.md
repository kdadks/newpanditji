# Dynamic Legal Pages System

## Overview
You can now create and manage unlimited legal pages (Privacy Policy, Terms of Service, Cookie Policy, GDPR, etc.) entirely through the CMS **without any coding**.

## Features
✅ Create unlimited legal pages from CMS
✅ Each page has its own slug/URL
✅ Rich text editor for content sections
✅ SEO metadata management
✅ Publish/draft control
✅ No coding required

---

## How to Use

### 1. Access Legal Pages Manager
1. Go to Admin Panel `/admin`
2. Click on the "**Legal Pages**" tab (⚖️ icon)
3. You'll see a list of all legal pages

### 2. Create a New Legal Page
1. Click "**Create New Page**" button
2. Fill in:
   - **Page Title**: e.g., "Cookie Policy"
   - **URL Slug**: Auto-generated from title (e.g., "cookie-policy")
   - **Meta Title**: Optional SEO title
   - **Meta Description**: Optional SEO description
3. Click "**Create Page**"

### 3. Edit Page Content
1. Click "**Edit**" on any page
2. You can:
   - Update page title and SEO data
   - Add multiple content sections
   - Use rich text editor for formatting
   - Reorder sections
   - Remove sections
3. Toggle "**Publish**" to make it live
4. Click "**Save Changes**"

### 4. Access the Page
- Page will be accessible at: `https://yoursite.com/legal/{slug}`
- Example: `https://yoursite.com/legal/cookie-policy`
- Note: For consistency, keep Terms at `/terms` and Privacy at `/privacy` (legacy routes)

### 5. Add to Menu
1. Go to "**Header, Footer & Menu**" tab
2. Select "**Legal Menu**"
3. Add a new menu item:
   - **Label**: Cookie Policy
   - **URL**: /legal/cookie-policy
4. Save menu

---

## Page Structure

Each legal page contains:

### Page Settings
- **Title**: Main heading displayed on the page
- **Slug**: URL path (must be unique)
- **Meta Title**: For SEO/search engines
- **Meta Description**: Brief description for search results
- **Published Status**: Draft or live

### Sections
Each page can have multiple sections with:
- **Section Title**: Heading for the section
- **Content**: Rich text content with formatting

---

## Examples of Legal Pages You Can Create

1. **Privacy Policy** (slug: `privacy`)
2. **Terms & Conditions** (slug: `terms`)
3. **Cookie Policy** (slug: `cookie-policy`)
4. **GDPR Compliance** (slug: `gdpr`)
5. **Disclaimer** (slug: `disclaimer`)
6. **Refund Policy** (slug: `refund-policy`)
7. **Shipping Policy** (slug: `shipping-policy`)
8. **Acceptable Use Policy** (slug: `acceptable-use`)
9. **Data Protection** (slug: `data-protection`)
10. **Accessibility Statement** (slug: `accessibility`)

---

## How to Display Pages

### Option 1: Create Next.js Route (One-time setup)

Create a dynamic route file at `src/app/[slug]/page.tsx`:

\`\`\`tsx
import DynamicLegalPage from '@/components/pages/DynamicLegalPage'

interface PageProps {
  params: {
    slug: string
  }
}

export default function LegalPage({ params }: PageProps) {
  return <DynamicLegalPage slug={params.slug} />
}

// Generate static pages at build time
export async function generateStaticParams() {
  // Fetch all legal pages from database
  const { supabase } = await import('@/lib/supabase')
  const { data: pages } = await supabase
    .from('pages')
    .select('slug')
    .eq('template_type', 'legal')
    .eq('is_published', true)

  return pages?.map((page) => ({ slug: page.slug })) || []
}
\`\`\`

### Option 2: Link from Footer

Already integrated! Legal menu items in footer automatically link to these pages.

---

## Database Structure

### `pages` Table
\`\`\`sql
- id: UUID (primary key)
- slug: TEXT (unique) - URL path
- title: TEXT - Page title
- meta_title: TEXT - SEO title
- meta_description: TEXT - SEO description
- template_type: 'legal' - Identifies legal pages
- is_published: BOOLEAN - Draft/live status
\`\`\`

### `page_sections` Table
\`\`\`sql
- id: UUID (primary key)
- page_id: UUID - Links to pages table
- section_key: TEXT - e.g., 'section_1'
- title: TEXT - Section heading
- content: JSONB - Contains {html: '...'} with rich text
- sort_order: INTEGER - Display order
\`\`\`

---

## Benefits

### No Code Needed
- Create pages entirely from CMS
- No deployment required
- Instant updates

### SEO Optimized
- Custom meta titles and descriptions
- Proper HTML structure
- Search engine friendly URLs

### Flexible
- Add unlimited pages
- Unlimited sections per page
- Rich text formatting
- Easy reorganization

### Consistent Design
- Auto-styled with your theme
- Responsive layout
- Professional appearance

---

## Migration from Hardcoded Pages

### Old System (Hardcoded)
- Added `TermsPageEditor.tsx` and `PrivacyPageEditor.tsx`
- Required code changes for new pages
- Fixed functionality

### New System (Dynamic)
- One `DynamicPageEditor` works for all legal pages
- Create pages through UI
- No code changes needed

### Both Systems Work Together
- Existing Terms & Privacy pages still work
- Can be migrated to new system if desired
- Or keep both systems

---

## Tips & Best Practices

1. **Use Clear Slugs**: 
   - Good: `privacy-policy`, `terms-of-service`
   - Bad: `page1`, `legal-thing`

2. **Write Good Meta Descriptions**:
   - 150-160 characters
   - Describe what the page covers
   - Include key terms

3. **Organize with Sections**:
   - Break long content into titled sections
   - Makes reading easier
   - Better user experience

4. **Keep URLs Consistent**:
   - Once published, don't change slugs
   - Breaks external links

5. **Preview Before Publishing**:
   - Test content in draft mode
   - Toggle publish when ready

---

## Troubleshooting

### Page Not Showing
1. Check if page is published (toggle in editor)
2. Verify slug doesn't conflict with existing routes
3. Check database has `template_type = 'legal'`

### Can't Edit Page
1. Verify you're logged in as admin
2. Check page exists in database
3. Look for console errors

### Styling Issues
1. Check HTML is valid in rich text editor
2. Ensure proper class names are used
3. Verify Tailwind styles are loaded

---

## Future Enhancements

Potential additions:
- Page templates/presets
- Version history
- Bulk import/export
- Multi-language support
- Content scheduling
- Analytics integration

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify database connection
3. Review this documentation
4. Check Supabase logs

---

**Last Updated**: February 10, 2026
