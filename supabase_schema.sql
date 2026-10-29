-- ====================================================================
-- श्री गोवर्धन पूजा समिति 2026 (रमन डिहरा) - Supabase SQL Schema
-- Govardhan Puja Samiti Smart Management Portal 2026 (Raman Dihra)
-- ====================================================================

-- 1. App Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
    id TEXT PRIMARY KEY DEFAULT 'current_settings',
    upi_id TEXT NOT NULL DEFAULT 'govardhan.ramandihra@oksbi',
    payee_name TEXT NOT NULL DEFAULT 'श्री गोवर्धन पूजा समिति 2026 (रमन डिहरा)',
    default_contribution NUMERIC NOT NULL DEFAULT 7.00,
    organizer_name TEXT NOT NULL DEFAULT 'सुरेश भाई पटेल (मुख्य संयोजक)',
    organizer_phone TEXT NOT NULL DEFAULT '9876543210',
    temple_address TEXT NOT NULL DEFAULT 'श्री कृष्ण मंदिर परिसर, ग्राम - रमन डिहरा',
    event_date DATE NOT NULL DEFAULT '2026-11-10',
    admin_passcode TEXT NOT NULL DEFAULT 'govardhan2026',
    privacy_mask_phone BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Members Table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id TEXT UNIQUE NOT NULL, -- e.g. GPS-2026-001
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    address TEXT,
    contribution_required NUMERIC NOT NULL DEFAULT 7.00,
    amount_paid NUMERIC NOT NULL DEFAULT 0.00,
    balance NUMERIC GENERATED ALWAYS AS (GREATEST(0, contribution_required - amount_paid)) STORED,
    payment_method TEXT CHECK (payment_method IN ('upi', 'cash')) DEFAULT 'upi',
    payment_status TEXT CHECK (payment_status IN ('paid', 'partially_paid', 'pending')) DEFAULT 'pending',
    payment_verified BOOLEAN DEFAULT false,
    payment_date DATE,
    transaction_ref TEXT,
    notes TEXT,
    last_contact_date DATE,
    consent_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_members_mobile ON members(mobile);
CREATE INDEX IF NOT EXISTS idx_members_name ON members(name);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(payment_status);

-- 3. Programs & Schedule Table
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    date DATE NOT NULL DEFAULT '2026-11-10',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    responsible_member TEXT NOT NULL,
    status TEXT CHECK (status IN ('planned', 'in_progress', 'completed')) DEFAULT 'planned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Announcements & Notices Table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT CHECK (category IN ('timing', 'meeting', 'payment', 'volunteer', 'general')) DEFAULT 'general',
    priority TEXT CHECK (priority IN ('normal', 'high')) DEFAULT 'normal',
    sender_name TEXT NOT NULL,
    target_group TEXT CHECK (target_group IN ('all', 'paid', 'pending')) DEFAULT 'all',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Member Contact Logs Table
CREATE TABLE IF NOT EXISTS contact_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id TEXT NOT NULL,
    member_name TEXT NOT NULL,
    member_mobile TEXT NOT NULL,
    contact_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT NOT NULL,
    contact_method TEXT CHECK (contact_method IN ('call', 'whatsapp', 'sms')) DEFAULT 'call',
    organizer_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view general app settings" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Public can view public programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Public can view announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public can view consented members" ON members FOR SELECT USING (consent_public = true);

-- Authenticated / Admin Policies
CREATE POLICY "Admin full access settings" ON app_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access members" ON members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access programs" ON programs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access announcements" ON announcements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access contact_logs" ON contact_logs FOR ALL USING (auth.role() = 'authenticated');

-- ====================================================================
-- INITIAL DEMO SEED DATA
-- ====================================================================

INSERT INTO app_settings (id, upi_id, payee_name, default_contribution, organizer_name, organizer_phone, temple_address, event_date)
VALUES ('current_settings', 'govardhansamiti2026@oksbi', 'Govardhan Puja Samiti 2026', 7.00, 'सुरेश भाई पटेल (मुख्य संयोजक)', '9876543210', 'श्री कृष्ण मंदिर परिसर, गोवर्धन चौक, वार्ड नं. 5', '2026-11-10')
ON CONFLICT (id) DO NOTHING;

INSERT INTO members (member_id, name, mobile, address, contribution_required, amount_paid, payment_method, payment_status, payment_verified, payment_date, transaction_ref, notes)
VALUES
('GPS-2026-001', 'रामेश्वर शर्मा (Demo)', '9876543211', 'वार्ड 4, मंदिर मार्ग', 7.00, 7.00, 'upi', 'paid', true, '2026-10-25', 'UPI/261025/892341', 'पूजन सामग्री व्यवस्थापक'),
('GPS-2026-002', 'सुरेश पटेल (Demo)', '9876543212', 'गोवर्धन नगर, गली 2', 7.00, 7.00, 'cash', 'paid', true, '2026-10-26', 'CASH-REC-002', 'पंडाल सजावट समिति'),
('GPS-2026-003', 'महेश वर्मा (Demo)', '9876543213', 'वार्ड 7, पटेल चौक', 7.00, 0.00, 'upi', 'pending', false, NULL, NULL, 'ऑनलाइन भुगतान आश्वासन दिया'),
('GPS-2026-004', 'दीपक जोशी (Demo)', '9876543214', 'शास्त्री नगर', 21.00, 21.00, 'upi', 'paid', true, '2026-10-26', 'UPI/261026/778899', 'विशेष भोग अर्पण सहयोग')
ON CONFLICT (member_id) DO NOTHING;
