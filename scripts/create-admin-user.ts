/**
 * Admin User Creation & Project Binding Script
 *
 * Creates or updates an administrative user in Supabase Auth (auth.users)
 * and attaches the Layer 2 app.metadata binding: { project: 'panditji', role: 'super_admin' }.
 * Also syncs the user record into schema 'panditji.admin_users'.
 *
 * Usage:
 *   npx tsx scripts/create-admin-user.ts [email] [password]
 *
 * Example:
 *   npx tsx scripts/create-admin-user.ts panditjoshirajesh@gmail.com MySecurePassword123!
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const TARGET_URL = process.env.TARGET_SUPABASE_URL || 'https://gsqfaguqsmnuoeuhpxro.supabase.co'
const TARGET_KEY = process.env.TARGET_SUPABASE_KEY || process.env.SUPABASE_SECRET_KEY || ''
const TARGET_SCHEMA = 'panditji'

async function main() {
  const args = process.argv.slice(2)
  const email = args[0] || 'panditjoshirajesh@gmail.com'
  const password = args[1] || 'PanditRajesh2026!'

  console.log('========================================================')
  console.log(' Pandit Rajesh Joshi - Admin User Creation & Binding')
  console.log(` Target Database: ${TARGET_URL}`)
  console.log(` Target Email:    ${email}`)
  console.log('========================================================')

  if (!TARGET_KEY || TARGET_KEY.startsWith('sb_publishable_')) {
    console.error('❌ Error: TARGET_SUPABASE_KEY in .env must be the Secret Key (starts with sb_secret_).')
    process.exit(1)
  }

  const supabase = createClient(TARGET_URL, TARGET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // 1. Check if user already exists in auth.users
  console.log('\nChecking if user exists in auth.users...')
  const { data: usersData, error: listErr } = await supabase.auth.admin.listUsers()

  let existingUser = usersData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())

  if (existingUser) {
    console.log(`✓ User ${email} already exists (ID: ${existingUser.id}).`)
    console.log('Updating password and app_metadata binding...')
    const updatePayload: any = {
      app_metadata: {
        ...(existingUser.app_metadata || {}),
        project: 'panditji',
        role: 'super_admin'
      }
    }
    if (password) {
      updatePayload.password = password
    }
    const { data: updated, error: updateErr } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      updatePayload
    )

    if (updateErr) {
      console.error(`❌ Failed updating user app_metadata: ${updateErr.message}`)
      process.exit(1)
    }
    console.log(`✓ Layer 2 Project Binding established: { project: 'panditji', role: 'super_admin' }`)
  } else {
    console.log(`Creating new user ${email} in auth.users...`)
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: {
        project: 'panditji',
        role: 'super_admin'
      }
    })

    if (createErr) {
      console.error(`❌ Failed to create user: ${createErr.message}`)
      process.exit(1)
    }

    existingUser = created.user
    console.log(`✓ User created successfully with ID: ${existingUser.id}`)
    console.log(`✓ Layer 2 Project Binding established: { project: 'panditji', role: 'super_admin' }`)
  }

  // 2. Sync into panditji.admin_users table
  console.log(`Syncing into ${TARGET_SCHEMA}.admin_users...`)
  const targetSchemaClient = createClient(TARGET_URL, TARGET_KEY, {
    db: { schema: TARGET_SCHEMA }
  })

  const { error: syncErr } = await targetSchemaClient
    .from('admin_users')
    .upsert(
      {
        id: existingUser.id,
        email: email,
        full_name: 'Pandit Rajesh Joshi',
        role: 'super_admin',
        is_active: true
      },
      { onConflict: 'id' }
    )

  if (syncErr) {
    console.warn(`Note on admin_users table sync: ${syncErr.message}`)
  } else {
    console.log(`✓ Synced into ${TARGET_SCHEMA}.admin_users table.`)
  }

  console.log('\n========================================================')
  console.log('✅ Admin account is ready to log into the Panditji platform!')
  console.log(`Email:    ${email}`)
  console.log(`Password: ${password}`)
  console.log('========================================================\n')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
