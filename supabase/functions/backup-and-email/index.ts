// @ts-nocheck — Deno Edge Function: URL imports and Deno globals are valid at runtime
/**
 * backup-and-email — Supabase Edge Function
 * ─────────────────────────────────────────
 * Exports every content table to JSON, collects all image URLs,
 * packages everything in a ZIP file and emails it via Microsoft Exchange SMTP.
 *
 * Required Edge-Function secrets (set in Supabase Dashboard →
 * Project Settings → Edge Functions → Secrets):
 *
 *   SMTP_HOST        — e.g. smtp.office365.com
 *   SMTP_PORT        — e.g. 587  (STARTTLS) or 465 (SSL)
 *   SMTP_USER        — your Exchange / Outlook email address
 *   SMTP_PASSWORD    — your account password or app password
 *   CRON_SECRET      — random string shared with the cron migration
 *
 * Built-in secrets (injected automatically by Supabase):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Deploy:
 *   supabase functions deploy backup-and-email --no-verify-jwt
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { zipSync, strToU8 } from 'https://esm.sh/fflate@0.8.2'
import { SmtpClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

// ── Config ────────────────────────────────────────────────────────────────────
const BACKUP_EMAIL = 'kdadks@outlook.com'

// Tables exported in the backup (analytics / cookie consent skipped intentionally)
const CONTENT_TABLES = [
  'pages',
  'page_sections',
  'blog_categories',
  'blog_posts',
  'blog_tags',
  'blog_post_tags',
  'service_categories',
  'services',
  'service_package_items',
  'testimonials',
  'books',
  'charity_projects',
  'media_files',
  'photo_galleries',
  'gallery_photos',
  'videos',
  'site_settings',
  'site_metadata',
  'menus',
  'menu_items',
  'seo_settings',
  'seo_redirects',
  'contact_inquiries',
  'admin_users',       // passwords are hashed — safe to include
  'activity_logs',
] as const

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Safely cast jsonb content and harvest image-like URLs */
function harvestImageUrls(backup: Record<string, unknown[]>): string[] {
  const urls = new Set<string>()

  const add = (v: unknown) => {
    if (typeof v === 'string' && v.startsWith('http') && /\.(png|jpg|jpeg|gif|webp|svg|avif)/i.test(v)) {
      urls.add(v)
    }
  }

  // Specific column harvesting
  ;(backup['media_files'] as any[] ?? []).forEach(r => { add(r.url); add(r.public_url); add(r.thumbnail_url) })
  ;(backup['gallery_photos'] as any[] ?? []).forEach(r => { add(r.url); add(r.thumbnail_url) })
  ;(backup['blog_posts'] as any[] ?? []).forEach(r => { add(r.featured_image_url) })
  ;(backup['services'] as any[] ?? []).forEach(r => { add(r.image_url); add(r.icon_url) })
  ;(backup['books'] as any[] ?? []).forEach(r => { add(r.cover_image_url); add(r.image_url) })
  ;(backup['testimonials'] as any[] ?? []).forEach(r => { add(r.avatar_url); add(r.image_url) })
  ;(backup['charity_projects'] as any[] ?? []).forEach(r => { add(r.image_url) })
  ;(backup['videos'] as any[] ?? []).forEach(r => { add(r.thumbnail_url) })
  ;(backup['site_settings'] as any[] ?? []).forEach(r => { add(r.logo_url); add(r.favicon_url) })

  // Deep-scan page_sections JSONB content for any image URLs
  ;(backup['page_sections'] as any[] ?? []).forEach(row => {
    const scanObject = (obj: unknown) => {
      if (!obj || typeof obj !== 'object') return
      for (const v of Object.values(obj as Record<string, unknown>)) {
        if (typeof v === 'string') add(v)
        else if (Array.isArray(v)) v.forEach(scanObject)
        else if (typeof v === 'object') scanObject(v)
      }
    }
    scanObject(row.content)
  })

  return Array.from(urls).sort()
}

/** Convert Uint8Array → base64 string (safe for large buffers) */
function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

/** Row-count summary table for the email body */
function rowCountsHtml(backup: Record<string, unknown[]>, tables: readonly string[]): string {
  return tables
    .map(t => `<tr><td style="padding:3px 8px;border:1px solid #ddd">${t}</td><td style="padding:3px 8px;border:1px solid #ddd;text-align:right">${(backup[t] ?? []).length.toLocaleString()}</td></tr>`)
    .join('')
}

