-- ============================================================================
-- LUXELYNE TRANSFERS: 24-Hour Time Format Migration
-- Run this in your Supabase SQL Editor to convert existing 12-hour (AM/PM)
-- booking times into standardized 24-hour (HH:MM) format (e.g. "07:30 PM" -> "19:30").
-- ============================================================================

-- 1. Ensure time and return_time columns are TEXT so they store "HH:MM" cleanly
ALTER TABLE public.booking
  ALTER COLUMN time TYPE TEXT USING time::TEXT,
  ALTER COLUMN return_time TYPE TEXT USING return_time::TEXT;

-- 2. Convert any 12-hour AM/PM values in `time` to 24-hour HH:MM format
UPDATE public.booking
SET time = TO_CHAR(TO_TIMESTAMP(TRIM(time), 'HH12:MI AM'), 'HH24:MI')
WHERE time IS NOT NULL
  AND TRIM(time) ~* '^\d{1,2}:\d{2}\s*(AM|PM)$';

-- 3. Convert any 12-hour AM/PM values in `return_time` to 24-hour HH:MM format
UPDATE public.booking
SET return_time = TO_CHAR(TO_TIMESTAMP(TRIM(return_time), 'HH12:MI AM'), 'HH24:MI')
WHERE return_time IS NOT NULL
  AND TRIM(return_time) ~* '^\d{1,2}:\d{2}\s*(AM|PM)$';

-- 4. Pad single-digit 24h hours (e.g. "9:05" -> "09:05")
UPDATE public.booking
SET time = LPAD(TRIM(time), 5, '0')
WHERE time IS NOT NULL
  AND TRIM(time) ~ '^\d:\d{2}$';

UPDATE public.booking
SET return_time = LPAD(TRIM(return_time), 5, '0')
WHERE return_time IS NOT NULL
  AND TRIM(return_time) ~ '^\d:\d{2}$';

