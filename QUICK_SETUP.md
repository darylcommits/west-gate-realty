# 🚀 Quick Setup Guide

## ✅ What I Just Did
- Created `.env` file with Supabase configuration template
- Created setup script for easy configuration

## 📋 Your Next Steps (5 minutes)

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Click "New Project"
- Choose organization and enter project name
- Set database password
- Click "Create new project"
- Wait 2-3 minutes for setup

### 2. Get Your Credentials
- In Supabase dashboard → **Settings** → **API**
- Copy **Project URL** (looks like: `https://abcdefgh.supabase.co`)
- Copy **anon public** key (long string starting with `eyJ...`)

### 3. Update .env File
Edit the `.env` file I created and replace:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```
With your actual values:
```env
REACT_APP_SUPABASE_URL=https://abcdefgh.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Set Up Database
- In Supabase dashboard → **SQL Editor**
- Click "New Query"
- Copy ALL content from `src/lib/database.sql`
- Paste and click "Run"
- You should see "Success" message

### 5. Test It!
```bash
npm start
```
- Go to `http://localhost:3000/admin`
- Login: `admin@westgaterealty.com` / `admin123`
- You should now see the dashboard with data!

## 🎉 What You'll Get

Once configured, your admin panel will show:
- ✅ Dashboard with statistics
- ✅ Property management (CRUD)
- ✅ Services management
- ✅ Certifications management
- ✅ Neighborhoods management
- ✅ Property types management
- ✅ Portfolio management
- ✅ Featured projects management
- ✅ Company profile management
- ✅ Website settings management

## 🆘 Need Help?

**Common Issues:**
- **"Failed to fetch"**: Check your Supabase URL/key in .env
- **Empty dashboard**: Make sure you ran the SQL script
- **Login not working**: Use exact credentials above

**Files Created:**
- `.env` - Supabase configuration
- `setup-supabase.js` - Setup helper script
- `QUICK_SETUP.md` - This guide

The admin panel is fully functional - just needs Supabase connection! 🚀
