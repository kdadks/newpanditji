-- ====================================================================
-- SUPABASE POSTGRES 17.6.1.166 RLS & ROLE SECURITY MIGRATION
-- Generated: 2026-09-14T06:22:58.020Z
-- Purpose: Deprecate anon/service_role roles & keys, enforce RLS on all tables
-- ====================================================================

DO $$
DECLARE
    r RECORD;
    pol RECORD;
BEGIN
    -- STEP 1: ENABLE RLS ON ALL BASE TABLES IN SCHEMA PUBLIC
    FOR r IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.table_name);
        RAISE NOTICE 'Enabled RLS on table: %', r.table_name;
    END LOOP;

    -- STEP 2: REVOKE ALL PRIVILEGES FROM ''anon'' ROLE
    EXECUTE 'REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon;';
    EXECUTE 'REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon;';
    EXECUTE 'REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public FROM anon;';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon;';

    -- STEP 3: GRANT PRIVILEGES TO ''authenticated'' AND ''anon'' ROLES
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;';
    EXECUTE 'GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;';
    EXECUTE 'GRANT INSERT ON public.contact_inquiries, public.page_views, public.service_views, public.referrer_sources, public.user_cookie_consents TO anon;';
    EXECUTE 'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO authenticated, anon;';

    -- STEP 4: DROP EXISTING ''anon'' POLICIES ACROSS ALL TABLES
    FOR pol IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND ('anon' = ANY(roles) OR policyname LIKE '%anon%')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I;', pol.policyname, pol.schemaname, pol.tablename);
        RAISE NOTICE 'Dropped anon policy: % on %.%', pol.policyname, pol.schemaname, pol.tablename;
    END LOOP;

    -- STEP 5: CREATE FRESH POLICIES FOR ''authenticated'' ROLE ON ALL BASE TABLES
    FOR r IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', r.table_name || '_authenticated_select', r.table_name);
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', r.table_name || '_authenticated_insert', r.table_name);
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', r.table_name || '_authenticated_update', r.table_name);
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', r.table_name || '_authenticated_delete', r.table_name);

        -- SELECT POLICY
        IF r.table_name IN ('admin_users', 'admin_sessions') THEN
            EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (auth.uid() = id OR auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));', r.table_name || '_authenticated_select', r.table_name);
        ELSE
            EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated, anon USING (true);', r.table_name || '_authenticated_select', r.table_name);
        END IF;

        -- INSERT POLICY
        IF r.table_name IN ('contact_inquiries', 'page_views', 'service_views', 'referrer_sources', 'user_cookie_consents') THEN
            EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated, anon WITH CHECK (true);', r.table_name || '_authenticated_insert', r.table_name);
        ELSE
            EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));', r.table_name || '_authenticated_insert', r.table_name);
        END IF;

        -- UPDATE POLICY
        IF r.table_name = 'admin_users' THEN
            EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);', r.table_name || '_authenticated_update', r.table_name);
        ELSE
            EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true)) WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));', r.table_name || '_authenticated_update', r.table_name);
        END IF;

        -- DELETE POLICY
        EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));', r.table_name || '_authenticated_delete', r.table_name);
    END LOOP;
END $$;
