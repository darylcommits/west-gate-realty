-- =============================================
-- FIX RLS POLICIES - Allow All Operations for Development
-- =============================================
-- This removes restrictive RLS policies and allows all operations
-- Use this for development/testing. Restrict later for production.

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view carousel properties" ON carousel_properties;
DROP POLICY IF EXISTS "Allow all operations on carousel properties" ON carousel_properties;
DROP POLICY IF EXISTS "Public can view featured projects" ON featured_projects;
DROP POLICY IF EXISTS "Allow all operations on featured projects" ON featured_projects;
DROP POLICY IF EXISTS "Public can view neighborhoods" ON neighborhoods;
DROP POLICY IF EXISTS "Allow all operations on neighborhoods" ON neighborhoods;

-- Create permissive policies that allow everything for now
-- Carousel Properties
CREATE POLICY "Allow all for carousel properties"
  ON carousel_properties
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Featured Projects
CREATE POLICY "Allow all for featured projects"
  ON featured_projects
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Neighborhoods
CREATE POLICY "Allow all for neighborhoods"
  ON neighborhoods
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Alternatively, if you want to completely disable RLS for testing:
-- Uncomment these lines to disable RLS entirely:

-- ALTER TABLE carousel_properties DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE featured_projects DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE neighborhoods DISABLE ROW LEVEL SECURITY;
