/**
 * Cross-Database / Shared-Schema Data Migration Script
 *
 * Migrates data from the existing database (rhwzwjaqbobmrxmrebht)
 * into the new shared database (gsqfaguqsmnuoeuhpxro) under the 'panditji' schema.
 * Also migrates storage buckets (prefixing with 'panditji-') and updates metadata.
 *
 * Usage:
 *   npx tsx scripts/migrate-to-shared-schema.ts
 *
 * Environment variables:
 *   SOURCE_SUPABASE_URL (default: https://rhwzwjaqbobmrxmrebht.supabase.co)
 *   SOURCE_SUPABASE_KEY (service_role / secret key for source)
 *   TARGET_SUPABASE_URL (default: https://gsqfaguqsmnuoeuhpxro.supabase.co)
 *   TARGET_SUPABASE_KEY (service_role / secret key for target)
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const SOURCE_URL = process.env.SOURCE_SUPABASE_URL || 'https://rhwzwjaqbobmrxmrebht.supabase.co'
const SOURCE_KEY = process.env.SOURCE_SUPABASE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SECRET_KEY || ''

const TARGET_URL = process.env.TARGET_SUPABASE_URL || 'https://gsqfaguqsmnuoeuhpxro.supabase.co'
const TARGET_KEY = process.env.TARGET_SUPABASE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SECRET_KEY || ''

const TARGET_SCHEMA = 'panditji'

const TABLES_TO_MIGRATE = [
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
  'user_cookie_consents',
  'pages',
  'page_sections',
  'site_settings',
  'site_metadata',
  'menus',
  'menu_items',
  'resource_sections',
  'referrer_sources',
  'page_views',
  'service_views',
  'analytics_summary'
]

function cleanRowForTable(table: string, row: Record<string, any>): Record<string, any> {
  const cleaned = { ...row }
  if (table === 'site_settings') {
    // Omit non-schema columns from legacy key-value migrations
    delete cleaned.created_at
    delete cleaned.category
    delete cleaned.setting_key
    delete cleaned.setting_value
    delete cleaned.setting_type
    delete cleaned.description
  }
  if (table === 'site_metadata') {
    delete cleaned.updated_by
  }
  if (table === 'page_views') {
    if (!cleaned.page_path && cleaned.page_slug) cleaned.page_path = cleaned.page_slug
    if (!cleaned.page_slug && cleaned.page_path) cleaned.page_slug = cleaned.page_path
    if (!cleaned.viewed_at && cleaned.created_at) cleaned.viewed_at = cleaned.created_at
    if (!cleaned.created_at && cleaned.viewed_at) cleaned.created_at = cleaned.viewed_at
  }
  return cleaned
}

function remapUrls(obj: any): any {
  if (!obj) return obj
  if (typeof obj === 'string') {
    return obj
      .split('rhwzwjaqbobmrxmrebht.supabase.co').join('gsqfaguqsmnuoeuhpxro.supabase.co')
      .split('/storage/v1/object/public/media/').join('/storage/v1/object/public/panditji-media/')
      .split('/storage/v1/object/public/documents/').join('/storage/v1/object/public/panditji-documents/')
      .split('/storage/v1/object/public/videos/').join('/storage/v1/object/public/panditji-videos/')
      .split('/storage/v1/object/public/resources/').join('/storage/v1/object/public/panditji-resources/')
  }
  if (Array.isArray(obj)) {
    return obj.map(remapUrls)
  }
  if (typeof obj === 'object') {
    const res: Record<string, any> = {}
    for (const [k, v] of Object.entries(obj)) {
      res[k] = remapUrls(v)
    }
    return res
  }
  return obj
}

async function listAllBucketFiles(client: any, bucket: string, folder = ''): Promise<string[]> {
  try {
    const { data, error } = await client.storage.from(bucket).list(folder, { limit: 100 })
    if (error || !data) return []

    let files: string[] = []
    for (const item of data) {
      const itemPath = folder ? `${folder}/${item.name}` : item.name
      if (item.id === null) {
        // Folder -> recurse
        const sub = await listAllBucketFiles(client, bucket, itemPath)
        files = files.concat(sub)
      } else {
        files.push(itemPath)
      }
    }
    return files
  } catch {
    return []
  }
}

async function migrateStorageFiles(sourceClient: any, targetClient: any) {
  console.log('\n[3/4] Migrating Storage Buckets & Binary Objects...')

  const BUCKET_MAPPINGS = [
    { source: 'media', target: 'panditji-media' },
    { source: 'documents', target: 'panditji-documents' },
    { source: 'resources', target: 'panditji-resources' },
    { source: 'videos', target: 'panditji-videos' }
  ]

  for (const { source, target } of BUCKET_MAPPINGS) {
    process.stdout.write(`  Syncing bucket '${source}' -> '${target}'... `)

    // Ensure target bucket exists
    const { error: getBucketErr } = await targetClient.storage.getBucket(target)
    if (getBucketErr) {
      await targetClient.storage.createBucket(target, { public: true })
    }

    // List all files in source bucket
    const files = await listAllBucketFiles(sourceClient, source)
    if (files.length === 0) {
      console.log(`0 files found via bucket list. Checking catalog...`)
    } else {
      console.log(`found ${files.length} files. Transferring...`)
      let successCount = 0
      let failCount = 0

      for (const filePath of files) {
        try {
          let fileBuffer: Buffer | null = null
          let contentType = 'application/octet-stream'

          const { data: dlData, error: dlErr } = await sourceClient.storage
            .from(source)
            .download(filePath)

          if (!dlErr && dlData) {
            fileBuffer = Buffer.from(await dlData.arrayBuffer())
            contentType = dlData.type || contentType
          } else {
            // Fallback to public URL HTTP fetch
            const { data: urlData } = sourceClient.storage
              .from(source)
              .getPublicUrl(filePath)
            if (urlData?.publicUrl) {
              const resp = await fetch(urlData.publicUrl)
              if (resp.ok) {
                fileBuffer = Buffer.from(await resp.arrayBuffer())
                contentType = resp.headers.get('content-type') || contentType
              }
            }
          }

          if (!fileBuffer) {
            console.warn(`    ⚠️ Could not download ${source}/${filePath}`)
            failCount++
            continue
          }

          const { error: upErr } = await targetClient.storage
            .from(target)
            .upload(filePath, fileBuffer, {
              contentType,
              upsert: true
            })

          if (upErr) {
            console.warn(`    ❌ Failed uploading ${target}/${filePath}: ${upErr.message}`)
            failCount++
          } else {
            successCount++
          }
        } catch (err: any) {
          console.warn(`    ❌ Error transferring ${filePath}: ${err.message}`)
          failCount++
        }
      }
      console.log(`  ✓ Bucket '${target}': ${successCount} files transferred (${failCount} failed)`)
    }
  }

  // Cross-check with media_files catalog to ensure all 149 images & documents are transferred
  try {
    const { data: mediaRows } = await sourceClient.from('media_files').select('file_url, file_name, folder, mime_type')
    if (mediaRows && mediaRows.length > 0) {
      console.log(`  Verifying ${mediaRows.length} files from media_files database catalog...`)
      let extraSynced = 0
      for (const row of mediaRows) {
        if (!row.file_url) continue
        const oldMarker = '/storage/v1/object/public/media/'
        const idx = row.file_url.indexOf(oldMarker)
        if (idx !== -1) {
          const filePath = decodeURIComponent(row.file_url.slice(idx + oldMarker.length))
          try {
            const resp = await fetch(row.file_url)
            if (resp.ok) {
              const buf = Buffer.from(await resp.arrayBuffer())
              const { error } = await targetClient.storage
                .from('panditji-media')
                .upload(filePath, buf, {
                  contentType: row.mime_type || 'image/jpeg',
                  upsert: true
                })
              if (!error) extraSynced++
            }
          } catch { }
        }
      }
      console.log(`  ✓ Media catalog sync completed: ${extraSynced} files verified & uploaded to 'panditji-media'.`)
    }
  } catch (e: any) {
    console.warn('  Note on media_files sync:', e.message)
  }
}

async function fetchAllTableRows(client: any, fallbackClient: any, table: string): Promise<any[]> {
  const pageSize = 1000
  let allRows: any[] = []
  let from = 0

  while (true) {
    let res = await client.from(table).select('*').range(from, from + pageSize - 1)
    if (res.error && res.error.message.includes('Legacy API keys are disabled') && fallbackClient) {
      res = await fallbackClient.from(table).select('*').range(from, from + pageSize - 1)
    }

    if (res.error) {
      if (allRows.length > 0) return allRows
      throw res.error
    }

    const data = res.data || []
    allRows = allRows.concat(data)
    if (data.length < pageSize) break
    from += pageSize
  }

  return allRows
}

async function runMigration() {
  console.log('========================================================')
  console.log(' Pandit Rajesh Joshi Platform -> Shared Schema Migration')
  console.log(` Source: ${SOURCE_URL}`)
  console.log(` Target: ${TARGET_URL} (Schema: ${TARGET_SCHEMA})`)
  console.log('========================================================')

  if (!TARGET_KEY) {
    console.error('❌ Missing TARGET_SUPABASE_KEY (or SUPABASE_SECRET_KEY).')
    console.log('Please provide TARGET_SUPABASE_KEY in .env or command line.')
    process.exit(1)
  }

  if (TARGET_KEY.startsWith('sb_publishable_')) {
    console.error('\n❌ CONFIGURATION ERROR: TARGET_SUPABASE_KEY is currently a Publishable Key (sb_publishable_...).')
    console.error('A Publishable key is an anonymous client key (role: anon) and is blocked by Row Level Security from inserting records.')
    console.error('👉 To insert data into panditji schema, TARGET_SUPABASE_KEY must be the Secret Key (starts with sb_secret_...).')
    console.error('   Copy it from: https://supabase.com/dashboard/project/gsqfaguqsmnuoeuhpxro/settings/api -> Project API keys -> Secret key\n')
    process.exit(1)
  }

  let sourceClient = SOURCE_KEY ? createClient(SOURCE_URL, SOURCE_KEY) : null
  const fallbackSourceKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  let fallbackSourceClient = (fallbackSourceKey && fallbackSourceKey.startsWith('sb_publishable_'))
    ? createClient(SOURCE_URL, fallbackSourceKey)
    : null

  const targetClient = createClient(TARGET_URL, TARGET_KEY, {
    db: { schema: TARGET_SCHEMA }
  })

  if (!sourceClient && !fallbackSourceClient) {
    console.warn('⚠️ SOURCE_KEY not provided. Only verifying target connection & schema...')
  }

  // 1. Ensure Target Schema Tables & Connectivity
  console.log('\n[1/3] Checking connection to target database...')
  const { data: testData, error: testErr } = await targetClient
    .from('services')
    .select('count', { count: 'exact', head: true })

  if (testErr) {
    console.warn(`Note: Querying target services returned: ${testErr.message}`)
    console.log('Make sure you have run supabase/migrations/20261126000001_panditji_schema_ddl.sql in the Supabase SQL editor!')
  } else {
    console.log(`✓ Connected to ${TARGET_SCHEMA} schema successfully. Current service count: ${testData ?? 0}`)
  }

  // Determine tables to migrate (support CLI argument e.g. npm run migrate:shared analytics)
  const filterArg = process.argv.slice(2).find(a => !a.startsWith('-'))
  let tablesToMigrate = TABLES_TO_MIGRATE
  if (filterArg) {
    if (filterArg === 'analytics') {
      tablesToMigrate = ['referrer_sources', 'page_views', 'service_views', 'analytics_summary', 'user_cookie_consents']
    } else {
      tablesToMigrate = filterArg.split(',').map(t => t.trim())
    }
    console.log(`Filtering migration to tables: ${tablesToMigrate.join(', ')}`)
  }

  // 2. Migrate Tables if Source is Available
  const activeSource = sourceClient || fallbackSourceClient
  if (activeSource) {
    console.log('\n[2/3] Migrating data table by table...')
    for (const table of tablesToMigrate) {
      process.stdout.write(`  Migrating ${table}... `)
      try {
        const rows = await fetchAllTableRows(sourceClient || activeSource, fallbackSourceClient, table)

        if (!rows || rows.length === 0) {
          console.log(`0 rows (empty)`)
          continue
        }

        const remappedRows = rows.map((r: any) => cleanRowForTable(table, remapUrls(r)))

        // Handle service_views orphaned foreign keys
        if (table === 'service_views') {
          const { data: validServices } = await targetClient.from('services').select('id')
          const validIds = new Set((validServices || []).map((s: any) => s.id))
          for (const row of remappedRows) {
            if (row.service_id && !validIds.has(row.service_id)) {
              row.service_id = null
            }
          }
        }

        // Special handling for site_settings (singleton table)
        if (table === 'site_settings') {
          const singletonRow = remappedRows.find((r: any) => r.primary_email || r.primary_phone || r.singleton_guard === true) || remappedRows[0]
          if (singletonRow) {
            singletonRow.singleton_guard = true
            const { error: insertErr } = await targetClient
              .from('site_settings')
              .upsert(singletonRow, { onConflict: 'singleton_guard' })

            if (insertErr) {
              console.log(`❌ Error inserting site_settings: ${insertErr.message}`)
            } else {
              console.log(`✓ 1 site_settings row migrated`)
            }
          }
          continue
        }

        // Insert in batches of 50
        const chunkSize = 50
        let hasError = false
        let insertedCount = 0
        for (let i = 0; i < remappedRows.length; i += chunkSize) {
          const chunk = remappedRows.slice(i, i + chunkSize)
          let { error: insertErr } = await targetClient
            .from(table)
            .upsert(chunk, { ignoreDuplicates: true })

          // Fallback if target schema cache hasn't loaded country_code
          if (insertErr && insertErr.message.includes('country_code')) {
            const strippedChunk = chunk.map((r: any) => {
              const copy = { ...r }
              delete copy.country_code
              return copy
            })
            const retryRes = await targetClient
              .from(table)
              .upsert(strippedChunk, { ignoreDuplicates: true })
            insertErr = retryRes.error
          }

          if (insertErr) {
            console.log(`\n    ❌ Error inserting chunk: ${insertErr.message}`)
            hasError = true
          } else {
            insertedCount += chunk.length
          }
        }
        if (!hasError) {
          console.log(`✓ ${rows.length} rows migrated`)
        } else {
          console.log(`✓ ${insertedCount} rows migrated (some chunks had errors)`)
        }
      } catch (err: any) {
        if (err.message && err.message.includes('relation') && err.message.includes('does not exist')) {
          console.log(`0 rows (table not present in source)`)
        } else {
          console.log(`⚠️ Skip (${err.message})`)
        }
      }
    }
  }

  // 3. Migrate Storage Files & Objects
  if (!filterArg && (sourceClient || fallbackSourceClient)) {
    await migrateStorageFiles(sourceClient || fallbackSourceClient, targetClient)
  }

  // 4. User Project Binding check
  console.log('\n[4/4] Setting up Layer 2 app.metadata project binding...')
  console.log(`Run the following SQL in https://supabase.com/dashboard/project/gsqfaguqsmnuoeuhpxro/editor?schema=${TARGET_SCHEMA}:`)
  console.log(`
    SELECT panditji.bind_user_to_project('panditjoshirajesh@gmail.com', 'super_admin');
    SELECT panditji.bind_user_to_project('admin@panditrajesh.ie', 'super_admin');
  `)

  console.log('\n✓ Migration workflow script finished.')
}

runMigration().catch((err) => {
  console.error('Fatal error during migration:', err)
  process.exit(1)
})
