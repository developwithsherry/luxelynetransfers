-- ==============================================================================
-- Supabase SQL Migration: Driver Document Expiry Dates & Compliance Tracking
-- Description: Adds optional expiry date tracking for all driver documents
--              (Driving License, PHV/PCO License, Log Book V5C, Insurance, MOT).
--
-- How to apply:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project and go to SQL Editor in the left sidebar.
-- 3. Click "New query", paste the contents of this file, and click "Run".
-- ==============================================================================

-- 1. Add optional expiry date columns to public.drivers table
ALTER TABLE public.drivers
ADD COLUMN IF NOT EXISTS driving_license_expiry DATE,
ADD COLUMN IF NOT EXISTS phv_license_expiry DATE,
ADD COLUMN IF NOT EXISTS log_book_expiry DATE,
ADD COLUMN IF NOT EXISTS insurance_expiry DATE,
ADD COLUMN IF NOT EXISTS mot_expiry DATE;

-- 2. Add performance indexes for rapid querying of document expiration states
CREATE INDEX IF NOT EXISTS idx_drivers_driving_license_expiry ON public.drivers (driving_license_expiry);
CREATE INDEX IF NOT EXISTS idx_drivers_phv_license_expiry ON public.drivers (phv_license_expiry);
CREATE INDEX IF NOT EXISTS idx_drivers_log_book_expiry ON public.drivers (log_book_expiry);
CREATE INDEX IF NOT EXISTS idx_drivers_insurance_expiry ON public.drivers (insurance_expiry);
CREATE INDEX IF NOT EXISTS idx_drivers_mot_expiry ON public.drivers (mot_expiry);

-- 3. Add column documentation comments
COMMENT ON COLUMN public.drivers.driving_license_expiry IS 'Optional expiry date for the driver driving license';
COMMENT ON COLUMN public.drivers.phv_license_expiry IS 'Optional expiry date for the driver PHV / PCO license';
COMMENT ON COLUMN public.drivers.log_book_expiry IS 'Optional expiry date for the vehicle log book (V5C)';
COMMENT ON COLUMN public.drivers.insurance_expiry IS 'Optional expiry date for the commercial hire & reward vehicle insurance';
COMMENT ON COLUMN public.drivers.mot_expiry IS 'Optional expiry date for the vehicle MOT certificate';

-- 4. Helpful View: Query all active drivers with expired documents
-- Used for audit queries or compliance reports
CREATE OR REPLACE VIEW public.driver_expired_documents_view AS
SELECT
    d.id,
    d.name,
    d.phone,
    d.photo_url,
    d.is_active,
    expired_docs.doc_type,
    expired_docs.doc_label,
    expired_docs.doc_url,
    expired_docs.expiry_date,
    (CURRENT_DATE - expired_docs.expiry_date) AS days_expired
FROM public.drivers d
CROSS JOIN LATERAL (
    VALUES
        ('driving_license', 'Driving License', d.driving_license_url, d.driving_license_expiry),
        ('phv_license', 'PHV License', d.phv_license_url, d.phv_license_expiry),
        ('log_book', 'Log Book (V5C)', d.log_book_url, d.log_book_expiry),
        ('insurance', 'Insurance Certificate', d.insurance_url, d.insurance_expiry),
        ('mot', 'MOT Certificate', d.mot_url, d.mot_expiry)
) AS expired_docs(doc_type, doc_label, doc_url, expiry_date)
WHERE expired_docs.expiry_date IS NOT NULL
  AND expired_docs.expiry_date < CURRENT_DATE;

-- Grant permissions for authenticated and service roles
GRANT SELECT ON public.driver_expired_documents_view TO authenticated;
GRANT SELECT ON public.driver_expired_documents_view TO service_role;
GRANT SELECT ON public.driver_expired_documents_view TO anon;
