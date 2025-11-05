const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'westgate.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Carousel Properties Table
    db.run(`
      CREATE TABLE IF NOT EXISTS carousel_properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        type_color TEXT NOT NULL,
        background_image TEXT NOT NULL,
        price TEXT NOT NULL,
        size TEXT NOT NULL,
        features TEXT NOT NULL,
        description TEXT NOT NULL,
        video_url TEXT,
        detail_images TEXT,
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating carousel_properties table:', err.message);
      } else {
        console.log('Carousel properties table ready');
        // Add columns if they don't exist (for existing databases)
        db.run(`ALTER TABLE carousel_properties ADD COLUMN video_url TEXT`, () => {});
        db.run(`ALTER TABLE carousel_properties ADD COLUMN detail_images TEXT`, () => {});
      }
    });

    // Featured Projects Table
    db.run(`
      CREATE TABLE IF NOT EXISTS featured_projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        bg_gradient TEXT NOT NULL,
        features TEXT NOT NULL,
        stats TEXT NOT NULL,
        type TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating featured_projects table:', err.message);
      } else {
        console.log('Featured projects table ready');
      }
    });

    // Neighborhoods Table
    db.run(`
      CREATE TABLE IF NOT EXISTS neighborhoods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        highlights TEXT NOT NULL,
        image TEXT NOT NULL,
        location TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        is_popular BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating neighborhoods table:', err.message);
      } else {
        console.log('Neighborhoods table ready');
        seedInitialData();
      }
    });
  });
}

// Seed initial data from existing hardcoded data
function seedInitialData() {
  // Check if data already exists
  db.get('SELECT COUNT(*) as count FROM carousel_properties', (err, row) => {
    if (err) {
      console.error('Error checking carousel data:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Seeding initial carousel data...');

      const carouselData = [
        {
          title: 'Prime Agricultural Land',
          location: 'Ilocos Norte',
          type: 'Agricultural',
          type_color: '#10b981',
          background_image: '/assets/images/agri-land.jpg',
          price: '₱5,000,000',
          size: '2 Hectares',
          features: JSON.stringify(['Fertile soil', 'Irrigation access', 'Road access']),
          description: 'Prime agricultural land perfect for farming or investment',
          order_index: 1
        },
        {
          title: 'Solar Development Projects',
          location: 'Ilocos Sur',
          type: 'Commercial',
          type_color: '#f59e0b',
          background_image: '/assets/images/solar-project.jpg',
          price: '₱15,000,000',
          size: '5 Hectares',
          features: JSON.stringify(['High solar exposure', 'Grid connection', 'Development ready']),
          description: 'Ideal location for solar energy development',
          order_index: 2
        },
        {
          title: 'Narvacan Coastal Properties',
          location: 'Narvacan, Ilocos Sur',
          type: 'Coastal',
          type_color: '#3b82f6',
          background_image: '/assets/images/coastal.jpg',
          price: '₱8,000,000',
          size: '1.5 Hectares',
          features: JSON.stringify(['Beach access', 'Tourism potential', 'Clear title']),
          description: 'Beautiful coastal property with tourism potential',
          order_index: 3
        },
        {
          title: 'Sinait Heritage District',
          location: 'Sinait, Ilocos Sur',
          type: 'Heritage',
          type_color: '#8b5cf6',
          background_image: '/assets/images/heritage.jpg',
          price: '₱10,000,000',
          size: '1 Hectare',
          features: JSON.stringify(['Historic value', 'Central location', 'Development potential']),
          description: 'Property in historic district with cultural significance',
          order_index: 4
        },
        {
          title: 'San Ildefonso Agricultural Lands',
          location: 'San Ildefonso, Ilocos Sur',
          type: 'Agricultural',
          type_color: '#10b981',
          background_image: '/assets/images/san-ildefonso.jpg',
          price: '₱6,500,000',
          size: '3 Hectares',
          features: JSON.stringify(['Water source', 'Flat terrain', 'Good access road']),
          description: 'Expansive agricultural land with excellent growing conditions',
          order_index: 5
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO carousel_properties
        (title, location, type, type_color, background_image, price, size, features, description, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      carouselData.forEach((prop) => {
        stmt.run(
          prop.title,
          prop.location,
          prop.type,
          prop.type_color,
          prop.background_image,
          prop.price,
          prop.size,
          prop.features,
          prop.description,
          prop.order_index
        );
      });

      stmt.finalize(() => {
        console.log('Carousel data seeded successfully');
      });
    }
  });

  // Seed featured projects
  db.get('SELECT COUNT(*) as count FROM featured_projects', (err, row) => {
    if (err) {
      console.error('Error checking featured projects:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Seeding initial featured projects data...');

      const projectsData = [
        {
          title: 'San Ildefonso Agricultural Lands',
          description: 'Prime agricultural land with excellent soil quality and irrigation access',
          image: '/assets/images/san-ildefonso.jpg',
          bg_gradient: 'from-green-400 to-emerald-600',
          features: JSON.stringify(['2.5 hectares', 'Irrigation ready', 'Road access', 'Clear title']),
          stats: JSON.stringify({ Size: '2.5 hectares', Location: 'San Ildefonso', Type: 'Agricultural' }),
          type: 'agricultural',
          order_index: 1
        },
        {
          title: 'Solar Farm Developments',
          description: 'Strategic locations for renewable energy projects across Ilocos',
          image: '/assets/images/solar-project.jpg',
          bg_gradient: 'from-amber-400 to-orange-600',
          features: JSON.stringify(['High sun exposure', 'Grid connectivity', 'Government support', 'ROI potential']),
          stats: JSON.stringify({ Capacity: '5MW', Location: 'Ilocos Sur', Status: 'Planning' }),
          type: 'commercial',
          order_index: 2
        },
        {
          title: 'Sinait Heritage Properties',
          description: 'Historic properties in culturally significant locations',
          image: '/assets/images/heritage.jpg',
          bg_gradient: 'from-purple-400 to-indigo-600',
          features: JSON.stringify(['Cultural value', 'Tourism potential', 'Restoration ready', 'Prime location']),
          stats: JSON.stringify({ Area: '500 sqm', Location: 'Sinait', Type: 'Heritage' }),
          type: 'heritage',
          order_index: 3
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO featured_projects
        (title, description, image, bg_gradient, features, stats, type, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      projectsData.forEach((proj) => {
        stmt.run(
          proj.title,
          proj.description,
          proj.image,
          proj.bg_gradient,
          proj.features,
          proj.stats,
          proj.type,
          proj.order_index
        );
      });

      stmt.finalize(() => {
        console.log('Featured projects data seeded successfully');
      });
    }
  });

  // Seed neighborhoods
  db.get('SELECT COUNT(*) as count FROM neighborhoods', (err, row) => {
    if (err) {
      console.error('Error checking neighborhoods:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Seeding initial neighborhoods data...');

      const neighborhoodsData = [
        {
          name: 'Sinait Heritage District',
          description: 'Historic town center with Spanish colonial architecture and cultural landmarks',
          highlights: JSON.stringify([
            'UNESCO heritage site proximity',
            'Traditional markets',
            'Cultural festivals year-round',
            'Well-preserved colonial structures'
          ]),
          image: '/assets/images/heritage.jpg',
          location: 'Sinait, Ilocos Sur',
          order_index: 1
        },
        {
          name: 'Narvacan Coastal Area',
          description: 'Pristine coastline perfect for resort development and eco-tourism ventures',
          highlights: JSON.stringify([
            'White sand beaches',
            'Crystal clear waters',
            'Water sports facilities',
            'Sunset viewing spots'
          ]),
          image: '/assets/images/coastal.jpg',
          location: 'Narvacan, Ilocos Sur',
          order_index: 2
        },
        {
          name: 'San Ildefonso Agricultural Lands',
          description: 'Fertile farmlands with modern irrigation systems and excellent yields',
          highlights: JSON.stringify([
            'Rich, fertile soil',
            'Modern irrigation',
            'Farming community',
            'Agricultural support services'
          ]),
          image: '/assets/images/san-ildefonso.jpg',
          location: 'San Ildefonso, Ilocos Sur',
          order_index: 3
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO neighborhoods
        (name, description, highlights, image, location, order_index)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      neighborhoodsData.forEach((neighborhood) => {
        stmt.run(
          neighborhood.name,
          neighborhood.description,
          neighborhood.highlights,
          neighborhood.image,
          neighborhood.location,
          neighborhood.order_index
        );
      });

      stmt.finalize(() => {
        console.log('Neighborhoods data seeded successfully');
      });
    }
  });
}

module.exports = db;
