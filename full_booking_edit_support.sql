-- ==============================================================================
-- Supabase SQL Migration: Full Booking Edit Support
-- Description:
-- Ensures all columns required for full booking editing (Schedule, Return Trip,
-- Route, Stops, Distance, Passenger Contact, Capacity, Vehicle Category,
-- Financials, Driver Allocation, Supplier, and Flight Details) exist on
-- `public.booking` with safe nullable constraints and full RLS policies.
-- Execute this script in the Supabase Dashboard -> SQL Editor.
-- ==============================================================================

-- 1. Ensure all editable columns exist on `public.booking`
ALTER TABLE IF EXISTS public.booking
ADD COLUMN IF NOT EXISTS pickup_location TEXT,
ADD COLUMN IF NOT EXISTS drop_off_location TEXT,
ADD COLUMN IF NOT EXISTS date TEXT,
ADD COLUMN IF NOT EXISTS time TEXT,
ADD COLUMN IF NOT EXISTS with_return BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS return_date TEXT,
ADD COLUMN IF NOT EXISTS return_time TEXT,
ADD COLUMN IF NOT EXISTS stops JSONB,
ADD COLUMN IF NOT EXISTS total_distance NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'miles',
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS no_passengers INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS no_laguage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS no_hand_laguage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS vehicle_type TEXT,
ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS driver_price NUMERIC(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS driver_instructions TEXT,
ADD COLUMN IF NOT EXISTS intructions TEXT,
ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS supplier_reference TEXT,
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website',
ADD COLUMN IF NOT EXISTS flight_no TEXT,
ADD COLUMN IF NOT EXISTS arriving_from TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- 2. Make optional fields safely nullable so partial edits never fail on NOT NULL
DO $$
BEGIN
    ALTER TABLE public.booking ALTER COLUMN email DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.booking ALTER COLUMN phone DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.booking ALTER COLUMN last_name DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.booking ALTER COLUMN vehicle_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.booking ALTER COLUMN return_date DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.booking ALTER COLUMN return_time DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 3. Ensure full UPDATE / ALL policies on `public.booking`
ALTER TABLE IF EXISTS public.booking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on booking for authenticated" ON public.booking;
DROP POLICY IF EXISTS "Allow all on booking for anon" ON public.booking;
DROP POLICY IF EXISTS "Allow all on booking for service_role" ON public.booking;

CREATE POLICY "Allow all on booking for authenticated"
ON public.booking FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all on booking for anon"
ON public.booking FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all on booking for service_role"
ON public.booking FOR ALL TO service_role USING (true) WITH CHECK (true);

