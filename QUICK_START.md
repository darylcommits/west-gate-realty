# Quick Start Guide - Residential Properties with Supabase

Follow these steps in order to get your residential properties system working:

## ✅ Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign up/Sign in with GitHub, Google, or Email
4. Create a new project:
   - **Name**: West Gate Realty (or your choice)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is fine
5. Click "Create new project"
6. **Wait 2-3 minutes** for the project to be ready

## ✅ Step 2: Get Your API Credentials

1. In your Supabase dashboard, click the **Settings** gear icon (bottom left)
2. Click **API** in the settings menu
3. You'll see two important values:
   - **Project URL** - Example: `https://abcdefghijk.supabase.co`
   - **anon public** key - A long string starting with `eyJ...`
4. Keep this page open, you'll need these values next

## ✅ Step 3: Configure Environment Variables

1. Open the `.env` file in your `west-gate-realty` folder
2. Replace the placeholder values:
   ```env
   REACT_APP_SUPABASE_URL=https://your-actual-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...your-actual-key-here
   ```
3. **Save the file**
4. **Important**: If your dev server is running, stop it (Ctrl+C) and restart it

## ✅ Step 4: Create the Database Table

**IMPORTANT:** Since the admin uses hardcoded login (not Supabase Auth), we use simplified policies that allow all operations.

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy and paste this SQL:

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

-- Create indexes
CREATE INDEX idx_residential_properties_status ON residential_properties(status);
CREATE INDEX idx_residential_properties_created_at ON residential_properties(created_at DESC);

-- Enable Row Level Security
ALTER TABLE residential_properties ENABLE ROW LEVEL SECURITY;

-- Allow public to read properties
CREATE POLICY "Public can view properties" ON residential_properties
  FOR SELECT USING (true);

-- Allow all modifications (since we use client-side auth)
CREATE POLICY "Allow all modifications" ON residential_properties
  FOR ALL USING (true);
```

4. Click **Run** (or press F5)
5. You should see "Success. No rows returned"

## ✅ Step 5: Create Storage Bucket

1. In Supabase dashboard, click **Storage** (left sidebar)
2. Click **New bucket**
3. Enter bucket name: `property-images`
4. **Important**: Toggle ON "Public bucket"
5. Click **Create bucket**

## ✅ Step 6: Set Storage Policies

1. Click on the `property-images` bucket you just created
2. Click **Policies** tab
3. Click **New policy**
4. Click **For full customization** at the bottom
5. Or go back to **SQL Editor** and run this:

```sql
-- Allow public to view images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Allow uploads/modifications (client-side auth protection)
CREATE POLICY "Allow image uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Allow image updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'property-images');

CREATE POLICY "Allow image deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images');
```

## ✅ Step 7: Login to Admin Panel

The admin panel uses **hardcoded credentials** (not Supabase Auth):

**Admin Login:**
- **Email:** `admin@westgaterealty.com`
- **Password:** `admin123`

> 📝 **Note:** These credentials are set in the code. See [ADMIN_CREDENTIALS.md](ADMIN_CREDENTIALS.md) for how to change them.

## ✅ Step 8: Test the System

1. **Restart your React dev server**:
   ```bash
   # Stop if running (Ctrl+C)
   npm start
   ```

2. Navigate to `http://localhost:3000/admin`

3. **Login with the credentials above**

4. Click **Residential Properties** in the sidebar

4. Click **Add Property** button

5. Fill in the form and upload an image

6. Click **Add Property**

7. Check if it appears in the list!

8. Go to home page and check the carousel

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] .env file updated with real credentials
- [ ] Database table created (residential_properties)
- [ ] Database policies applied (allow all operations)
- [ ] Storage bucket created (property-images)
- [ ] Storage policies applied
- [ ] Dev server restarted
- [ ] Can login to /admin with credentials
- [ ] Can access /admin/residential-properties
- [ ] Can add a property successfully
- [ ] Property shows in the carousel on homepage

## 🔐 Admin Credentials

**Email:** `admin@westgaterealty.com`
**Password:** `admin123`

To change these, see [ADMIN_CREDENTIALS.md](ADMIN_CREDENTIALS.md)

## ❌ Troubleshooting

### "Error loading properties"
- Check if .env has real Supabase credentials (not placeholder values)
- Restart your dev server after changing .env
- Check browser console for specific errors

### "Insert failed" or "Permission denied"
- Make sure RLS policies are created
- Try the simplified policy: `FOR ALL USING (true)` temporarily

### Images not uploading
- Ensure bucket name is exactly `property-images`
- Make sure bucket is set to **Public**
- Check storage policies are applied

### Table doesn't exist
- Run the CREATE TABLE SQL again
- Check for typos in table name (should be `residential_properties`)

## 📚 Need More Help?

See the full documentation in [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