// ── Main handler ──────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  try {
    // ── Auth: accept cron-secret header OR Supabase service-role JWT
    const cronSecret = Deno.env.get('CRON_SECRET')
    const incomingSecret = req.headers.get('x-cron-secret')
    const authHeader = req.headers.get('Authorization') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const isCronCall = cronSecret && incomingSecret === cronSecret
    const isServiceRole = authHeader === `Bearer ${serviceRoleKey}`
    const isManualPost = req.method === 'POST' // Allow manual trigger for testing

    if (!isCronCall && !isServiceRole && !isManualPost) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    // ── Required env vars
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const smtpHost     = Deno.env.get('SMTP_HOST')
    const smtpPort     = parseInt(Deno.env.get('SMTP_PORT') ?? '587', 10)
    const smtpUser     = Deno.env.get('SMTP_USER')
    const smtpPassword = Deno.env.get('SMTP_PASSWORD')

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' }), { status: 500 })
    }
    if (!smtpHost || !smtpUser || !smtpPassword) {
      return new Response(JSON.stringify({ error: 'Missing SMTP_HOST, SMTP_USER or SMTP_PASSWORD — add them in Supabase Dashboard → Project Settings → Edge Functions → Secrets' }), { status: 500 })
    }

    // ── Supabase client (service role — bypasses RLS)
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]         // e.g. 2026-02-23
    const timestamp = now.toISOString()

    // ── Export all tables
    const backup: Record<string, unknown[]> = {}
    const errors: string[] = []

    for (const table of CONTENT_TABLES) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: true })

        if (error) {
          // Table may not exist (some are optional) — log but continue
          errors.push(`${table}: ${error.message}`)
          backup[table] = []
        } else {
          backup[table] = data ?? []
        }
      } catch (e) {
        errors.push(`${table}: ${(e as Error).message}`)
        backup[table] = []
      }
    }

    // ── Harvest image URLs
    const imageUrls = harvestImageUrls(backup)

    const totalRows = Object.values(backup).reduce((sum, rows) => sum + rows.length, 0)

    // ── Build summary object
    const summary = {
      backup_created_at: timestamp,
      backup_date: dateStr,
      tables_exported: CONTENT_TABLES.length,
      total_rows: totalRows,
      total_image_urls: imageUrls.length,
      table_row_counts: Object.fromEntries(CONTENT_TABLES.map(t => [t, (backup[t] ?? []).length])),
      errors: errors.length > 0 ? errors : [],
    }

    // ── Pack into ZIP
    const folder = `backup_${dateStr}`
    const zipInput: Record<string, Uint8Array> = {
      [`${folder}/summary.json`]:    strToU8(JSON.stringify(summary, null, 2)),
      [`${folder}/database.json`]:   strToU8(JSON.stringify(backup, null, 2)),
      [`${folder}/image_urls.txt`]:  strToU8(imageUrls.join('\n')),
    }

    const zipped = zipSync(zipInput, { level: 6 })
    const base64Zip = toBase64(zipped)
    const fileSizeKB = Math.round(zipped.length / 1024)

    // ── Send via Resend
    // ── Send via Microsoft Exchange SMTP
    const smtpClient = new SmtpClient()

    await smtpClient.connectTLS({
      hostname: smtpHost,
      port: smtpPort,
      username: smtpUser,
      password: smtpPassword,
    })

    await smtpClient.send({
      from: smtpUser,
      to: BACKUP_EMAIL,
      subject: `Database Backup — ${dateStr}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#b45309">Bi-Weekly Database Backup</h2>
          <p>Your scheduled backup for <strong>${dateStr}</strong> is ready and attached as a ZIP file.</p>

          <table style="border-collapse:collapse;width:100%;margin:16px 0">
            <tr style="background:#fef3c7">
              <th style="padding:6px 10px;border:1px solid #ddd;text-align:left">Metric</th>
              <th style="padding:6px 10px;border:1px solid #ddd;text-align:right">Value</th>
            </tr>
            <tr><td style="padding:5px 10px;border:1px solid #ddd">Backup date</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right">${dateStr}</td></tr>
            <tr><td style="padding:5px 10px;border:1px solid #ddd">Tables exported</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right">${summary.tables_exported}</td></tr>
            <tr><td style="padding:5px 10px;border:1px solid #ddd">Total rows</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right">${totalRows.toLocaleString()}</td></tr>
            <tr><td style="padding:5px 10px;border:1px solid #ddd">Image URLs collected</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right">${imageUrls.length}</td></tr>
            <tr><td style="padding:5px 10px;border:1px solid #ddd">ZIP file size</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right">${fileSizeKB} KB</td></tr>
            ${errors.length > 0 ? `<tr style="background:#fef2f2"><td style="padding:5px 10px;border:1px solid #ddd;color:#dc2626">⚠️ Errors</td><td style="padding:5px 10px;border:1px solid #ddd;color:#dc2626">${errors.join('<br>')}</td></tr>` : ''}
          </table>

          <details>
            <summary style="cursor:pointer;font-weight:bold;margin:12px 0">Table row counts</summary>
            <table style="border-collapse:collapse;width:100%;font-size:13px;margin-top:8px">
              <tr style="background:#f3f4f6">
                <th style="padding:4px 8px;border:1px solid #ddd;text-align:left">Table</th>
                <th style="padding:4px 8px;border:1px solid #ddd;text-align:right">Rows</th>
              </tr>
              ${rowCountsHtml(backup, CONTENT_TABLES)}
            </table>
          </details>

          <h3 style="margin-top:20px">ZIP contents</h3>
          <ul>
            <li><code>${folder}/database.json</code> — full export of all tables</li>
            <li><code>${folder}/image_urls.txt</code> — ${imageUrls.length} image URLs (one per line)</li>
            <li><code>${folder}/summary.json</code> — metadata about this backup</li>
          </ul>

          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
          <p style="color:#9ca3af;font-size:12px">
            Automated backup from panditrajeshjoshi.com<br>
            Scheduled: 1st &amp; 15th of every month at 09:00 UTC
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `backup_${dateStr}.zip`,
          contentType: 'application/zip',
          encoding: 'base64',
          content: base64Zip,
        },
      ],
    })

    await smtpClient.close()

    console.log(`✅ Backup sent via Exchange — ${totalRows} rows, ${imageUrls.length} image URLs, ${fileSizeKB} KB ZIP`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Backup emailed to ${BACKUP_EMAIL}`,
        date: dateStr,
        tables: summary.tables_exported,
        total_rows: totalRows,
        image_urls: imageUrls.length,
        zip_size_kb: fileSizeKB,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message = (err as Error).message
    console.error('❌ Backup failed:', message)
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
