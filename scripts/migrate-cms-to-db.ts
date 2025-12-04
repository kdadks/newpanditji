/**
 * CMS Data Migration Script
 * 
 * This script migrates CMS content from localStorage to the Supabase database.
 * Run this script ONCE after deploying the new database migrations.
 * 
 * Usage:
 *   1. Open the website in a browser where localStorage has the CMS data
 *   2. Open browser console (F12)
 *   3. Copy and paste this script into the console
 *   4. The script will export data and attempt to migrate it
 * 
 * Alternatively, run via Node.js:
 *   npx ts-node scripts/migrate-cms-to-db.ts
 */

// For browser console usage
(async function migrateCmsToDatabase() {
  console.log('=== CMS Data Migration Script ===\n')

  // Step 1: Export localStorage data
  const localStorageKeys = [
    'cms_home',
    'cms_about', 
    'cms_whyChoose',
    'cms_books',
    'cms_contact',
    'cms_charity',
    'cms_header',
    'cms_footer',
    'cms_menu'
  ]

  console.log('Step 1: Checking localStorage for CMS data...\n')
  
  const exportedData: Record<string, unknown> = {}
  let hasData = false

  localStorageKeys.forEach(key => {
    const data = localStorage.getItem(key)
    if (data) {
      try {
        exportedData[key] = JSON.parse(data)
        console.log(`✅ Found data for: ${key}`)
        hasData = true
      } catch (e) {
        console.log(`❌ Invalid JSON for: ${key}`)
      }
    } else {
      console.log(`⚪ No data for: ${key}`)
    }
  })

  if (!hasData) {
    console.log('\n⚠️ No CMS data found in localStorage.')
    console.log('The database will use default content from cms-defaults.ts')
    return
  }

  // Step 2: Display export data
  console.log('\n\nStep 2: Exported Data Summary\n')
  console.log(JSON.stringify(exportedData, null, 2))

  // Step 3: Generate SQL for manual migration
  console.log('\n\nStep 3: SQL Migration Statements\n')
  console.log('Copy and run these SQL statements in Supabase SQL Editor:\n')

  // Generate SQL for page sections
  const pageSlugMap: Record<string, string> = {
    'cms_home': 'home',
    'cms_about': 'about',
    'cms_whyChoose': 'why-choose-us',
    'cms_books': 'books',
    'cms_contact': 'contact',
    'cms_charity': 'charity'
  }

  for (const [key, slug] of Object.entries(pageSlugMap)) {
    if (exportedData[key]) {
      console.log(`\n-- ${key.replace('cms_', '').toUpperCase()} PAGE --`)
      console.log(`-- First, get the page ID:`)
      console.log(`-- SELECT id FROM pages WHERE slug = '${slug}';`)
      console.log(`-- Then update page_sections with the content from localStorage`)
    }
  }

  // Step 4: Provide cleanup instructions
  console.log('\n\n=== After Migration ===\n')
  console.log('Once data is migrated to the database, clear localStorage:')
  console.log('')
  localStorageKeys.forEach(key => {
    console.log(`localStorage.removeItem('${key}');`)
  })

  // Step 5: Save export to file
  console.log('\n\n=== Export to File ===\n')
  const exportJson = JSON.stringify(exportedData, null, 2)
  const blob = new Blob([exportJson], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  console.log('Download link created. Right-click and save:')
  console.log(url)

  // Also copy to clipboard
  try {
    await navigator.clipboard.writeText(exportJson)
    console.log('\n✅ Export data copied to clipboard!')
  } catch (e) {
    console.log('\n⚠️ Could not copy to clipboard. Use the download link above.')
  }

  return exportedData
})()

/**
 * Node.js version for automated migration
 * This connects to Supabase and migrates the data directly
 */
export async function migrateFromLocalStorageExport(
  exportedData: Record<string, unknown>,
  supabaseUrl: string,
  supabaseKey: string
) {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseKey)

  const pageSlugMap: Record<string, string> = {
    'cms_home': 'home',
    'cms_about': 'about',
    'cms_whyChoose': 'why-choose-us',
    'cms_books': 'books',
    'cms_contact': 'contact',
    'cms_charity': 'charity'
  }

  // Section key mappings for each page type
  type TransformFn = (data: unknown, fullData?: Record<string, unknown>) => unknown
  const sectionMappings: Record<string, { fromKey: string; toKey: string; transform?: TransformFn }[]> = {
    'home': [
      { fromKey: 'hero', toKey: 'hero' },
      { fromKey: 'photoGallery', toKey: 'photo_gallery' },
      { fromKey: 'services', toKey: 'services_preview' },
      { fromKey: 'sacredSpaces', toKey: 'sacred_spaces', transform: (d) => ({ spaces: d }) },
      { fromKey: 'featureCards', toKey: 'feature_cards', transform: (d) => ({ cards: d }) },
      { fromKey: 'ctaSection', toKey: 'cta_section' }
    ],
    'about': [
      { fromKey: 'hero', toKey: 'hero' },
      { fromKey: 'profileImage', toKey: 'profile', transform: (d) => ({ profileImage: d }) },
      { fromKey: 'spiritualJourney', toKey: 'spiritual_journey' },
      { fromKey: 'expertiseAreas', toKey: 'expertise_areas', transform: (d) => ({ areas: d }) },
      { fromKey: 'photoGallery', toKey: 'photo_gallery' },
      { fromKey: 'whatToExpect', toKey: 'what_to_expect' },
      { fromKey: 'communityService', toKey: 'community_service' }
    ],
    'why-choose-us': [
      { fromKey: 'hero', toKey: 'hero' },
      { fromKey: 'quickBenefits', toKey: 'quick_benefits', transform: (d) => ({ benefits: d }) },
      { fromKey: 'reasons', toKey: 'reasons', transform: (d) => ({ reasons: d }) },
      { fromKey: 'ctaSection', toKey: 'cta_section' }
    ],
    'books': [
      { fromKey: 'hero', toKey: 'hero' }
    ],
    'contact': [
      { fromKey: 'hero', toKey: 'hero' },
      { fromKey: 'email', toKey: 'contact_info', transform: (_d: unknown, full?: Record<string, unknown>) => ({
        email: (full as Record<string, string>)?.email || '',
        phone: (full as Record<string, string>)?.phone || '',
        whatsapp: (full as Record<string, string>)?.whatsapp || '',
        address: (full as Record<string, string>)?.address || ''
      })}
    ],
    'charity': [
      { fromKey: 'hero', toKey: 'hero' },
      { fromKey: 'statistics', toKey: 'statistics', transform: (d) => ({ statistics: d }) },
      { fromKey: 'featuredProjects', toKey: 'featured_projects' },
      { fromKey: 'serviceAreas', toKey: 'service_areas', transform: (d) => ({ areas: d }) },
      { fromKey: 'missionStatement', toKey: 'mission_statement' },
      { fromKey: 'ctaSection', toKey: 'cta_section' }
    ]
  }

  console.log('Starting database migration...\n')

  for (const [localKey, pageSlug] of Object.entries(pageSlugMap)) {
    const pageData = exportedData[localKey] as Record<string, unknown> | undefined
    if (!pageData) {
      console.log(`⚪ Skipping ${localKey} - no data`)
      continue
    }

    // Get page ID
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', pageSlug)
      .single()

    if (pageError || !page) {
      console.log(`❌ Page not found: ${pageSlug}`)
      continue
    }

    const mappings = sectionMappings[pageSlug] || []
    
    for (const mapping of mappings) {
      const sourceData = pageData[mapping.fromKey]
      if (sourceData === undefined) continue

      const content = mapping.transform 
        ? mapping.transform(sourceData, pageData)
        : sourceData

      const { error } = await supabase
        .from('page_sections')
        .upsert({
          page_id: page.id,
          section_key: mapping.toKey,
          section_type: mapping.toKey.replace('_', '-'),
          content
        }, { onConflict: 'page_id,section_key' })

      if (error) {
        console.log(`❌ Error updating ${pageSlug}/${mapping.toKey}: ${error.message}`)
      } else {
        console.log(`✅ Updated ${pageSlug}/${mapping.toKey}`)
      }
    }
  }

  // Migrate header content
  if (exportedData['cms_header']) {
    const header = exportedData['cms_header'] as Record<string, string>
    const { error } = await supabase
      .from('site_settings')
      .update({
        site_logo_url: header.logoUrl,
        site_name: header.siteName,
        site_tagline: header.tagline,
        header_cta_text: header.ctaText,
        header_cta_link: header.ctaLink
      })
      .eq('singleton_guard', true)

    if (error) {
      console.log(`❌ Error updating header: ${error.message}`)
    } else {
      console.log('✅ Updated header settings')
    }
  }

  // Migrate footer content
  if (exportedData['cms_footer']) {
    const footer = exportedData['cms_footer'] as Record<string, string>
    const { error } = await supabase
      .from('site_settings')
      .update({
        footer_text: footer.description,
        copyright_text: footer.copyrightText,
        facebook_page_url: footer.facebookUrl,
        instagram_url: footer.instagramUrl,
        youtube_channel_url: footer.youtubeUrl,
        linkedin_url: footer.linkedinUrl,
        twitter_url: footer.twitterUrl,
        pinterest_url: footer.pinterestUrl
      })
      .eq('singleton_guard', true)

    if (error) {
      console.log(`❌ Error updating footer: ${error.message}`)
    } else {
      console.log('✅ Updated footer settings')
    }
  }

  console.log('\n=== Migration Complete ===')
}

// CLI entry point
if (typeof require !== 'undefined' && require.main === module) {
  const args = process.argv.slice(2)
  if (args.length < 3) {
    console.log('Usage: npx ts-node scripts/migrate-cms-to-db.ts <export.json> <SUPABASE_URL> <SUPABASE_KEY>')
    process.exit(1)
  }

  const [exportFile, supabaseUrl, supabaseKey] = args
  const fs = require('fs')
  const exportedData = JSON.parse(fs.readFileSync(exportFile, 'utf-8'))
  
  migrateFromLocalStorageExport(exportedData, supabaseUrl, supabaseKey)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
