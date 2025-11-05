# West Gate Realty - Local Database Admin System

## Overview

This system provides a complete local database solution for managing West Gate Realty's website content, including:
- **Carousel Properties** - Hero carousel properties shown on the homepage
- **Featured Projects** - Featured properties and projects showcase
- **Popular Neighborhoods** - Highlighted neighborhood listings

The system uses:
- **Backend**: Node.js + Express + SQLite (file-based database)
- **Frontend**: React + TypeScript
- **Image Upload**: Multer for handling file uploads

## Directory Structure

```
WestGate/
├── server/                          # Backend server
│   ├── server.js                    # Express server with API endpoints
│   ├── database.js                  # SQLite database setup & seeding
│   ├── package.json                 # Backend dependencies
│   ├── westgate.db                  # SQLite database file (auto-created)
│   └── uploads/                     # Uploaded images folder (auto-created)
│
└── west-gate-realty/                # React frontend
    └── src/
        ├── components/
        │   ├── SwiperCarousel.tsx              # Updated to fetch from local API
        │   ├── PropertyShowcase.tsx            # Updated to fetch from local API
        │   └── PropertyListings.tsx            # Updated to fetch from local API
        └── pages/admin/
            ├── CarouselManagement.tsx          # Admin panel for carousel
            ├── FeaturedProjectsManagementLocal.tsx   # Admin panel for projects
            └── NeighborhoodsManagementLocal.tsx      # Admin panel for neighborhoods
```

---

## Installation & Setup

### Step 1: Install Backend Dependencies

```bash
cd "C:\Users\MSI THIN\OneDrive\Documents\WestGate\server"
npm install
```

This installs:
- express
- sqlite3
- multer
- cors
- body-parser

### Step 2: Start the Backend Server

```bash
cd "C:\Users\MSI THIN\OneDrive\Documents\WestGate\server"
npm start
```

**Expected Output:**
```
Connected to SQLite database
Carousel properties table ready
Featured projects table ready
Neighborhoods table ready
Seeding initial carousel data...
Seeding initial featured projects data...
Seeding initial neighborhoods data...
Carousel data seeded successfully
Featured projects data seeded successfully
Neighborhoods data seeded successfully
Server running on http://localhost:5000
API Endpoints:
  - GET    /api/carousel-properties
  - POST   /api/carousel-properties
  - PUT    /api/carousel-properties/:id
  - DELETE /api/carousel-properties/:id
  - GET    /api/featured-projects
  - POST   /api/featured-projects
  - PUT    /api/featured-projects/:id
  - DELETE /api/featured-projects/:id
  - GET    /api/neighborhoods
  - POST   /api/neighborhoods
  - PUT    /api/neighborhoods/:id
  - DELETE /api/neighborhoods/:id
  - GET    /api/dashboard/stats
```

### Step 3: Start the React Frontend

Open a new terminal:

```bash
cd "C:\Users\MSI THIN\OneDrive\Documents\WestGate\west-gate-realty"
npm start
```

The React app will open at `http://localhost:3000`

---

## Using the Admin Panel

### Accessing the Admin Panel

1. Navigate to: `http://localhost:3000/admin`
2. Login with your admin credentials
3. You'll see the admin dashboard

### Managing Carousel Properties

**URL**: `http://localhost:3000/admin/carousel-properties`

**Features:**
- ✅ View all carousel properties
- ✅ Add new property with image upload
- ✅ Edit existing properties
- ✅ Delete properties
- ✅ Reorder properties (via order_index)
- ✅ Search/filter properties

**How to Add a New Property:**
1. Click "Add New Property" button
2. Fill in the form:
   - Title (e.g., "Prime Agricultural Land")
   - Location (e.g., "Ilocos Norte")
   - Type (e.g., "Agricultural", "Commercial", "Coastal")
   - Type Color (color picker for badge)
   - Price (e.g., "₱5,000,000")
   - Size (e.g., "2 Hectares")
   - Features (add multiple features with + button)
   - Description (detailed property description)
   - Display Order (number for ordering)
3. Click "Choose File" to upload an image
4. Click "Create Property"

### Managing Featured Projects

**URL**: `http://localhost:3000/admin/featured-projects-local`

**Features:**
- ✅ View all featured projects
- ✅ Add new project with image upload
- ✅ Edit existing projects
- ✅ Delete projects
- ✅ Manage features and stats
- ✅ Choose gradient backgrounds

**How to Add a New Project:**
1. Click "Add New Project"
2. Fill in:
   - Title
   - Description
   - Type (agricultural, commercial, etc.)
   - Background Gradient (choose from dropdown)
   - Features (multiple items)
   - Stats (key-value pairs like "Size: 2.5 hectares")
   - Display Order
3. Upload project image
4. Click "Create Project"

### Managing Neighborhoods

**URL**: `http://localhost:3000/admin/neighborhoods-local`

**Features:**
- ✅ View all neighborhoods
- ✅ Add new neighborhood with image upload
- ✅ Edit existing neighborhoods
- ✅ Delete neighborhoods
- ✅ Manage highlights
- ✅ Search neighborhoods

**How to Add a New Neighborhood:**
1. Click "Add New Neighborhood"
2. Fill in:
   - Neighborhood Name
   - Location
   - Description
   - Highlights (multiple items)
   - Display Order
3. Upload neighborhood image
4. Click "Create Neighborhood"

---

## API Endpoints

### Carousel Properties

```http
GET    /api/carousel-properties       # Get all active properties
GET    /api/carousel-properties/:id   # Get single property
POST   /api/carousel-properties       # Create new property (with image upload)
PUT    /api/carousel-properties/:id   # Update property (with optional image upload)
DELETE /api/carousel-properties/:id   # Delete property
```

