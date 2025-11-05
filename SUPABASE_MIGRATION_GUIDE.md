# 🚀 Supabase Migration Guide

Complete guide to migrate from local SQLite to Supabase for Vercel deployment.

## ✅ Checklist

- [ ] Step 1: Create Supabase Project
- [ ] Step 2: Run SQL Schema
- [ ] Step 3: Create Storage Buckets
- [ ] Step 4: Configure Environment Variables
- [ ] Step 5: Test Local Server with Supabase
- [ ] Step 6: Deploy to Vercel

---

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or login
3. Click **"New Project"**
4. Fill in:
   - **Name**: `westgate-realty`
   - **Database Password**: (SAVE THIS!)
   - **Region**: Choose closest to Philippines (Singapore recommended)
5. Click **"Create new project"** (~2 minutes to complete)

---

## Step 2: Run SQL Schema

1. In your Supabase Dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open file: `server/supabase-schema.sql`
4. Copy ALL contents and paste into SQL Editor
5. Click **"Run"** button (bottom right)
6. You should see: ✅ **"Success. No rows returned"**

This creates:
- ✅ 3 tables (carousel_properties, featured_projects, neighborhoods)
- ✅ Indexes for performance
- ✅ Triggers for auto-updating timestamps
- ✅ Row Level Security policies
- ✅ Seed data (sample properties)
- ✅ Helper functions

---

## Step 3: Create Storage Buckets

### Bucket 1: property-images
1. In Supabase Dashboard, click **"Storage"** (left sidebar)
2. Click **"Create a new bucket"**
3. Settings:
   - **Name**: `property-images`
   - **Public bucket**: ✅ **CHECK THIS BOX**
   - **File size limit**: 10 MB
   - **Allowed MIME types**: Leave empty (allows all images)
4. Click **"Create bucket"**

### Bucket 2: property-videos
1. Click **"Create a new bucket"** again
2. Settings:
   - **Name**: `property-videos`
   - **Public bucket**: ✅ **CHECK THIS BOX**
   - **File size limit**: 50 MB
   - **Allowed MIME types**: Leave empty
3. Click **"Create bucket"**

---

## Step 4: Configure Environment Variables

### Get Supabase Credentials
1. In Supabase Dashboard, click **⚙️ Settings** (bottom left)
2. Click **"API"**
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Update .env File
1. Open: `server/.env`
2. Replace with your actual values:

```env
# Supabase Configuration
SUPABASE_URL=https://your-actual-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
```

3. **SAVE THE FILE**

---

## Step 5: Test Local Server with Supabase

### Kill Old Server
If your old SQLite server is still running:
1. Press `CTRL + C` in the terminal running the server
2. Or close that terminal window

### Start New Supabase Server
Open terminal in the `server` folder and run:

```bash
npm run start:supabase
```

You should see:
```
✅ Successfully connected to Supabase!
🚀 Server running on http://localhost:5000
📡 Connected to Supabase

API Endpoints:
  - GET    /api/carousel-properties
  ...
```

### Test in Browser
Open: [http://localhost:5000/api/carousel-properties](http://localhost:5000/api/carousel-properties)

You should see JSON data with 3 seed properties!

### Test Admin Panel
1. Go to your React app (usually [http://localhost:5173](http://localhost:5173))
2. Login to admin panel
3. Go to **Carousel Properties**
4. Try uploading a new property with:
   - Background image
   - Video (optional)
   - Detail images (optional)
5. Check that it appears in the list!

---

## Step 6: Deploy to Vercel

### Update Frontend API URL
Before deploying, you need to update the frontend to use environment variables:

1. Create `west-gate-realty/.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

2. Create `west-gate-realty/.env.production` file:
```env
VITE_API_BASE_URL=https://your-backend-url.vercel.app/api
```

3. Update admin files to use environment variable:

**Example**: In `CarouselManagement.tsx`, change:
```typescript
// OLD:
const API_BASE_URL = 'http://localhost:5000/api';

// NEW:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

### Deploy Backend to Vercel

1. Create `server/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server-supabase.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server-supabase.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

2. Push code to GitHub repository

3. Go to [https://vercel.com](https://vercel.com)

4. Click **"New Project"**

5. Import your GitHub repository

6. Configure:
   - **Root Directory**: `server`
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

7. **Add Environment Variables**:
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key

8. Click **"Deploy"**

9. Copy your backend URL (looks like: `https://your-backend.vercel.app`)

### Deploy Frontend to Vercel

1. Update `.env.production` with your backend URL

2. Go to Vercel dashboard

3. Click **"New Project"**

4. Import your GitHub repository again

5. Configure:
   - **Root Directory**: `west-gate-realty`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **Add Environment Variables**:
   - `VITE_API_BASE_URL`: Your backend Vercel URL + `/api`
     Example: `https://your-backend.vercel.app/api`

7. Click **"Deploy"**

---

## 🎉 Done!

Your application is now:
- ✅ Using Supabase for database
- ✅ Using Supabase Storage for files
- ✅ Deployed to Vercel
- ✅ Files persist across deployments
- ✅ Scalable and production-ready!

---

## 📊 Comparison: Before vs After

| Feature | Before (SQLite + Local Files) | After (Supabase) |
|---------|-------------------------------|------------------|
| Database | SQLite (local file) | PostgreSQL (cloud) |
| File Storage | Local `/uploads` folder | Supabase Storage (cloud) |
| Vercel Compatible | ❌ No | ✅ Yes |
| Files Persist | ❌ No | ✅ Yes |
| Scalability | Limited | Unlimited |
| Automatic Backups | ❌ No | ✅ Yes |
| CDN for Files | ❌ No | ✅ Yes |

---

## 🆘 Troubleshooting

### Error: "Missing Supabase credentials"
- Check that `.env` file exists
- Check that SUPABASE_URL and SUPABASE_ANON_KEY are set
- No quotes needed around values

### Error: "relation does not exist"
- Run the SQL schema again in Supabase SQL Editor
- Make sure you ran ALL the SQL code

### Error: "Failed to upload"
- Check that storage buckets are created
- Check that buckets are marked as **PUBLIC**
- Check bucket names match: `property-images` and `property-videos`

### Images not showing
- Check Storage buckets are PUBLIC
- Check image URLs in database start with `https://`
- Check CORS settings in Supabase

---

## 📞 Need Help?

1. Check Supabase logs: Dashboard → Logs → API
2. Check browser console for errors (F12)
3. Check server logs in terminal
4. Verify .env file is properly configured

---

## 🔄 Switching Between SQLite and Supabase

You can keep both servers:

**Use SQLite (local):**
```bash
npm start
```

**Use Supabase (cloud):**
```bash
npm run start:supabase
```

This way you can develop locally with SQLite and deploy with Supabase!
