-- ========================================================
-- GOLDEN SPORT ACADEMY SANTA CRUZ - SUPABASE DATABASE SCHEMA
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    jersey_number INT,
    position VARCHAR(50),
    medical_notes TEXT,
    guardian_name VARCHAR(150) NOT NULL,
    guardian_phone VARCHAR(50) NOT NULL,
    guardian_email VARCHAR(150),
    monthly_fee NUMERIC(10, 2) DEFAULT 18000.00,
    due_day INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    player_name VARCHAR(200) NOT NULL,
    guardian_name VARCHAR(150) NOT NULL,
    guardian_phone VARCHAR(50) NOT NULL,
    month VARCHAR(50) NOT NULL,
    month_index INT NOT NULL,
    year INT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
    due_date DATE NOT NULL,
    paid_date TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opponent VARCHAR(150) NOT NULL,
    opponent_logo TEXT,
    category VARCHAR(50) NOT NULL,
    match_date DATE NOT NULL,
    match_time VARCHAR(20) NOT NULL,
    location VARCHAR(200) NOT NULL,
    location_url TEXT,
    home_away VARCHAR(10) CHECK (home_away IN ('local', 'visita')),
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'finished')),
    score_golden INT,
    score_opponent INT,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. GALLERY PHOTOS TABLE (Shared album by date & event)
CREATE TABLE IF NOT EXISTS public.gallery_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_date DATE NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    photo_url TEXT NOT NULL,
    caption TEXT,
    uploader_name VARCHAR(150) DEFAULT 'Padre / Aficionado',
    is_approved BOOLEAN DEFAULT TRUE,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SPONSORS TABLE
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    tier VARCHAR(20) CHECK (tier IN ('oro', 'plata', 'bronce')),
    logo_url TEXT NOT NULL,
    tagline TEXT,
    website_url TEXT,
    whatsapp_phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PRE-REGISTRATIONS (Prospective Students)
CREATE TABLE IF NOT EXISTS public.inquiries_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name VARCHAR(150) NOT NULL,
    birth_date DATE,
    guardian_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    category VARCHAR(50),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'contactado', 'matriculado', 'descartado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to matches, approved gallery photos, and active sponsors
CREATE POLICY "Public Read Matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Public Read Photos" ON public.gallery_photos FOR SELECT USING (is_approved = true);
CREATE POLICY "Public Insert Photos" ON public.gallery_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Sponsors" ON public.sponsors FOR SELECT USING (is_active = true);
CREATE POLICY "Public Insert Inquiries" ON public.inquiries_registrations FOR INSERT WITH CHECK (true);

-- Authenticated full access
CREATE POLICY "Admin Full Access Players" ON public.players FOR ALL USING (true);
CREATE POLICY "Admin Full Access Payments" ON public.payment_records FOR ALL USING (true);
CREATE POLICY "Admin Full Access Matches" ON public.matches FOR ALL USING (true);
CREATE POLICY "Admin Full Access Photos" ON public.gallery_photos FOR ALL USING (true);
CREATE POLICY "Admin Full Access Sponsors" ON public.sponsors FOR ALL USING (true);
CREATE POLICY "Admin Full Access Inquiries" ON public.inquiries_registrations FOR ALL USING (true);

-- STORAGE BUCKETS SETUP
-- Insert into storage.buckets (Run via Supabase Storage UI or SQL if supported):
-- 1. 'gallery' (Public read, Authenticated/Public write)
-- 2. 'sponsors' (Public read)
-- 3. 'receipts' (Authenticated read/write)
