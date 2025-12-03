/**
 * Database Cleanup Script
 * Deletes all data from tables before re-migration
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function cleanDatabase() {
  console.log('🗑️  Cleaning database...\n')

  // Delete in order to respect foreign key constraints
  console.log('Deleting services...')
  const { error: e1 } = await supabase.from('services').delete().gte('created_at', '1970-01-01')
  if (e1) console.error('  Error:', e1.message)
  else console.log('  ✅ Services deleted')

  console.log('Deleting videos...')
  const { error: e2 } = await supabase.from('videos').delete().gte('created_at', '1970-01-01')
  if (e2) console.error('  Error:', e2.message)
  else console.log('  ✅ Videos deleted')

  console.log('Deleting blog_posts...')
  const { error: e3 } = await supabase.from('blog_posts').delete().gte('created_at', '1970-01-01')
  if (e3) console.error('  Error:', e3.message)
  else console.log('  ✅ Blog posts deleted')

  console.log('Deleting blog_categories...')
  const { error: e4 } = await supabase.from('blog_categories').delete().gte('created_at', '1970-01-01')
  if (e4) console.error('  Error:', e4.message)
  else console.log('  ✅ Blog categories deleted')

  console.log('Deleting service_categories...')
  const { error: e5 } = await supabase.from('service_categories').delete().gte('created_at', '1970-01-01')
  if (e5) console.error('  Error:', e5.message)
  else console.log('  ✅ Service categories deleted')

  console.log('\n✅ Database cleanup complete!')
}

cleanDatabase()
