-- =============================================
-- FIX STORAGE BUCKET RLS POLICIES
-- =============================================
-- Run this in Supabase Dashboard > SQL Editor
-- This allows uploads to your public storage buckets

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Allow all operations on property-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on property-videos" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;

-- Create policies for property-images bucket
-- Allow anyone to upload
CREATE POLICY "Allow uploads to property-images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'property-images');

-- Allow anyone to update
CREATE POLICY "Allow updates to property-images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'property-images')
WITH CHECK (bucket_id = 'property-images');

-- Allow anyone to read
CREATE POLICY "Allow reads from property-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Allow anyone to delete
CREATE POLICY "Allow deletes from property-images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'property-images');

-- Create policies for property-videos bucket
-- Allow anyone to upload
CREATE POLICY "Allow uploads to property-videos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'property-videos');

-- Allow anyone to update
CREATE POLICY "Allow updates to property-videos"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'property-videos')
WITH CHECK (bucket_id = 'property-videos');

-- Allow anyone to read
CREATE POLICY "Allow reads from property-videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-videos');

-- Allow anyone to delete
CREATE POLICY "Allow deletes from property-videos"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'property-videos');

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;
