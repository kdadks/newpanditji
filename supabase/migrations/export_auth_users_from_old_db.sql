-- ============================================================================
-- SCRIPT: Export Admin User Accounts (With Exact Password Hashes)
-- Run this query in the SQL Editor of the OLD database (rhwzwjaqbobmrxmrebht):
-- https://supabase.com/dashboard/project/rhwzwjaqbobmrxmrebht/sql
--
-- PURPOSE:
-- Generates ready-to-execute SQL containing the exact bcrypt password hashes
-- and identities, with the Layer 2 project binding ({ "project": "panditji" })
-- already applied.
-- ============================================================================

SELECT
  '-- ============================================================================' || E'\n' ||
  '-- MIGRATED USER: ' || email || E'\n' ||
  '-- ============================================================================' || E'\n' ||
  'INSERT INTO auth.users (' || E'\n' ||
  '  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,' || E'\n' ||
  '  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_super_admin' || E'\n' ||
  ') VALUES (' || E'\n' ||
  '  ' || quote_literal(id) || '::uuid,' || E'\n' ||
  '  ''00000000-0000-0000-0000-000000000000''::uuid,' || E'\n' ||
  '  ''authenticated'',' || E'\n' ||
  '  ''authenticated'',' || E'\n' ||
  '  ' || quote_literal(email) || ',' || E'\n' ||
  '  ' || quote_literal(encrypted_password) || ',' || E'\n' ||
  '  ' || COALESCE(quote_literal(email_confirmed_at), 'NOW()') || ',' || E'\n' ||
  '  ' || quote_literal(
          COALESCE(raw_app_meta_data, '{}'::jsonb) ||
          jsonb_build_object(
            'provider', 'email',
            'providers', jsonb_build_array('email'),
            'project', 'panditji',
            'role', 'super_admin'
          )
        ) || '::jsonb,' || E'\n' ||
  '  ' || quote_literal(COALESCE(raw_user_meta_data, '{}'::jsonb)) || '::jsonb,' || E'\n' ||
  '  ' || COALESCE(quote_literal(created_at), 'NOW()') || ',' || E'\n' ||
  '  ' || COALESCE(quote_literal(updated_at), 'NOW()') || ',' || E'\n' ||
  '  false' || E'\n' ||
  ')' || E'\n' ||
  'ON CONFLICT (id) DO UPDATE SET' || E'\n' ||
  '  encrypted_password = EXCLUDED.encrypted_password,' || E'\n' ||
  '  raw_app_meta_data = EXCLUDED.raw_app_meta_data;' || E'\n\n' ||
  '-- Identity association' || E'\n' ||
  'INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)' || E'\n' ||
  'VALUES (' || E'\n' ||
  '  ' || quote_literal(id) || ',' || E'\n' ||
  '  ' || quote_literal(id) || ',' || E'\n' ||
  '  ' || quote_literal(id) || '::uuid,' || E'\n' ||
  '  ' || quote_literal(jsonb_build_object('sub', id, 'email', email)) || '::jsonb,' || E'\n' ||
  '  ''email'',' || E'\n' ||
  '  NOW(), NOW(), NOW()' || E'\n' ||
  ')' || E'\n' ||
  'ON CONFLICT DO NOTHING;' || E'\n\n' ||
  '-- Sync into panditji.admin_users' || E'\n' ||
  'INSERT INTO panditji.admin_users (id, email, full_name, role, is_active)' || E'\n' ||
  'VALUES (' || quote_literal(id) || '::uuid, ' || quote_literal(email) || ', ''Pandit Rajesh Joshi'', ''super_admin'', true)' || E'\n' ||
  'ON CONFLICT (id) DO NOTHING;' || E'\n'
  AS import_sql_statement
FROM auth.users;
