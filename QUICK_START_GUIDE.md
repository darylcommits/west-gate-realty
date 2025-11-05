# Quick Start Guide - West Gate Realty Local Database System

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js installed (v14 or higher)
- npm installed
- Both terminals ready

---

## Step 1: Start the Backend (Terminal 1)

```bash
cd "C:\Users\MSI THIN\OneDrive\Documents\WestGate\server"
npm install
npm start
```

✅ **Success**: You should see "Server running on http://localhost:5000"

---

## Step 2: Start the Frontend (Terminal 2)

```bash
cd "C:\Users\MSI THIN\OneDrive\Documents\WestGate\west-gate-realty"
npm start
```

✅ **Success**: Browser opens at http://localhost:3000

---

## Step 3: Access Admin Panel

1. Go to: **http://localhost:3000/admin**
2. Login with your admin credentials
3. Navigate to manage content:
   - **Carousel Properties**: `/admin/carousel-properties`
   - **Featured Projects**: `/admin/featured-projects-local`
   - **Neighborhoods**: `/admin/neighborhoods-local`

---

## Quick Test

### Test 1: View Homepage Content
- Go to http://localhost:3000
- Verify carousel shows properties
- Scroll to see featured projects
- Check neighborhoods section

### Test 2: Add New Property
1. Go to http://localhost:3000/admin/carousel-properties
2. Click "Add New Property"
3. Fill form and upload image
4. Submit
5. Go back to homepage - see your new property!

---

## Important URLs

| What | URL |
|------|-----|
| Homepage | http://localhost:3000 |
| Admin Login | http://localhost:3000/admin |
| Carousel Admin | http://localhost:3000/admin/carousel-properties |
| Projects Admin | http://localhost:3000/admin/featured-projects-local |
| Neighborhoods Admin | http://localhost:3000/admin/neighborhoods-local |
| Backend API | http://localhost:5000/api |

---

## Common Commands

### Backend Commands
```bash
# Start server
npm start

# Start with auto-reload (if nodemon installed)
npm run dev
```

### Frontend Commands
```bash
# Start React app
npm start

# Build for production
npm run build
```

---

## Troubleshooting Quick Fixes

### Backend won't start
```bash
cd server
npm install
npm start
```

### Frontend shows "Failed to fetch"
1. Make sure backend is running (check Terminal 1)
2. Backend should be on http://localhost:5000

### Can't upload images
- Check file is an image (jpg, png, gif)
- Max size: 10MB

---

## Need More Help?

Read the full documentation: `LOCAL_DATABASE_SETUP_README.md`

---

**Happy Managing! 🎉**
