# West Gate Realty Admin Panel Setup Guide

## Overview
This guide will help you set up the comprehensive admin panel for the West Gate Realty website. The admin panel includes full CRUD functionality for managing all aspects of the website including properties, services, certifications, neighborhoods, property types, portfolio, featured projects, profile, and settings.

## Features

### 🏢 Admin Dashboard
- **Properties Management**: Add, edit, delete, and manage property listings
- **Services Management**: Manage company services with features and ordering
- **Certifications Management**: Handle legitimacy certifications with expiry tracking
- **Neighborhoods Management**: Manage popular neighborhoods and areas
- **Property Types Management**: Configure property categories for browsing
- **Portfolio Management**: Manage premium property portfolio items
- **Featured Projects Management**: Handle featured properties and projects
- **Profile Management**: Update company information and branding
- **Settings Management**: Configure website settings, SEO, and theme colors

### 🔧 Technical Features
- **Supabase Integration**: Full database integration with real-time updates
- **Form Validation**: Comprehensive form validation using React Hook Form and Yup
- **Responsive Design**: Mobile-friendly admin interface
- **Image Management**: URL-based image handling with fallbacks
- **Status Management**: Active/inactive toggles for content visibility
- **Ordering System**: Drag-and-drop ordering for content organization

## Setup Instructions

### 1. Supabase Configuration

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from the project settings

#### Database Setup
1. Go to the SQL Editor in your Supabase dashboard
2. Copy and run the SQL from `src/lib/database.sql`
3. This will create all necessary tables with proper relationships

#### Environment Variables
1. Create a `.env` file in the root directory:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Installation

```bash
# Navigate to project directory
cd west-gate-realty

# Install dependencies (if not already done)
npm install

# Start development server
npm start
```

### 3. Access Admin Panel

1. Start the development server: `npm start`
2. Navigate to `http://localhost:3000`
3. Click "Admin" in the navigation menu
4. You'll be taken to `http://localhost:3000/admin`
5. **Login with demo credentials:**
   - Email: `admin@westgaterealty.com`
   - Password: `admin123`

### 4. Initial Setup

#### Default Data
The database setup script includes:
- Default property types (Agricultural, Solar Projects, Commercial, Residential, Industrial)
- Default website settings with theme colors
- Sample data structure for all tables

#### First Steps
1. **Update Settings**: Go to Admin → Settings to configure your site information
2. **Add Profile**: Go to Admin → Profile to add your company information
3. **Add Services**: Go to Admin → Services to add your company services
4. **Add Properties**: Go to Admin → Properties to add your first property listings

## Database Schema

### Tables Created
- `properties` - Property listings with full details
- `services` - Company services with features
- `certifications` - Legitimacy certifications with expiry tracking
- `neighborhoods` - Popular neighborhoods and areas
- `property_types` - Property categories for browsing
- `portfolios` - Premium property portfolio items
- `featured_projects` - Featured properties and projects
- `profiles` - Company profile information
- `settings` - Website configuration and settings

### Key Features
- **Automatic timestamps**: `created_at` and `updated_at` fields
- **Soft deletes**: Content can be marked as inactive
- **Ordering**: `order_index` fields for content organization
- **Validation**: Database-level constraints for data integrity

## Usage Guide

### Properties Management
- Add properties with images, descriptions, features, and pricing
- Mark properties as featured or premium
- Set property status (Available, Sold, Pending, Under Construction)
- Organize by property type and location

### Services Management
- Create service listings with icons and descriptions
- Add feature lists for each service
- Control visibility with active/inactive status
- Order services by importance

### Certifications Management
- Add certifications with images and issuer information
- Track issue and expiry dates
- Add verification URLs
- Monitor expiring certifications

### Settings Management
- Configure site title, description, and logo
- Set contact information
- Manage social media links
- Configure SEO meta tags
- Customize theme colors with live preview

## Security Considerations

### Current Setup
- **Admin Login System**: Simple authentication with demo credentials
- Basic Supabase RLS (Row Level Security) structure included
- Form validation on both client and server side
- URL validation for external links
- Session management with localStorage

### Admin Authentication
- **Demo Credentials**: admin@westgaterealty.com / admin123
- **Session Storage**: Uses localStorage for session management
- **Protected Routes**: All admin routes require authentication
- **Logout Functionality**: Secure logout with session cleanup

### Recommended Enhancements
1. **Supabase Auth**: Implement proper Supabase authentication
2. **Role-based Access**: Add user roles and permissions
3. **API Rate Limiting**: Implement rate limiting for API calls
4. **Input Sanitization**: Add XSS protection for user inputs
5. **Password Security**: Implement password hashing and strong validation

## Troubleshooting

### Common Issues

#### Database Connection
- Verify Supabase URL and API key in environment variables
- Check Supabase project status and billing
- Ensure database tables are created properly

#### Image Loading
- Verify image URLs are accessible
- Check for CORS issues with external image sources
- Use HTTPS URLs for better compatibility

#### Form Validation
- Check browser console for validation errors
- Ensure all required fields are filled
- Verify URL formats for image and social media links

### Support
- Check browser developer console for errors
- Verify network requests in Network tab
- Review Supabase logs in the dashboard

## Future Enhancements

### Planned Features
- **User Authentication**: Secure admin login system
- **File Upload**: Direct image upload to Supabase Storage
- **Bulk Operations**: Import/export functionality
- **Analytics Dashboard**: Website usage statistics
- **Email Integration**: Contact form and newsletter management
- **Multi-language Support**: Internationalization features

### Performance Optimizations
- **Image Optimization**: Automatic image resizing and compression
- **Caching**: Implement caching strategies for better performance
- **Pagination**: Add pagination for large datasets
- **Search**: Advanced search and filtering capabilities

## Contributing

### Development
1. Follow existing code patterns and structure
2. Add proper TypeScript types for new features
3. Include form validation for all inputs
4. Test on mobile devices for responsiveness
5. Update documentation for new features

### Code Style
- Use functional components with hooks
- Implement proper error handling
- Follow React best practices
- Use Tailwind CSS for styling
- Maintain consistent naming conventions

---

**Note**: This admin panel is designed to be fully functional with the Supabase database. Make sure to configure your environment variables and run the database setup script before using the admin features.
