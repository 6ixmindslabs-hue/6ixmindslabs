-- ============================================
-- SUPABASE STORAGE SETUP FOR CERTIFICATES
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- This will create the required storage buckets and policies

-- 1. Create 'student-profiles' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-profiles', 'student-profiles', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create 'certificates' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Policies for 'student-profiles' bucket
-- Allow public read access
CREATE POLICY "Public Read Access for Student Profiles"
ON storage.objects FOR SELECT
USING (bucket_id = 'student-profiles');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Insert for Student Profiles"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'student-profiles' AND auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Authenticated Update for Student Profiles"
ON storage.objects FOR UPDATE
USING (bucket_id = 'student-profiles' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated Delete for Student Profiles"
ON storage.objects FOR DELETE
USING (bucket_id = 'student-profiles' AND auth.role() = 'authenticated');

-- Policies for 'certificates' bucket
-- Allow public read access
CREATE POLICY "Public Read Access for Certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Insert for Certificates"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificates' AND auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Authenticated Update for Certificates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certificates' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated Delete for Certificates"
ON storage.objects FOR DELETE
USING (bucket_id = 'certificates' AND auth.role() = 'authenticated');
