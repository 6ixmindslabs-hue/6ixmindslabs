    -- ============================================
    -- SUPABASE STORAGE SETUP FOR SHOWCASE
    -- ============================================
    -- Run this SQL in your Supabase SQL Editor

    -- 1. Create 'showcase-media' bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('showcase-media', 'showcase-media', true)
    ON CONFLICT (id) DO NOTHING;

    -- 2. Policies for 'showcase-media' bucket

    -- Allow public read access
    CREATE POLICY "Public Read Access for Showcase Media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'showcase-media');

    -- Allow authenticated users to upload
    CREATE POLICY "Authenticated Insert for Showcase Media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'showcase-media' AND auth.role() = 'authenticated');

    -- Allow authenticated users to update
    CREATE POLICY "Authenticated Update for Showcase Media"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'showcase-media' AND auth.role() = 'authenticated');

    -- Allow authenticated users to delete
    CREATE POLICY "Authenticated Delete for Showcase Media"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'showcase-media' AND auth.role() = 'authenticated');
