-- ============================================================================
-- MIGRATION 10: Cookie Consent Management
-- ============================================================================

-- Cookie Categories Table
CREATE TABLE IF NOT EXISTS cookie_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_required BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cookie_categories_sort_order ON cookie_categories(sort_order);

-- Cookies Table
CREATE TABLE IF NOT EXISTS cookies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES cookie_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  purpose TEXT NOT NULL,
  expiration TEXT NOT NULL,
  cookie_type TEXT NOT NULL CHECK (cookie_type IN ('first-party', 'third-party')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cookies_category_id ON cookies(category_id);

-- User Cookie Consents Table
CREATE TABLE IF NOT EXISTS user_cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_id TEXT NOT NULL UNIQUE,
  necessary_cookies BOOLEAN DEFAULT true,
  analytics_cookies BOOLEAN DEFAULT false,
  marketing_cookies BOOLEAN DEFAULT false,
  preferences_cookies BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  consent_version TEXT,
  consented_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_user_cookie_consents_consent_id ON user_cookie_consents(consent_id);
CREATE INDEX IF NOT EXISTS idx_user_cookie_consents_consented_at ON user_cookie_consents(consented_at DESC);

-- Cookie Policy Versions Table
CREATE TABLE IF NOT EXISTS cookie_policy_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
