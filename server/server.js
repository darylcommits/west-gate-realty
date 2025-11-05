const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mov|wmv|flv|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /^(image|video)\//.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

// ======================
// CAROUSEL PROPERTIES ROUTES
// ======================

// Get all carousel properties
app.get('/api/carousel-properties', (req, res) => {
  const query = `
    SELECT * FROM carousel_properties
    WHERE is_active = 1
    ORDER BY order_index ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Parse JSON strings back to arrays
    const properties = rows.map(row => ({
      ...row,
      features: JSON.parse(row.features),
      video_url: row.video_url || null,
      detail_images: row.detail_images ? JSON.parse(row.detail_images) : [],
      details: {
        price: row.price,
        size: row.size,
        features: JSON.parse(row.features),
        description: row.description,
        video_url: row.video_url || null,
        detail_images: row.detail_images ? JSON.parse(row.detail_images) : []
      }
    }));

    res.json(properties);
  });
});

// Get single carousel property
app.get('/api/carousel-properties/:id', (req, res) => {
  const query = 'SELECT * FROM carousel_properties WHERE id = ?';

  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = {
      ...row,
      features: JSON.parse(row.features),
      video_url: row.video_url || null,
      detail_images: row.detail_images ? JSON.parse(row.detail_images) : [],
      details: {
        price: row.price,
        size: row.size,
        features: JSON.parse(row.features),
        description: row.description,
        video_url: row.video_url || null,
        detail_images: row.detail_images ? JSON.parse(row.detail_images) : []
      }
    };

    res.json(property);
  });
});

// Create new carousel property
app.post('/api/carousel-properties', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'detailImages', maxCount: 10 }
]), (req, res) => {
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

  const background_image = req.files?.image?.[0]
    ? `/uploads/${req.files.image[0].filename}`
    : req.body.background_image;

  const video_url = req.files?.video?.[0]
    ? `/uploads/${req.files.video[0].filename}`
    : req.body.video_url || null;

  const detail_images = req.files?.detailImages
    ? req.files.detailImages.map(file => `/uploads/${file.filename}`)
    : (req.body.detail_images ? JSON.parse(req.body.detail_images) : []);

  const query = `
    INSERT INTO carousel_properties
    (title, location, type, type_color, background_image, price, size, features, description, video_url, detail_images, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      title,
      location,
      type,
      type_color,
      background_image,
      price,
      size,
      typeof features === 'string' ? features : JSON.stringify(features),
      description,
      video_url,
      JSON.stringify(detail_images),
      order_index || 0
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        message: 'Property created successfully'
      });
    }
  );
});

// Update carousel property
app.put('/api/carousel-properties/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'detailImages', maxCount: 10 }
]), (req, res) => {
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

  let background_image = req.body.background_image;
  let video_url = req.body.video_url;
  let detail_images = req.body.detail_images ? JSON.parse(req.body.detail_images) : [];

  // Handle background image upload
  if (req.files?.image?.[0]) {
    background_image = `/uploads/${req.files.image[0].filename}`;

    // Delete old image if it exists
    if (req.body.old_image && req.body.old_image.startsWith('/uploads/')) {
      const oldImagePath = path.join(__dirname, req.body.old_image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
  }

  // Handle video upload
  if (req.files?.video?.[0]) {
    video_url = `/uploads/${req.files.video[0].filename}`;

    // Delete old video if it exists
    if (req.body.old_video && req.body.old_video.startsWith('/uploads/')) {
      const oldVideoPath = path.join(__dirname, req.body.old_video);
      if (fs.existsSync(oldVideoPath)) {
        fs.unlinkSync(oldVideoPath);
      }
    }
  }

  // Handle detail images upload
  if (req.files?.detailImages) {
    const newDetailImages = req.files.detailImages.map(file => `/uploads/${file.filename}`);
    detail_images = [...detail_images, ...newDetailImages];
  }

  const query = `
    UPDATE carousel_properties
    SET title = ?, location = ?, type = ?, type_color = ?, background_image = ?,
        price = ?, size = ?, features = ?, description = ?, video_url = ?,
        detail_images = ?, order_index = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(
    query,
    [
      title,
      location,
      type,
      type_color,
      background_image,
      price,
      size,
      typeof features === 'string' ? features : JSON.stringify(features),
      description,
      video_url,
      JSON.stringify(detail_images),
      order_index || 0,
      is_active !== undefined ? is_active : 1,
      req.params.id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }

      res.json({ message: 'Property updated successfully' });
    }
  );
});

// Delete carousel property
app.delete('/api/carousel-properties/:id', (req, res) => {
  // First get all file paths to delete
  db.get('SELECT background_image, video_url, detail_images FROM carousel_properties WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Delete background image
    if (row && row.background_image && row.background_image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, row.background_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete video
    if (row && row.video_url && row.video_url.startsWith('/uploads/')) {
      const videoPath = path.join(__dirname, row.video_url);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    // Delete detail images
    if (row && row.detail_images) {
      const detailImages = JSON.parse(row.detail_images);
      detailImages.forEach(imgPath => {
        if (imgPath.startsWith('/uploads/')) {
          const fullPath = path.join(__dirname, imgPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      });
    }

    // Delete from database
    db.run('DELETE FROM carousel_properties WHERE id = ?', [req.params.id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }

      res.json({ message: 'Property deleted successfully' });
    });
  });
});

// ======================
// FEATURED PROJECTS ROUTES
// ======================

// Get all featured projects
app.get('/api/featured-projects', (req, res) => {
  const query = `
    SELECT * FROM featured_projects
    WHERE is_featured = 1
    ORDER BY order_index ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const projects = rows.map(row => ({
      ...row,
      features: JSON.parse(row.features),
      stats: JSON.parse(row.stats)
    }));

    res.json(projects);
  });
});

