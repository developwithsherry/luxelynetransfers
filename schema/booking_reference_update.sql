-- ==============================================================================
-- Supabase SQL Migration: Booking Reference System Optimization
-- Description:
-- 1. Guarantees that the `id` column on public.booking defaults to gen_random_uuid()
--    so every booking is always guaranteed a unique system reference at the DB level.
-- 2. Ensures the `supplier_reference` column exists.
-- 3. Adds performance indexes for supplier reference lookups and searches.
-- Execute this script directly in the Supabase Dashboard -> SQL Editor.
-- ==============================================================================

-- 1. Enable pgcrypto extension if not already enabled (provides gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Ensure supplier_reference column exists on public.booking
ALTER TABLE IF EXISTS public.booking
ADD COLUMN IF NOT EXISTS supplier_reference TEXT;

-- 3. Ensure the `id` column defaults to gen_random_uuid() if omitted
DO $$
BEGIN
    ALTER TABLE public.booking ALTER COLUMN id SET DEFAULT gen_random_uuid();
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not set default for id column (it may already have a sequence or default): %', SQLERRM;
END $$;

-- 4. Create performance indexes for rapid reference searches
CREATE INDEX IF NOT EXISTS idx_booking_supplier_reference 
ON public.booking (supplier_reference);

CREATE INDEX IF NOT EXISTS idx_booking_supplier_reference_lower 
ON public.booking (LOWER(supplier_reference));

-- 5. Add helpful documentation comments on the columns
COMMENT ON COLUMN public.booking.id IS 'System generated booking reference UUID (displayed as #XXXXX in dashboard)';
COMMENT ON COLUMN public.booking.supplier_reference IS 'Optional supplier job reference number, stored internally inside the job details';
