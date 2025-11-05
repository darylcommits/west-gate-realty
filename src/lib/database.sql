-- West Gate Realty Database Schema
-- Run this SQL in your Supabase SQL editor

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    price DECIMAL(12,2),
    location TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('Agricultural', 'Solar Projects', 'Commercial', 'Residential', 'Industrial')),
    size TEXT,
    features TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Sold', 'Pending', 'Under Construction')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    verification_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    location TEXT NOT NULL,
    average_price DECIMAL(12,2),
    amenities TEXT[] DEFAULT '{}',
    is_popular BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_types table
CREATE TABLE IF NOT EXISTS property_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    completion_date DATE,
    is_premium BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create featured_projects table
CREATE TABLE IF NOT EXISTS featured_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    project_type TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'Under Construction', 'Completed')),
    start_date DATE,
    completion_date DATE,
    is_featured BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    description TEXT NOT NULL,
    logo TEXT NOT NULL,
    contact_info JSONB NOT NULL,
    social_media JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_title TEXT NOT NULL,
    site_description TEXT NOT NULL,
    site_logo TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    social_media JSONB DEFAULT '{}',
    seo_settings JSONB DEFAULT '{}',
    theme_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_neighborhoods_updated_at BEFORE UPDATE ON neighborhoods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_property_types_updated_at BEFORE UPDATE ON property_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_featured_projects_updated_at BEFORE UPDATE ON featured_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO settings (
    site_title,
    site_description,
    site_logo,
    contact_email,
    contact_phone,
    address,
    theme_settings
) VALUES (
    'West Gate Realty',
    'Premier real estate solutions in Ilocos Region',
    '/assets/images/logo.svg',
    'info@westgaterealty.com',
    '+63 123 456 7890',
    'Ilocos Region, Philippines',
    '{"primary_color": "#1e40af", "secondary_color": "#f59e0b", "accent_color": "#10b981"}'
) ON CONFLICT DO NOTHING;

-- Insert default property types
INSERT INTO property_types (name, description, icon, features, order_index) VALUES
('Agricultural', 'Fertile farming properties with excellent irrigation systems', '🌾', ARRAY['Prime farming locations', 'Water access', 'Rich soil quality', 'Government support'], 1),
('Solar Projects', 'Cutting-edge renewable energy projects', '☀️', ARRAY['High energy yield', 'Government incentives', 'Long-term ROI', 'Environmental impact'], 2),
('Commercial', 'Strategic commercial real estate opportunities', '🏢', ARRAY['Prime locations', 'High foot traffic', 'Modern facilities', 'Investment potential'], 3),
('Residential', 'Beautiful homes and residential developments', '🏠', ARRAY['Modern amenities', 'Safe neighborhoods', 'Quality construction', 'Family-friendly'], 4),
('Industrial', 'Industrial properties for manufacturing and logistics', '🏭', ARRAY['Strategic locations', 'Infrastructure access', 'Zoning compliance', 'Growth potential'], 5)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS) - Uncomment and configure as needed
-- ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE services ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE featured_projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (uncomment and configure as needed)
-- CREATE POLICY "Enable read access for all users" ON properties FOR SELECT USING (true);
-- CREATE POLICY "Enable insert for authenticated users only" ON properties FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Enable update for authenticated users only" ON properties FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Enable delete for authenticated users only" ON properties FOR DELETE USING (auth.role() = 'authenticated');