// Get single featured project
app.get('/api/featured-projects/:id', (req, res) => {
  const query = 'SELECT * FROM featured_projects WHERE id = ?';

  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = {
      ...row,
      features: JSON.parse(row.features),
      stats: JSON.parse(row.stats)
    };

    res.json(project);
  });
});

// Create new featured project
app.post('/api/featured-projects', upload.single('image'), (req, res) => {
  const {
    title,
    description,
    bg_gradient,
    features,
    stats,
    type,
    order_index
  } = req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  const query = `
    INSERT INTO featured_projects
    (title, description, image, bg_gradient, features, stats, type, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      title,
      description,
      image,
      bg_gradient,
      typeof features === 'string' ? features : JSON.stringify(features),
      typeof stats === 'string' ? stats : JSON.stringify(stats),
      type,
      order_index || 0
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        message: 'Project created successfully'
      });
    }
  );
});

// Update featured project
app.put('/api/featured-projects/:id', upload.single('image'), (req, res) => {
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

  let image = req.body.image;

  if (req.file) {
    image = `/uploads/${req.file.filename}`;

    // Delete old image
    if (req.body.old_image && req.body.old_image.startsWith('/uploads/')) {
      const oldImagePath = path.join(__dirname, req.body.old_image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
  }

  const query = `
    UPDATE featured_projects
    SET title = ?, description = ?, image = ?, bg_gradient = ?, features = ?,
        stats = ?, type = ?, order_index = ?, is_featured = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(
    query,
    [
      title,
      description,
      image,
      bg_gradient,
      typeof features === 'string' ? features : JSON.stringify(features),
      typeof stats === 'string' ? stats : JSON.stringify(stats),
      type,
      order_index || 0,
      is_featured !== undefined ? is_featured : 1,
      req.params.id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({ message: 'Project updated successfully' });
    }
  );
});

// Delete featured project
app.delete('/api/featured-projects/:id', (req, res) => {
  db.get('SELECT image FROM featured_projects WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row && row.image && row.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, row.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    db.run('DELETE FROM featured_projects WHERE id = ?', [req.params.id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({ message: 'Project deleted successfully' });
    });
  });
});

// ======================
// NEIGHBORHOODS ROUTES
// ======================

// Get all neighborhoods
app.get('/api/neighborhoods', (req, res) => {
  const query = `
    SELECT * FROM neighborhoods
    WHERE is_popular = 1
    ORDER BY order_index ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const neighborhoods = rows.map(row => ({
      ...row,
      highlights: JSON.parse(row.highlights)
    }));

    res.json(neighborhoods);
  });
});

// Get single neighborhood
app.get('/api/neighborhoods/:id', (req, res) => {
  const query = 'SELECT * FROM neighborhoods WHERE id = ?';

  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Neighborhood not found' });
    }

    const neighborhood = {
      ...row,
      highlights: JSON.parse(row.highlights)
    };

    res.json(neighborhood);
  });
});

// Create new neighborhood
app.post('/api/neighborhoods', upload.single('image'), (req, res) => {
  const {
    name,
    description,
    highlights,
    location,
    order_index
  } = req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  const query = `
    INSERT INTO neighborhoods
    (name, description, highlights, image, location, order_index)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      name,
      description,
      typeof highlights === 'string' ? highlights : JSON.stringify(highlights),
      image,
      location,
      order_index || 0
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        message: 'Neighborhood created successfully'
      });
    }
  );
});

// Update neighborhood
app.put('/api/neighborhoods/:id', upload.single('image'), (req, res) => {
  const {
    name,
    description,
    highlights,
    location,
    order_index,
    is_popular
  } = req.body;

  let image = req.body.image;

  if (req.file) {
    image = `/uploads/${req.file.filename}`;

    // Delete old image
    if (req.body.old_image && req.body.old_image.startsWith('/uploads/')) {
      const oldImagePath = path.join(__dirname, req.body.old_image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
  }

  const query = `
    UPDATE neighborhoods
    SET name = ?, description = ?, highlights = ?, image = ?, location = ?,
        order_index = ?, is_popular = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(
    query,
    [
      name,
      description,
      typeof highlights === 'string' ? highlights : JSON.stringify(highlights),
      image,
      location,
      order_index || 0,
      is_popular !== undefined ? is_popular : 1,
      req.params.id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Neighborhood not found' });
      }

      res.json({ message: 'Neighborhood updated successfully' });
    }
  );
});

// Delete neighborhood
app.delete('/api/neighborhoods/:id', (req, res) => {
  db.get('SELECT image FROM neighborhoods WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row && row.image && row.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, row.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    db.run('DELETE FROM neighborhoods WHERE id = ?', [req.params.id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Neighborhood not found' });
      }

      res.json({ message: 'Neighborhood deleted successfully' });
    });
  });
});

// ======================
// DASHBOARD STATS ROUTE
// ======================

app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};

  // Get counts from all tables
  db.get('SELECT COUNT(*) as count FROM carousel_properties WHERE is_active = 1', (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    stats.carouselProperties = row.count;

    db.get('SELECT COUNT(*) as count FROM featured_projects WHERE is_featured = 1', (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      stats.featuredProjects = row.count;

      db.get('SELECT COUNT(*) as count FROM neighborhoods WHERE is_popular = 1', (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        stats.neighborhoods = row.count;

        res.json(stats);
      });
    });
  });
});

// ======================
// START SERVER
// ======================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('API Endpoints:');
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
  console.log('  - GET    /api/dashboard/stats');
});

module.exports = app;
