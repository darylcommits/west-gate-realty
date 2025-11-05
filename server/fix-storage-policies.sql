-- =============================================
-- FIX STORAGE BUCKET POLICIES
-- =============================================
-- This creates permissive policies for Storage buckets
-- Run this in Supabase Dashboard > SQL Editor

-- First, check if policies exist and drop them
-- For property-images bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to property images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to property images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to property videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to property videos" ON storage.objects;

-- Create permissive policies for property-images bucket
CREATE POLICY "Allow all operations on property-images"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'property-images')
WITH CHECK (bucket_id = 'property-images');

-- Create permissive policies for property-videos bucket
CREATE POLICY "Allow all operations on property-videos"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'property-videos')
WITH CHECK (bucket_id = 'property-videos');

-- Verify the policies were created
SELECT * FROM pg_policies WHERE tablename = 'objects';
