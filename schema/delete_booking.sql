-- ==============================================================================
-- Supabase SQL Migration: Enable Full CRUD & Booking Deletions with Cascade
-- Description: Ensures authenticated admins, anon users, and service role
--              have full permissions (SELECT, INSERT, UPDATE, DELETE) on
--              the `booking` and `booking_addons` tables.
-- Execute this script directly in the Supabase Dashboard -> SQL Editor.
-- ==============================================================================

-- 1. Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow all on booking for authenticated" ON public.booking;
DROP POLICY IF EXISTS "Allow all on booking for anon" ON public.booking;
DROP POLICY IF EXISTS "Allow all on booking for service_role" ON public.booking;

DROP POLICY IF EXISTS "Allow all on booking_addons for authenticated" ON public.booking_addons;
DROP POLICY IF EXISTS "Allow all on booking_addons for anon" ON public.booking_addons;
DROP POLICY IF EXISTS "Allow all on booking_addons for service_role" ON public.booking_addons;

DROP POLICY IF EXISTS "Allow authenticated users to delete booking" ON public.booking;
DROP POLICY IF EXISTS "Allow service role to delete booking" ON public.booking;
DROP POLICY IF EXISTS "Allow anon to delete booking" ON public.booking;

DROP POLICY IF EXISTS "Allow authenticated users to delete booking_addons" ON public.booking_addons;
DROP POLICY IF EXISTS "Allow service role to delete booking_addons" ON public.booking_addons;
DROP POLICY IF EXISTS "Allow anon to delete booking_addons" ON public.booking_addons;

-- 2. Create full CRUD policies for `booking`
CREATE POLICY "Allow all on booking for authenticated"
ON public.booking
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all on booking for anon"
ON public.booking
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all on booking for service_role"
ON public.booking
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 3. Create full CRUD policies for `booking_addons`
CREATE POLICY "Allow all on booking_addons for authenticated"
ON public.booking_addons
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all on booking_addons for anon"
ON public.booking_addons
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all on booking_addons for service_role"
ON public.booking_addons
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 4. Ensure RLS is enabled with the policies above
ALTER TABLE IF EXISTS public.booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.booking_addons ENABLE ROW LEVEL SECURITY;

-- 5. Add ON DELETE CASCADE to booking_addons foreign key constraint
DO $$
DECLARE
    fk_name TEXT;
BEGIN
    SELECT tc.constraint_name INTO fk_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'booking_addons'
      AND ccu.table_name = 'booking'
    LIMIT 1;

    IF fk_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.booking_addons DROP CONSTRAINT IF EXISTS ' || quote_ident(fk_name);
        EXECUTE 'ALTER TABLE public.booking_addons ADD CONSTRAINT ' || quote_ident(fk_name) || ' FOREIGN KEY (booking_id) REFERENCES public.booking(id) ON DELETE CASCADE';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Notice updating foreign key: %', SQLERRM;
END $$;
