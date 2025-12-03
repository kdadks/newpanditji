-- ============================================================================
-- MIGRATION 7: Contact Inquiries
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_name TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  preferred_contact_method TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  location TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  response_text TEXT,
  responded_by UUID REFERENCES admin_users(id),
  responded_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_priority ON contact_inquiries(priority);
