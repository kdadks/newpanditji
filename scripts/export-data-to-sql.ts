/**
 * Live Data Exporter Script
 *
 * Connects to the source Supabase project (rhwzwjaqbobmrxmrebht),
 * reads all rows from the database, transforms storage URLs,
 * and formats them into a self-contained SQL file with literal VALUES.
 *
 * Output: supabase/migrations/panditji_live_data_dump.sql
 *
 * Usage:
 *   npx tsx scripts/export-data-to-sql.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const SOURCE_URL = process.env.SOURCE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rhwzwjaqbobmrxmrebht.supabase.co'
const SOURCE_KEY = process.env.SOURCE_SUPABASE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''

const OLD_HOST = 'rhwzwjaqbobmrxmrebht.supabase.co'
const NEW_HOST = 'gsqfaguqsmnuoeuhpxro.supabase.co'

const TABLES = [
  'admin_users',
  'service_categories',
  'services',
  'service_package_items',
  'blog_categories',
  'blog_posts',
  'blog_tags',
  'blog_post_tags',
  'media_files',
  'photo_galleries',
  'gallery_photos',
  'videos',
  'charity_projects',
  'testimonials',
  'books',
  'contact_inquiries',
  'cookie_categories',
  'cookies',
  'pages',
  'page_sections',
  'site_settings',
  'site_metadata',
  'menus',
  'menu_items',
  'resource_sections'
]

function escapeSqlValue(value: any): string {
  if (value === null || value === undefined) {
    return 'NULL'
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  if (typeof value === 'number') {
    return String(value)
  }
  if (Array.isArray(value)) {
    // Array of strings or objects
    const remapped = value.map(v => remapUrls(v))
    // Format as PostgreSQL array literal or JSONB array
    const escapedElements = remapped.map(item => {
      if (item === null) return 'NULL'
      const str = typeof item === 'object' ? JSON.stringify(item) : String(item)
      return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
    })
    return `ARRAY[${escapedElements.join(', ')}]`
  }
  if (typeof value === 'object') {
    const remapped = remapUrls(value)
    const jsonStr = JSON.stringify(remapped)
    return `'${jsonStr.replace(/'/g, "''")}'::jsonb`
  }

  // String
  const str = remapUrls(String(value))
  return `'${str.replace(/'/g, "''")}'`
}

function remapUrls(val: any): any {
  if (!val) return val
  if (typeof val === 'string') {
    return val
      .split(OLD_HOST).join(NEW_HOST)
      .split('/storage/v1/object/public/media/').join('/storage/v1/object/public/panditji-media/')
      .split('/storage/v1/object/public/documents/').join('/storage/v1/object/public/panditji-documents/')
      .split('/storage/v1/object/public/videos/').join('/storage/v1/object/public/panditji-videos/')
      .split('/storage/v1/object/public/resources/').join('/storage/v1/object/public/panditji-resources/')
  }
  if (Array.isArray(val)) {
    return val.map(remapUrls)
  }
  if (typeof val === 'object') {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(val)) {
      out[k] = remapUrls(v)
    }
    return out
  }
  return val
}

async function exportData() {
  console.log('Connecting to source database:', SOURCE_URL)
  if (!SOURCE_KEY) {
    console.error('❌ Missing SOURCE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
    process.exit(1)
  }

  let supabase = createClient(SOURCE_URL, SOURCE_KEY)
  const fallbackKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const fallbackClient = (fallbackKey && fallbackKey.startsWith('sb_publishable_'))
    ? createClient(SOURCE_URL, fallbackKey)
    : null
  const outputFile = path.join(process.cwd(), 'supabase', 'migrations', 'panditji_live_data_dump.sql')

  const stream = fs.createWriteStream(outputFile, { encoding: 'utf8' })

  stream.write('-- ============================================================================\n')
  stream.write('-- PANDIT RAJESH JOSHI PLATFORM - LIVE DATA DUMP (WITH VALUES)\n')
  stream.write(`-- Source: ${SOURCE_URL}\n`)
  stream.write(`-- Target Schema: panditji\n`)
  stream.write(`-- Generated: ${new Date().toISOString()}\n`)
  stream.write('-- ============================================================================\n\n')
  stream.write('SET search_path = panditji, pg_temp;\n\n')

  for (const table of TABLES) {
    console.log(`Exporting table: ${table}...`)
    try {
      let { data: rows, error } = await supabase.from(table).select('*')

      if (error && error.message.includes('Legacy API keys are disabled') && fallbackClient) {
        const fallbackRes = await fallbackClient.from(table).select('*')
        if (!fallbackRes.error) {
          rows = fallbackRes.data
          error = null
        }
      }

      if (error) {
        console.warn(`  ⚠️ Could not read ${table}: ${error.message}`)
        continue
      }

      if (!rows || rows.length === 0) {
        console.log(`  ⚪ 0 rows`)
        continue
      }

      console.log(`  ✓ Read ${rows.length} rows`)

      stream.write(`-- ----------------------------------------------------------------------------\n`)
      stream.write(`-- Table: panditji.${table} (${rows.length} rows)\n`)
      stream.write(`-- ----------------------------------------------------------------------------\n`)

      const columns = Object.keys(rows[0])
      const colList = columns.map(c => `"${c}"`).join(', ')

      for (const row of rows) {
        const valList = columns.map(c => escapeSqlValue(row[c])).join(', ')
        stream.write(`INSERT INTO panditji."${table}" (${colList})\nVALUES (${valList})\nON CONFLICT DO NOTHING;\n\n`)
      }
    } catch (err: any) {
      console.warn(`  ❌ Error exporting ${table}:`, err.message)
    }
  }

  // Append user binding at end
  stream.write('\n-- ----------------------------------------------------------------------------\n')
  stream.write('-- User Project Binding\n')
  stream.write('-- ----------------------------------------------------------------------------\n')
  stream.write(`SELECT panditji.bind_user_to_project('panditjoshirajesh@gmail.com', 'super_admin');\n`)
  stream.write(`SELECT panditji.bind_user_to_project('admin@panditrajesh.ie', 'super_admin');\n`)

  stream.end()
  console.log(`\n✅ Data export completed! Output file written to:\n  ${outputFile}`)
  console.log(`You can now copy and execute that file directly in the Supabase SQL Editor of gsqfaguqsmnuoeuhpxro!`)
}

exportData().catch((err) => {
  console.error('Fatal exporter error:', err)
  process.exit(1)
})
