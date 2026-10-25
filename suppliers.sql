-- ==============================================================================
-- Supabase SQL Migration: Suppliers Table
-- Description: Stores vendor/supplier details including support email and portal credentials.
-- Execute this script directly in the Supabase Dashboard -> SQL Editor.
-- ==============================================================================

-- 1. Create the suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    support_email TEXT,
    username TEXT,
    password TEXT,
    phone TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add helpful indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON public.suppliers (name);
CREATE INDEX IF NOT EXISTS idx_suppliers_created_at ON public.suppliers (created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Drop existing policies if any to allow safe re-runs
DROP POLICY IF EXISTS "Allow authenticated full access to suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Allow service role full access to suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Allow anon full access to suppliers" ON public.suppliers;

-- Allow authenticated users (e.g. logged-in admin users) full CRUD access
CREATE POLICY "Allow authenticated full access to suppliers"
ON public.suppliers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow service_role key full CRUD access (e.g. API routes, background jobs)
CREATE POLICY "Allow service role full access to suppliers"
ON public.suppliers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow anon key full CRUD access if your admin dashboard communicates via anon key
CREATE POLICY "Allow anon full access to suppliers"
ON public.suppliers
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- 5. Trigger function to automatically maintain updated_at on record updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_suppliers_updated_at ON public.suppliers;
CREATE TRIGGER trigger_suppliers_updated_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Comment on table and columns for Supabase documentation
COMMENT ON TABLE public.suppliers IS 'List of transportation, fleet, and service suppliers working with Luxelyne Transfers';
COMMENT ON COLUMN public.suppliers.name IS 'Company / Supplier Name';
COMMENT ON COLUMN public.suppliers.support_email IS 'Customer support / contact email for the supplier';
COMMENT ON COLUMN public.suppliers.username IS 'Username or account ID for supplier portal';
COMMENT ON COLUMN public.suppliers.password IS 'Portal password or credentials for supplier login';
COMMENT ON COLUMN public.suppliers.phone IS 'Optional contact phone number for dispatch or urgent support';
COMMENT ON COLUMN public.suppliers.notes IS 'Internal notes, portal URL, contract terms, or vehicle types provided';
