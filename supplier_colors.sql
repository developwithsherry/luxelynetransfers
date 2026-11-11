-- ==============================================================================
-- Supabase SQL Migration: Add Brand Color Column to Suppliers Table
-- Description: Adds a `color` column to `public.suppliers` and automatically
--              assigns a distinct color to all existing suppliers that don't have one.
-- Execute this script directly in the Supabase Dashboard -> SQL Editor.
-- ==============================================================================

-- 1. Add the color column to the suppliers table if it does not already exist
ALTER TABLE public.suppliers
ADD COLUMN IF NOT EXISTS color TEXT;

COMMENT ON COLUMN public.suppliers.color IS 'Hex color code (e.g. #7c3aed) used for supplier abbreviation avatar and booking badges';

-- 2. Backfill existing suppliers without a color so every existing supplier gets a unique default color
WITH palette AS (
    SELECT ARRAY[
        '#7c3aed', -- Violet
        '#2563eb', -- Royal Blue
        '#059669', -- Emerald
        '#e11d48', -- Rose
        '#d97706', -- Amber
        '#0891b2', -- Cyan
        '#4f46e5', -- Indigo
        '#c026d3', -- Fuchsia
        '#0d9488', -- Teal
        '#ea580c', -- Orange
        '#0284c7', -- Sky Blue
        '#db2777', -- Pink
        '#65a30d', -- Lime
        '#dc2626', -- Crimson
        '#9333ea', -- Purple
        '#334155'  -- Slate
    ] AS colors
),
numbered_suppliers AS (
    SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) AS rn
    FROM public.suppliers
    WHERE color IS NULL OR TRIM(color) = ''
)
UPDATE public.suppliers s
SET color = p.colors[((ns.rn - 1) % array_length(p.colors, 1)) + 1]
FROM numbered_suppliers ns
CROSS JOIN palette p
WHERE s.id = ns.id;

