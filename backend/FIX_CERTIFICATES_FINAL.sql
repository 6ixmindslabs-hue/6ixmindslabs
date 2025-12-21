-- COMPREHENSIVE FIX FOR CERTIFICATES TABLE
-- Run this in your Supabase SQL Editor

ALTER TABLE public.certificates 
ADD COLUMN IF NOT EXISTS internship_duration text default '',
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS end_date date,
ADD COLUMN IF NOT EXISTS skills text[] default '{}';

-- Optional: Verify the columns exist
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'certificates';
