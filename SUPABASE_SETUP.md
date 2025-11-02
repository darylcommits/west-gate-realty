# Supabase Setup Guide for West Gate Realty

This guide will help you set up Supabase database and storage for the West Gate Realty application.

## Prerequisites

1. Create a free Supabase account at https://supabase.com
2. Create a new project in Supabase

## Step 1: Configure Environment Variables

Create a `.env` file in the root of your project (west-gate-realty folder):

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

**To find these values:**
1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon)
3. Click on "API"
4. Copy the "Project URL" and "anon/public" key

## Step 2: Create Database Tables

### Create Residential Properties Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create residential_properties table
CREATE TABLE residential_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area TEXT NOT NULL,
  type TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC,
  status TEXT CHECK (status IN ('Available', 'Sold', 'Pending')) DEFAULT 'Available',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_residential_properties_status ON residential_properties(status);
CREATE INDEX idx_residential_properties_created_at ON residential_properties(created_at DESC);
CREATE INDEX idx_residential_properties_is_featured ON residential_properties(is_featured);

-- Enable Row Level Security (RLS)
ALTER TABLE residential_properties ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access" ON residential_properties
  FOR SELECT USING (true);

-- Create policies to allow authenticated insert/update/delete
CREATE POLICY "Allow authenticated insert" ON residential_properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON residential_properties
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON residential_properties
  FOR DELETE USING (auth.role() = 'authenticated');
```

## Step 3: Create Storage Bucket

### Create the property-images bucket

1. In your Supabase dashboard, go to "Storage"
2. Click "New bucket"
3. Name it: `property-images`
4. Make it **public** (check "Public bucket")
5. Click "Create bucket"

### Set Storage Policies

Run this SQL to allow uploads:

```sql
-- Allow public read access to property images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images'
  AND auth.role() = 'authenticated'
);
```

## Step 4: (Optional) Insert Sample Data

```sql
-- Insert sample residential properties
INSERT INTO residential_properties (
  title,
  location,
  bedrooms,
  bathrooms,
  area,
  type,
  features,
  image,
  description,
  price,
  status,
  is_featured
) VALUES
(
  'Modern Family Home',
  'Vigan City, Ilocos Sur',
  4,
  3,
  '250 sqm',
  'Single Family House',
  ARRAY['2-Car Garage', 'Garden', 'Modern Kitchen', 'Balcony'],
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'Beautiful modern family home with contemporary design and premium finishes.',
  2500000,
  'Available',
  true
),
(
  'Traditional Filipino Villa',
  'Bantay, Ilocos Sur',
  5,
  4,
  '350 sqm',
  'Villa',
  ARRAY['Swimming Pool', 'Landscaped Garden', 'Traditional Design', 'Spacious Living'],
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'Elegant traditional Filipino villa combining classic architecture with modern amenities.',
  3800000,
  'Available',
  true
),
(
  'Beachfront Bungalow',
  'Candon City, Ilocos Sur',
  3,
  2,
  '180 sqm',
  'Bungalow',
  ARRAY['Ocean View', 'Private Beach Access', 'Outdoor Deck', 'Sea Breeze'],
  'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800',
  'Stunning beachfront property with panoramic ocean views and direct beach access.',
  2200000,
  'Available',
  false
);
```

## Step 5: Testing

1. Start your React app: `npm start`
2. Navigate to `/admin` and login
3. Click on "Residential Properties" in the sidebar
4. Try adding a new property with an image
5. Check if the property appears in the residential carousel on the homepage

## Troubleshooting

### Images not uploading?
- Make sure the `property-images` bucket is created and set to **public**
- Check that storage policies are correctly applied
- Verify your Supabase URL and anon key in `.env`

### Properties not showing?
- Check browser console for errors
- Verify the table name is exactly `residential_properties`
- Make sure RLS policies allow public SELECT queries

### Authentication issues?
- For admin access, you may need to set up Supabase Auth
- Or temporarily disable RLS for testing (not recommended for production)

## Security Notes

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- For production, consider implementing proper authentication
- Review and tighten RLS policies based on your security requirements

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
