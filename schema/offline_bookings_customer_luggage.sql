-- ==============================================================================
-- Supabase SQL Migration: Make Email/Phone Optional & Add Passenger/Luggage Fields
-- Description:
-- 1. Drops NOT NULL constraints on email, phone, and last_name in public.booking
--    so offline/supplier bookings without passenger contact info can be created smoothly.
-- 2. Ensures no_passengers, no_laguage (suitcases/luggage), and no_hand_laguage
--    columns exist on public.booking with safe defaults.
-- Execute this script directly in the Supabase Dashboard -> SQL Editor.
-- ==============================================================================

-- 1. Make customer email, phone, and last_name optional
DO $$
BEGIN
    ALTER TABLE public.booking ALTER COLUMN email DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'email column already nullable or does not exist: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER TABLE public.booking ALTER COLUMN phone DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'phone column already nullable or does not exist: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER TABLE public.booking ALTER COLUMN last_name DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'last_name column already nullable or does not exist: %', SQLERRM;
END $$;

-- 2. Ensure columns for passengers, suitcases/luggage, and hand luggage exist
ALTER TABLE IF EXISTS public.booking
ADD COLUMN IF NOT EXISTS no_passengers INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS no_laguage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS no_hand_laguage INTEGER DEFAULT 0;

-- 3. Add column documentation comments
COMMENT ON COLUMN public.booking.email IS 'Customer email address (optional for supplier/offline bookings)';
COMMENT ON COLUMN public.booking.phone IS 'Customer phone number (optional for supplier/offline bookings)';
COMMENT ON COLUMN public.booking.no_passengers IS 'Number of passengers (optional for offline bookings, default 1)';
COMMENT ON COLUMN public.booking.no_laguage IS 'Number of suitcases / standard luggage pieces';
COMMENT ON COLUMN public.booking.no_hand_laguage IS 'Number of hand luggage / small bags';
