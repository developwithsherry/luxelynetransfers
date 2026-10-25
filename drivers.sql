-- ==============================================================================
-- Supabase SQL Migration: Drivers Table & Storage Setup
-- Description: Stores driver information, licensing, contact info, and vehicle documentation.
-- Execute this script directly in the Supabase Dashboard -> SQL Editor.
-- ==============================================================================

-- 1. Create the drivers table
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    area_operates TEXT,
    photo_url TEXT,
    driving_license_url TEXT,
    phv_license_url TEXT,
    vehicle_model TEXT,
    vehicle_reg TEXT,
    vehicle_images JSONB DEFAULT '[]'::jsonb,
    log_book_url TEXT,
    insurance_url TEXT,
    mot_url TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_drivers_name ON public.drivers (name);
CREATE INDEX IF NOT EXISTS idx_drivers_phone ON public.drivers (phone);
CREATE INDEX IF NOT EXISTS idx_drivers_created_at ON public.drivers (created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies with full CRUD access (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Allow authenticated full access to drivers" ON public.drivers;
DROP POLICY IF EXISTS "Allow service role full access to drivers" ON public.drivers;
DROP POLICY IF EXISTS "Allow anon full access to drivers" ON public.drivers;

CREATE POLICY "Allow authenticated full access to drivers"
ON public.drivers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow service role full access to drivers"
ON public.drivers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anon full access to drivers"
ON public.drivers
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- 5. Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_drivers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_drivers_updated_at ON public.drivers;
CREATE TRIGGER trigger_drivers_updated_at
BEFORE UPDATE ON public.drivers
FOR EACH ROW
EXECUTE FUNCTION public.handle_drivers_updated_at();

-- 6. Setup Storage Bucket for Driver Photos & Documents
-- Creates 'drivers' bucket if it doesn't already exist and ensures it is public for previews
INSERT INTO storage.buckets (id, name, public)
VALUES ('drivers', 'drivers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage object policies for 'drivers' bucket
DROP POLICY IF EXISTS "Allow public read access on drivers bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated/anon upload on drivers bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated/anon update on drivers bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated/anon delete on drivers bucket" ON storage.objects;

CREATE POLICY "Allow public read access on drivers bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'drivers' OR bucket_id = 'images');

CREATE POLICY "Allow authenticated/anon upload on drivers bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'drivers' OR bucket_id = 'images');

CREATE POLICY "Allow authenticated/anon update on drivers bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'drivers' OR bucket_id = 'images');

CREATE POLICY "Allow authenticated/anon delete on drivers bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'drivers' OR bucket_id = 'images');

COMMENT ON TABLE public.drivers IS 'Driver roster, contact information, PHV licensing, and vehicle compliance documents';
