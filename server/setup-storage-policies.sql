-- =====================================================
-- Supabase Storage Setup for West Gate Realty
-- =====================================================
-- This script creates storage buckets and policies for carousel properties
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. CREATE STORAGE BUCKETS
-- =====================================================

-- Create carousel-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('carousel-images', 'carousel-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create carousel-videos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('carousel-videos', 'carousel-videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create carousel-detail-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('carousel-detail-images', 'carousel-detail-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- =====================================================
-- 2. DROP EXISTING POLICIES (if any)
-- =====================================================

DROP POLICY IF EXISTS "Allow public uploads to carousel-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from carousel-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to carousel-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from carousel-images" ON storage.objects;

DROP POLICY IF EXISTS "Allow public uploads to carousel-videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from carousel-videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to carousel-videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from carousel-videos" ON storage.objects;

DROP POLICY IF EXISTS "Allow public uploads to carousel-detail-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from carousel-detail-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to carousel-detail-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from carousel-detail-images" ON storage.objects;

-- =====================================================
-- 3. CREATE STORAGE POLICIES FOR carousel-images
-- =====================================================

-- Allow anyone to upload to carousel-images bucket
CREATE POLICY "Allow public uploads to carousel-images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'carousel-images');

-- Allow anyone to read from carousel-images bucket
CREATE POLICY "Allow public reads from carousel-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'carousel-images');

-- Allow anyone to update files in carousel-images bucket
CREATE POLICY "Allow public updates to carousel-images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'carousel-images')
WITH CHECK (bucket_id = 'carousel-images');

-- Allow anyone to delete from carousel-images bucket
CREATE POLICY "Allow public deletes from carousel-images"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'carousel-images');

-- =====================================================
-- 4. CREATE STORAGE POLICIES FOR carousel-videos
-- =====================================================

-- Allow anyone to upload to carousel-videos bucket
CREATE POLICY "Allow public uploads to carousel-videos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'carousel-videos');

-- Allow anyone to read from carousel-videos bucket
CREATE POLICY "Allow public reads from carousel-videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'carousel-videos');

-- Allow anyone to update files in carousel-videos bucket
CREATE POLICY "Allow public updates to carousel-videos"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'carousel-videos')
WITH CHECK (bucket_id = 'carousel-videos');

-- Allow anyone to delete from carousel-videos bucket
CREATE POLICY "Allow public deletes from carousel-videos"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'carousel-videos');

-- =====================================================
-- 5. CREATE STORAGE POLICIES FOR carousel-detail-images
-- =====================================================

-- Allow anyone to upload to carousel-detail-images bucket
CREATE POLICY "Allow public uploads to carousel-detail-images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'carousel-detail-images');

-- Allow anyone to read from carousel-detail-images bucket
CREATE POLICY "Allow public reads from carousel-detail-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'carousel-detail-images');

-- Allow anyone to update files in carousel-detail-images bucket
CREATE POLICY "Allow public updates to carousel-detail-images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'carousel-detail-images')
WITH CHECK (bucket_id = 'carousel-detail-images');

-- Allow anyone to delete from carousel-detail-images bucket
CREATE POLICY "Allow public deletes from carousel-detail-images"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'carousel-detail-images');

-- =====================================================
-- 6. VERIFY SETUP
-- =====================================================

-- Check if buckets were created successfully
SELECT id, name, public, created_at
FROM storage.buckets
WHERE name IN ('carousel-images', 'carousel-videos', 'carousel-detail-images');

-- Check if policies were created successfully
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%carousel%'
ORDER BY policyname;
