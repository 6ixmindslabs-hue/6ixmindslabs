-- Add missing columns to certificates table
ALTER TABLE public.certificates 
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS end_date date;

-- Refresh PostgREST cache (optional but helpful if issues persist)
-- NOTIFY pgrst, 'reload schema';
