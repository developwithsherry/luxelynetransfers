-- ==============================================================================
-- Supabase SQL Migration: Add vehicle_type for Offline Hardcoded Fleet Categories
-- Description:
-- 1. Adds `vehicle_type` column to public.booking to store hardcoded vehicle categories:
--    (Saloon, Estate, MPV, Minibus, Executive Saloon, Executive Minibus).
-- 2. Ensures `vehicle_id` is nullable so offline bookings are not strictly tied to live fleet UUIDs.
-- 3. Adds index on vehicle_type for high performance dashboard filtering & search.
-- Execute this script directly in the Supabase Dashboard -> SQL Editor.
-- ==============================================================================

-- 1. Add vehicle_type column if not exists
ALTER TABLE IF EXISTS public.booking
ADD COLUMN IF NOT EXISTS vehicle_type TEXT;

-- 2. Ensure vehicle_id column is nullable
DO $$
BEGIN
    ALTER TABLE public.booking ALTER COLUMN vehicle_id DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'vehicle_id column already nullable: %', SQLERRM;
END $$;

-- 3. Add performance index on vehicle_type
CREATE INDEX IF NOT EXISTS idx_booking_vehicle_type 
ON public.booking (vehicle_type);

-- 4. Add column documentation
COMMENT ON COLUMN public.booking.vehicle_type IS 'Hardcoded fleet category for offline bookings (Saloon, Estate, MPV, Minibus, Executive Saloon, Executive Minibus)';
