-- =============================================
-- COMPLETE RLS FIX FOR DEVELOPMENT
-- =============================================
-- This fixes BOTH database tables AND storage buckets
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- 1. DISABLE RLS ON DATABASE TABLES
-- =============================================
ALTER TABLE carousel_properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE featured_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods DISABLE ROW LEVEL SECURITY;

-- 2. FIX STORAGE BUCKET POLICIES
-- =============================================
-- Drop any existing restrictive policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to property images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to property images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to property videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to property videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on property-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on property-videos" ON storage.objects;

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

-- 3. VERIFY IT WORKED
-- =============================================
-- Check database tables RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('carousel_properties', 'featured_projects', 'neighborhoods');

-- Check storage policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;
