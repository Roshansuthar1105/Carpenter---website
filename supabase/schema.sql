-- ==============================================================================
-- Sharma Ji Woodcraft & Aluminium Fabricators - Supabase Database Schema
-- ==============================================================================
-- Run this in your Supabase Project -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('doors', 'windows', 'almirahs', 'beds-mandirs', 'farm-shop', 'repairs')),
    title TEXT NOT NULL,
    title_hindi TEXT NOT NULL,
    village TEXT NOT NULL,
    material TEXT NOT NULL CHECK (material IN ('wood', 'aluminium')),
    image_url TEXT NOT NULL,
    approx_price NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BEFORE & AFTER TRANSFORMATIONS TABLE
CREATE TABLE IF NOT EXISTS public.transformations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village TEXT NOT NULL,
    village_hindi TEXT NOT NULL,
    title TEXT NOT NULL,
    title_hindi TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('wood', 'aluminium')),
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    material_spec TEXT NOT NULL DEFAULT '',
    hardware_spec TEXT NOT NULL DEFAULT '',
    delivery_spec TEXT NOT NULL DEFAULT '',
    quote TEXT NOT NULL DEFAULT '',
    quote_author TEXT NOT NULL DEFAULT '',
    quote_author_hindi TEXT NOT NULL DEFAULT '',
    warranty TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VILLAGE PINS & VIDEO REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.village_pins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_hindi TEXT NOT NULL,
    distance_km NUMERIC DEFAULT 0,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    work_count NUMERIC DEFAULT 0,
    rating NUMERIC DEFAULT 5.0,
    featured_work_title TEXT NOT NULL,
    featured_work_title_hindi TEXT NOT NULL,
    image_url TEXT NOT NULL,
    video_url TEXT DEFAULT '',
    audio_url TEXT DEFAULT '',
    quote TEXT NOT NULL DEFAULT '',
    quote_author TEXT NOT NULL DEFAULT '',
    work_type TEXT NOT NULL DEFAULT '',
    delivery_time TEXT NOT NULL DEFAULT '',
    materials TEXT NOT NULL DEFAULT '',
    warranty TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & POLICIES
-- ==============================================================================

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access on all tables
DROP POLICY IF EXISTS "Public read access for gallery" ON public.gallery;
CREATE POLICY "Public read access for gallery" ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for transformations" ON public.transformations;
CREATE POLICY "Public read access for transformations" ON public.transformations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for village_pins" ON public.village_pins;
CREATE POLICY "Public read access for village_pins" ON public.village_pins FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for site_settings" ON public.site_settings;
CREATE POLICY "Public read access for site_settings" ON public.site_settings FOR SELECT USING (true);

-- Allow insert/update/delete with anon key (admin protected by client-side login)
DROP POLICY IF EXISTS "Allow anon inserts for gallery" ON public.gallery;
CREATE POLICY "Allow anon inserts for gallery" ON public.gallery FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon updates for gallery" ON public.gallery;
CREATE POLICY "Allow anon updates for gallery" ON public.gallery FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon deletes for gallery" ON public.gallery;
CREATE POLICY "Allow anon deletes for gallery" ON public.gallery FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow anon inserts for transformations" ON public.transformations;
CREATE POLICY "Allow anon inserts for transformations" ON public.transformations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon updates for transformations" ON public.transformations;
CREATE POLICY "Allow anon updates for transformations" ON public.transformations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon deletes for transformations" ON public.transformations;
CREATE POLICY "Allow anon deletes for transformations" ON public.transformations FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow anon inserts for village_pins" ON public.village_pins;
CREATE POLICY "Allow anon inserts for village_pins" ON public.village_pins FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon updates for village_pins" ON public.village_pins;
CREATE POLICY "Allow anon updates for village_pins" ON public.village_pins FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon deletes for village_pins" ON public.village_pins;
CREATE POLICY "Allow anon deletes for village_pins" ON public.village_pins FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow anon all for site_settings" ON public.site_settings;
CREATE POLICY "Allow anon all for site_settings" ON public.site_settings FOR ALL USING (true);

