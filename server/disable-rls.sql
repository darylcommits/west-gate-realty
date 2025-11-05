-- =============================================
-- DISABLE RLS COMPLETELY FOR DEVELOPMENT
-- =============================================
-- This completely disables Row Level Security
-- Perfect for development and testing

ALTER TABLE carousel_properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE featured_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods DISABLE ROW LEVEL SECURITY;

-- Verify it worked
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('carousel_properties', 'featured_projects', 'neighborhoods');
