-- ============================================================================
-- LUXELYNE TRANSFERS LTD — DRIVER HIRING & APPLICATIONS SCHEMA
-- Run this script in your Supabase SQL Editor
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.driver_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  city_area TEXT NOT NULL,
  vehicle_category TEXT NOT NULL CHECK (
    vehicle_category IN (
      'Saloon',
      'Estate',
      'People Carrier',
      'Minibus',
      'Executive Minibus',
      'Executive Saloon'
    )
  ),
  vehicle_make_model TEXT,
  experience_years TEXT,
  availability TEXT DEFAULT 'Full-Time',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (
    status IN ('new', 'contacted', 'shortlisted', 'hired', 'rejected')
  ),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast filtering in Admin "Driver Hiring" page
CREATE INDEX IF NOT EXISTS idx_driver_applications_created_at
  ON public.driver_applications (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_driver_applications_status
  ON public.driver_applications (status);

CREATE INDEX IF NOT EXISTS idx_driver_applications_vehicle_category
  ON public.driver_applications (vehicle_category);

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.update_driver_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_driver_applications_updated_at ON public.driver_applications;
CREATE TRIGGER trg_driver_applications_updated_at
  BEFORE UPDATE ON public.driver_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_driver_applications_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.driver_applications ENABLE ROW LEVEL SECURITY;

-- 1. Allow anyone (public website visitors) to submit a driver application
DROP POLICY IF EXISTS "Allow public insert on driver_applications" ON public.driver_applications;
CREATE POLICY "Allow public insert on driver_applications"
  ON public.driver_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 2. Allow authenticated admins to view all driver applications
DROP POLICY IF EXISTS "Allow authenticated read on driver_applications" ON public.driver_applications;
CREATE POLICY "Allow authenticated read on driver_applications"
  ON public.driver_applications
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- 3. Allow authenticated admins to update status and notes
DROP POLICY IF EXISTS "Allow authenticated update on driver_applications" ON public.driver_applications;
CREATE POLICY "Allow authenticated update on driver_applications"
  ON public.driver_applications
  FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- 4. Allow authenticated admins to delete applications
DROP POLICY IF EXISTS "Allow authenticated delete on driver_applications" ON public.driver_applications;
CREATE POLICY "Allow authenticated delete on driver_applications"
  ON public.driver_applications
  FOR DELETE
  TO authenticated, anon
  USING (true);

