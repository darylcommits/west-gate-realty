-- =============================================
-- WEST GATE REALTY - SUPABASE DATABASE SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CAROUSEL PROPERTIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS carousel_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  type_color TEXT NOT NULL,
  background_image TEXT NOT NULL,
  price TEXT NOT NULL,
  size TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT NOT NULL,
  video_url TEXT,
  detail_images JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_carousel_active_order ON carousel_properties(is_active, order_index);

-- =============================================
-- FEATURED PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS featured_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  bg_gradient TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  type TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_projects_featured_order ON featured_projects(is_featured, order_index);

-- =============================================
-- NEIGHBORHOODS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT NOT NULL,
  location TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_popular BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_neighborhoods_popular_order ON neighborhoods(is_popular, order_index);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to carousel_properties
CREATE TRIGGER update_carousel_properties_updated_at
BEFORE UPDATE ON carousel_properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to featured_projects
CREATE TRIGGER update_featured_projects_updated_at
BEFORE UPDATE ON featured_projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to neighborhoods
CREATE TRIGGER update_neighborhoods_updated_at
BEFORE UPDATE ON neighborhoods
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SEED DATA
-- =============================================

-- Seed Carousel Properties
INSERT INTO carousel_properties (title, location, type, type_color, background_image, price, size, features, description, order_index)
VALUES
  (
    'Prime Agricultural Land',
    'Ilocos Norte',
    'Agricultural',
    '#10b981',
    '/assets/images/agri-land.jpg',
    '₱5,000,000',
    '2 Hectares',
    '["Fertile soil", "Irrigation access", "Road access"]'::jsonb,
    'Prime agricultural land perfect for farming or investment',
    1
  ),
  (
    'Solar Development Projects',
    'Ilocos Sur',
    'Commercial',
    '#f59e0b',
    '/assets/images/solar-project.jpg',
    '₱15,000,000',
    '5 Hectares',
    '["High solar exposure", "Grid connection", "Development ready"]'::jsonb,
    'Ideal location for solar energy development',
    2
  ),
  (
    'Narvacan Coastal Properties',
    'Narvacan, Ilocos Sur',
    'Coastal',
    '#3b82f6',
    '/assets/images/coastal.jpg',
    '₱8,000,000',
    '1.5 Hectares',
    '["Beach access", "Tourism potential", "Clear title"]'::jsonb,
    'Beautiful coastal property with tourism potential',
    3
  );

-- Seed Featured Projects
INSERT INTO featured_projects (title, description, image, bg_gradient, features, stats, type, order_index)
VALUES
  (
    'San Ildefonso Agricultural Lands',
    'Prime agricultural land with excellent soil quality and irrigation access',
    '/assets/images/san-ildefonso.jpg',
    'from-green-400 to-emerald-600',
    '["2.5 hectares", "Irrigation ready", "Road access", "Clear title"]'::jsonb,
    '{"Size": "2.5 hectares", "Location": "San Ildefonso", "Type": "Agricultural"}'::jsonb,
    'agricultural',
    1
  ),
  (
    'Solar Farm Developments',
    'Strategic locations for renewable energy projects across Ilocos',
    '/assets/images/solar-project.jpg',
    'from-amber-400 to-orange-600',
    '["High sun exposure", "Grid connectivity", "Government support", "ROI potential"]'::jsonb,
    '{"Capacity": "5MW", "Location": "Ilocos Sur", "Status": "Planning"}'::jsonb,
    'commercial',
    2
  ),
  (
    'Sinait Heritage Properties',
    'Historic properties in culturally significant locations',
    '/assets/images/heritage.jpg',
    'from-purple-400 to-indigo-600',
    '["Cultural value", "Tourism potential", "Restoration ready", "Prime location"]'::jsonb,
    '{"Area": "500 sqm", "Location": "Sinait", "Type": "Heritage"}'::jsonb,
    'heritage',
    3
  );

-- Seed Neighborhoods
INSERT INTO neighborhoods (name, description, highlights, image, location, order_index)
VALUES
  (
    'Sinait Heritage District',
    'Historic town center with Spanish colonial architecture and cultural landmarks',
    '["UNESCO heritage site proximity", "Traditional markets", "Cultural festivals year-round", "Well-preserved colonial structures"]'::jsonb,
    '/assets/images/heritage.jpg',
    'Sinait, Ilocos Sur',
    1
  ),
  (
    'Narvacan Coastal Area',
    'Pristine coastline perfect for resort development and eco-tourism ventures',
    '["White sand beaches", "Crystal clear waters", "Water sports facilities", "Sunset viewing spots"]'::jsonb,
    '/assets/images/coastal.jpg',
    'Narvacan, Ilocos Sur',
    2
  ),
  (
    'San Ildefonso Agricultural Lands',
    'Fertile farmlands with modern irrigation systems and excellent yields',
    '["Rich, fertile soil", "Modern irrigation", "Farming community", "Agricultural support services"]'::jsonb,
    '/assets/images/san-ildefonso.jpg',
    'San Ildefonso, Ilocos Sur',
    3
  );

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE carousel_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view)
CREATE POLICY "Public can view carousel properties"
  ON carousel_properties FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view featured projects"
  ON featured_projects FOR SELECT
  USING (is_featured = true);

CREATE POLICY "Public can view neighborhoods"
  ON neighborhoods FOR SELECT
  USING (is_popular = true);

-- Admin full access (you'll need to authenticate admin users)
-- For now, allow all operations (you can restrict this later with auth)
CREATE POLICY "Allow all operations on carousel properties"
  ON carousel_properties FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on featured projects"
  ON featured_projects FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on neighborhoods"
  ON neighborhoods FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Note: Storage buckets need to be created via Supabase Dashboard or via the management API
-- After running this SQL, you need to:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a bucket named "property-images" (public)
-- 3. Create a bucket named "property-videos" (public)
-- 4. Set upload limits: images (10MB), videos (50MB)

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'carouselProperties', (SELECT COUNT(*) FROM carousel_properties WHERE is_active = true),
    'featuredProjects', (SELECT COUNT(*) FROM featured_projects WHERE is_featured = true),
    'neighborhoods', (SELECT COUNT(*) FROM neighborhoods WHERE is_popular = true)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