### Featured Projects

```http
GET    /api/featured-projects         # Get all featured projects
GET    /api/featured-projects/:id     # Get single project
POST   /api/featured-projects         # Create new project (with image upload)
PUT    /api/featured-projects/:id     # Update project (with optional image upload)
DELETE /api/featured-projects/:id     # Delete project
```

### Neighborhoods

```http
GET    /api/neighborhoods              # Get all popular neighborhoods
GET    /api/neighborhoods/:id          # Get single neighborhood
POST   /api/neighborhoods              # Create new neighborhood (with image upload)
PUT    /api/neighborhoods/:id          # Update neighborhood (with optional image upload)
DELETE /api/neighborhoods/:id          # Delete neighborhood
```

### Dashboard Stats

```http
GET    /api/dashboard/stats            # Get counts of all content types
```

---

## Testing the System

### 1. Test Backend API

Open a web browser or Postman and test:

```
http://localhost:5000/api/carousel-properties
http://localhost:5000/api/featured-projects
http://localhost:5000/api/neighborhoods
http://localhost:5000/api/dashboard/stats
```

You should see JSON data returned with the seeded initial data.

### 2. Test Frontend Data Fetching

1. Go to `http://localhost:3000`
2. Check the homepage - the carousel should show properties from the database
3. Scroll to "Featured Properties & Projects" - should load from database
4. Scroll to "Popular Neighborhoods" - should load from database

**Indicators of Success:**
- Properties/projects/neighborhoods display correctly
- Images load properly
- No console errors in browser DevTools
- Loading spinners appear briefly during data fetch

### 3. Test Admin CRUD Operations

#### Test Create:
1. Go to `http://localhost:3000/admin/carousel-properties`
2. Click "Add New Property"
3. Fill out form and upload an image
4. Submit - should see new property in the list
5. Go back to homepage - new property should appear in carousel

#### Test Update:
1. Click "Edit" on any property
2. Modify some fields
3. Save changes
4. Verify changes appear on admin page and homepage

#### Test Delete:
1. Click "Delete" on a test property
2. Confirm deletion
3. Verify property is removed from both admin page and homepage

#### Test Image Upload:
1. When creating/editing, upload a new image
2. Verify image appears in the admin list
3. Check homepage to ensure image displays correctly
4. Verify image file was saved in `server/uploads/` folder

### 4. Test Search/Filter

1. On any admin management page, use the search box
2. Type part of a property/project/neighborhood name
3. Verify results filter correctly in real-time

---

## Database Schema

### carousel_properties

```sql
CREATE TABLE carousel_properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  type_color TEXT NOT NULL,
  background_image TEXT NOT NULL,
  price TEXT NOT NULL,
  size TEXT NOT NULL,
  features TEXT NOT NULL,              -- JSON array
  description TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### featured_projects

```sql
CREATE TABLE featured_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  bg_gradient TEXT NOT NULL,
  features TEXT NOT NULL,              -- JSON array
  stats TEXT NOT NULL,                 -- JSON object
  type TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### neighborhoods

```sql
CREATE TABLE neighborhoods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT NOT NULL,            -- JSON array
  image TEXT NOT NULL,
  location TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_popular BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Troubleshooting

### Backend won't start

**Error**: `Cannot find module 'express'`
**Solution**: Run `npm install` in the server directory

**Error**: `Port 5000 already in use`
**Solution**:
1. Find and kill the process using port 5000
2. Or change PORT in server.js line 8

### Frontend not connecting to backend

**Error**: `Failed to fetch` in browser console
**Solution**:
1. Verify backend is running on http://localhost:5000
2. Check CORS is enabled in server.js
3. Clear browser cache and reload

### Images not uploading

**Error**: `Multer error` or `File too large`
**Solution**:
1. Check file size (max 10MB)
2. Verify file is an image (jpeg, jpg, png, gif, webp)
3. Check `server/uploads/` folder exists and has write permissions

### Data not showing on frontend

**Solution**:
1. Open browser DevTools → Network tab
2. Reload page and check API requests
3. Verify 200 status codes
4. Check Console tab for JavaScript errors
5. Verify backend is running and responding

### SQLite database file location

The database file `westgate.db` is created in the `server/` directory.

To view/edit the database directly:
1. Download [DB Browser for SQLite](https://sqlitebrowser.org/)
2. Open `server/westgate.db`
3. Browse tables and data

---

## Backup & Restore

### Backing Up the Database

Simply copy the entire `server/` folder:

```bash
cp -r server/ server_backup_2024-11-04/
```

This includes:
- `westgate.db` - database file
- `uploads/` - all uploaded images

### Restoring from Backup

1. Stop the backend server
2. Replace `server/westgate.db` with backup file
3. Replace `server/uploads/` with backup folder
4. Restart backend server

---

## Production Deployment Notes

When deploying to production:

1. **Environment Variables**: Create `.env` file for configuration
2. **Database**: Consider using PostgreSQL or MySQL instead of SQLite
3. **File Storage**: Use cloud storage (AWS S3, Cloudinary) for images
4. **Security**:
   - Add authentication to admin endpoints
   - Validate all user inputs
   - Use HTTPS
   - Add rate limiting
5. **CORS**: Update CORS settings to only allow your frontend domain

---

## Support & Maintenance

### Regular Maintenance Tasks

1. **Weekly**: Backup database and uploads folder
2. **Monthly**: Review and optimize database queries
3. **As Needed**: Update image files, clean up unused uploads

### Contact

For issues or questions about this system, contact the development team.

---

## License

Internal use only - West Gate Realty Services

---

**Last Updated**: November 4, 2025
**Version**: 1.0.0
