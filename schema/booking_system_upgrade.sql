-- ==============================================================================
-- Supabase SQL Migration: Booking System Upgrade
-- Features:
-- 1. Supplier & Source Tracking (Website vs Supplier, Supplier Reference)
-- 2. Driver Job Assignment & Driver Price
-- 3. Flight details & Driver Instructions
-- 4. New Job Statuses (Confirmed, Covered, POB, Completed, Complaint)
-- 5. New Payment Statuses (Pending, Paid, Paid to Driver)
-- Execute this script directly in the Supabase Dashboard -> SQL Editor.
-- ==============================================================================

-- 1. Add new columns to `booking` table
ALTER TABLE IF EXISTS public.booking 
ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS supplier_reference TEXT,
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website',
ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS driver_price NUMERIC(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS driver_instructions TEXT,
ADD COLUMN IF NOT EXISTS flight_no TEXT,
ADD COLUMN IF NOT EXISTS arriving_from TEXT;

-- 2. Add performance indexes for rapid lookups and driver/supplier statistics
CREATE INDEX IF NOT EXISTS idx_booking_supplier_id ON public.booking (supplier_id);
CREATE INDEX IF NOT EXISTS idx_booking_driver_id ON public.booking (driver_id);
CREATE INDEX IF NOT EXISTS idx_booking_source ON public.booking (source);
CREATE INDEX IF NOT EXISTS idx_booking_date ON public.booking (date DESC);
CREATE INDEX IF NOT EXISTS idx_booking_status ON public.booking (status);
CREATE INDEX IF NOT EXISTS idx_booking_payment_status ON public.booking (payment_status);

-- 3. Set existing bookings without a source to 'website'
UPDATE public.booking 
SET source = 'website' 
WHERE source IS NULL;

-- 4. Ensure RLS is enabled with full ALL access policies for booking, suppliers, and drivers
ALTER TABLE IF EXISTS public.booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.drivers ENABLE ROW LEVEL SECURITY;

-- Refresh/ensure full policies on booking
DROP POLICY IF EXISTS "Allow all on booking for authenticated" ON public.booking;
DROP POLICY IF EXISTS "Allow all on booking for anon" ON public.booking;
DROP POLICY IF EXISTS "Allow all on booking for service_role" ON public.booking;

CREATE POLICY "Allow all on booking for authenticated"
ON public.booking FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all on booking for anon"
ON public.booking FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all on booking for service_role"
ON public.booking FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 5. Foreign Key cascade adjustments for suppliers & drivers
DO $$
BEGIN
    -- Check constraint for supplier_id if needed
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
          AND table_name = 'booking' 
          AND constraint_name = 'fk_booking_supplier'
    ) THEN
        ALTER TABLE public.booking 
        ADD CONSTRAINT fk_booking_supplier 
        FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Notice: %', SQLERRM;
END $$;

DO $$
BEGIN
    -- Check constraint for driver_id if needed
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
          AND table_name = 'booking' 
          AND constraint_name = 'fk_booking_driver'
    ) THEN
        ALTER TABLE public.booking 
        ADD CONSTRAINT fk_booking_driver 
        FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE SET NULL;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Notice: %', SQLERRM;
END $$;

COMMENT ON COLUMN public.booking.supplier_id IS 'Associated supplier if booking was assigned from or outsourced to a supplier';
COMMENT ON COLUMN public.booking.supplier_reference IS 'Supplier reference number/ID for offline or outsourced jobs';
COMMENT ON COLUMN public.booking.source IS 'Source of the booking: website or offline';
COMMENT ON COLUMN public.booking.driver_id IS 'Driver assigned to execute this transfer';
COMMENT ON COLUMN public.booking.driver_price IS 'Amount in GBP payable to the assigned driver';
COMMENT ON COLUMN public.booking.driver_instructions IS 'Specific notes or instructions for the driver';
