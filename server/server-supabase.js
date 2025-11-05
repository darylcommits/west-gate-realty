require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { decode } = require('base64-arraybuffer');
const supabase = require('./supabaseClient');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for memory storage (not disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mov|wmv|flv|mkv|webm/;
    const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = /^(image|video)\//.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

// Helper function to upload file to Supabase Storage
async function uploadToSupabase(file, bucket) {
  try {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw error;
  }
}

// Helper function to delete file from Supabase Storage
async function deleteFromSupabase(fileUrl, bucket) {
  try {
    if (!fileUrl) return;

    // Extract file path from URL
    const urlParts = fileUrl.split(`/storage/v1/object/public/${bucket}/`);
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting from Supabase:', error);
  }
}

// ======================
// CAROUSEL PROPERTIES ROUTES
// ======================

// Get all carousel properties
app.get('/api/carousel-properties', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('carousel_properties')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    // Transform data to match frontend expectations
    const properties = data.map(row => ({
      ...row,
      details: {
        price: row.price,
        size: row.size,
        features: row.features,
        description: row.description,
        video_url: row.video_url || null,
        detail_images: row.detail_images || []
      }
    }));

    res.json(properties);
  } catch (error) {
    console.error('Error fetching carousel properties:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single carousel property
app.get('/api/carousel-properties/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('carousel_properties')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = {
      ...data,
      details: {
        price: data.price,
        size: data.size,
        features: data.features,
        description: data.description,
        video_url: data.video_url || null,
        detail_images: data.detail_images || []
      }
    };

    res.json(property);
  } catch (error) {
    console.error('Error fetching carousel property:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new carousel property
app.post('/api/carousel-properties', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'detailImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const {
      title,
      location,
      type,
      type_color,
      price,
      size,
      features,
      description,
      order_index
    } = req.body;

    // Upload background image
    let background_image = req.body.background_image || '';
    if (req.files?.image?.[0]) {
      background_image = await uploadToSupabase(req.files.image[0], 'property-images');
    }

    // Upload video
    let video_url = null;
    if (req.files?.video?.[0]) {
      video_url = await uploadToSupabase(req.files.video[0], 'property-videos');
    }

    // Upload detail images
    let detail_images = [];
    if (req.files?.detailImages) {
      const uploadPromises = req.files.detailImages.map(file =>
        uploadToSupabase(file, 'property-images')
      );
      detail_images = await Promise.all(uploadPromises);
    }

    // Insert into database
    const { data, error } = await supabase
      .from('carousel_properties')
      .insert({
        title,
        location,
        type,
        type_color,
        background_image,
        price,
        size,
        features: JSON.parse(features),
        description,
        video_url,
        detail_images,
        order_index: parseInt(order_index) || 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      id: data.id,
      message: 'Property created successfully'
    });
  } catch (error) {
    console.error('Error creating carousel property:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update carousel property
app.put('/api/carousel-properties/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'detailImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const {
      title,
      location,
      type,
      type_color,
      price,
      size,
      features,
      description,
      order_index,
      is_active
    } = req.body;

    // Get existing property
    const { data: existingProperty, error: fetchError } = await supabase
      .from('carousel_properties')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;
    if (!existingProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    let background_image = req.body.background_image || existingProperty.background_image;
    let video_url = req.body.video_url || existingProperty.video_url;
    let detail_images = req.body.detail_images
      ? JSON.parse(req.body.detail_images)
      : existingProperty.detail_images || [];

    // Handle background image upload
    if (req.files?.image?.[0]) {
      // Delete old image
      if (existingProperty.background_image) {
        await deleteFromSupabase(existingProperty.background_image, 'property-images');
      }
      background_image = await uploadToSupabase(req.files.image[0], 'property-images');
    }

    // Handle video upload
    if (req.files?.video?.[0]) {
      // Delete old video
      if (existingProperty.video_url) {
        await deleteFromSupabase(existingProperty.video_url, 'property-videos');
      }
      video_url = await uploadToSupabase(req.files.video[0], 'property-videos');
    }

    // Handle detail images upload
    if (req.files?.detailImages) {
      const uploadPromises = req.files.detailImages.map(file =>
        uploadToSupabase(file, 'property-images')
      );
      const newDetailImages = await Promise.all(uploadPromises);
      detail_images = [...detail_images, ...newDetailImages];
    }

    // Update database
    const { data, error } = await supabase
      .from('carousel_properties')
      .update({
        title,
        location,
        type,
        type_color,
        background_image,
        price,
        size,
        features: JSON.parse(features),
        description,
        video_url,
        detail_images,
        order_index: parseInt(order_index) || 0,
        is_active: is_active !== undefined ? is_active === 'true' : true
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Property updated successfully' });
  } catch (error) {
    console.error('Error updating carousel property:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete carousel property
app.delete('/api/carousel-properties/:id', async (req, res) => {
  try {
    // Get property to delete files
    const { data: property, error: fetchError } = await supabase
      .from('carousel_properties')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Delete files from storage
    if (property.background_image) {
      await deleteFromSupabase(property.background_image, 'property-images');
    }
    if (property.video_url) {
      await deleteFromSupabase(property.video_url, 'property-videos');
    }
    if (property.detail_images && property.detail_images.length > 0) {
      for (const image of property.detail_images) {
        await deleteFromSupabase(image, 'property-images');
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('carousel_properties')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting carousel property:', error);
    res.status(500).json({ error: error.message });
  }
});

// ======================
// FEATURED PROJECTS ROUTES
// ======================

// Get all featured projects
app.get('/api/featured-projects', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('featured_projects')
      .select('*')
      .eq('is_featured', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create featured project
app.post('/api/featured-projects', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      bg_gradient,
      features,
      stats,
      type,
      order_index
    } = req.body;

    let image = req.body.image || '';
    if (req.file) {
      image = await uploadToSupabase(req.file, 'property-images');
    }

    const { data, error } = await supabase
      .from('featured_projects')
      .insert({
        title,
        description,
        image,
        bg_gradient,
        features: JSON.parse(features),
        stats: JSON.parse(stats),
        type,
        order_index: parseInt(order_index) || 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      id: data.id,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Error creating featured project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update featured project
app.put('/api/featured-projects/:id', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      bg_gradient,
      features,
      stats,
      type,
      order_index,
      is_featured
    } = req.body;

    const { data: existingProject, error: fetchError } = await supabase
      .from('featured_projects')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    let image = req.body.image || existingProject.image;
    if (req.file) {
      if (existingProject.image) {
        await deleteFromSupabase(existingProject.image, 'property-images');
      }
      image = await uploadToSupabase(req.file, 'property-images');
    }

    const { error } = await supabase
      .from('featured_projects')
      .update({
        title,
        description,
        image,
        bg_gradient,
        features: JSON.parse(features),
        stats: JSON.parse(stats),
        type,
        order_index: parseInt(order_index) || 0,
        is_featured: is_featured !== undefined ? is_featured === 'true' : true
      })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating featured project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete featured project
app.delete('/api/featured-projects/:id', async (req, res) => {
  try {
    const { data: project, error: fetchError } = await supabase
      .from('featured_projects')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    if (project.image) {
      await deleteFromSupabase(project.image, 'property-images');
    }

    const { error } = await supabase
      .from('featured_projects')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting featured project:', error);
    res.status(500).json({ error: error.message });
  }
});

// ======================
// NEIGHBORHOODS ROUTES
// ======================

// Get all neighborhoods
app.get('/api/neighborhoods', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('is_popular', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create neighborhood
app.post('/api/neighborhoods', upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      highlights,
      location,
      order_index
    } = req.body;

    let image = req.body.image || '';
    if (req.file) {
      image = await uploadToSupabase(req.file, 'property-images');
    }

    const { data, error } = await supabase
      .from('neighborhoods')
      .insert({
        name,
        description,
        highlights: JSON.parse(highlights),
        image,
        location,
        order_index: parseInt(order_index) || 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      id: data.id,
      message: 'Neighborhood created successfully'
    });
  } catch (error) {
    console.error('Error creating neighborhood:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update neighborhood
app.put('/api/neighborhoods/:id', upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      highlights,
      location,
      order_index,
      is_popular
    } = req.body;

    const { data: existingNeighborhood, error: fetchError } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    let image = req.body.image || existingNeighborhood.image;
    if (req.file) {
      if (existingNeighborhood.image) {
        await deleteFromSupabase(existingNeighborhood.image, 'property-images');
      }
      image = await uploadToSupabase(req.file, 'property-images');
    }

    const { error } = await supabase
      .from('neighborhoods')
      .update({
        name,
        description,
        highlights: JSON.parse(highlights),
        image,
        location,
        order_index: parseInt(order_index) || 0,
        is_popular: is_popular !== undefined ? is_popular === 'true' : true
      })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Neighborhood updated successfully' });
  } catch (error) {
    console.error('Error updating neighborhood:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete neighborhood
app.delete('/api/neighborhoods/:id', async (req, res) => {
  try {
    const { data: neighborhood, error: fetchError } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    if (neighborhood.image) {
      await deleteFromSupabase(neighborhood.image, 'property-images');
    }

    const { error } = await supabase
      .from('neighborhoods')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Neighborhood deleted successfully' });
  } catch (error) {
    console.error('Error deleting neighborhood:', error);
    res.status(500).json({ error: error.message });
  }
});

// ======================
// DASHBOARD STATS ROUTE
// ======================

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('get_dashboard_stats');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ======================
// START SERVER
// ======================

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log('📡 Connected to Supabase');
  console.log('\nAPI Endpoints:');
  console.log('  - GET    /api/carousel-properties');
  console.log('  - POST   /api/carousel-properties');
  console.log('  - PUT    /api/carousel-properties/:id');
  console.log('  - DELETE /api/carousel-properties/:id');
  console.log('  - GET    /api/featured-projects');
  console.log('  - POST   /api/featured-projects');
  console.log('  - PUT    /api/featured-projects/:id');
  console.log('  - DELETE /api/featured-projects/:id');
  console.log('  - GET    /api/neighborhoods');
  console.log('  - POST   /api/neighborhoods');
  console.log('  - PUT    /api/neighborhoods/:id');
  console.log('  - DELETE /api/neighborhoods/:id');
  console.log('  - GET    /api/dashboard/stats\n');
});

module.exports = app;
