const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Default seed projects for initial setup or fallback
const SEED_PROJECTS = [
  {
    id: 1,
    title: 'Mausam – Personalized Weather Experience',
    subtitle: 'Smart Meteorological Advisory & Interactive Forecast',
    description: 'A personalized weather web prototype providing weather information, safety alerts, and useful weather-related insights.',
    category: 'Web Development / SIH',
    technologies: 'HTML, CSS, JavaScript, Node.js, Express, OpenWeather API',
    github_url: 'https://github.com/ansh157080/Mausam-',
    demo_url: 'https://mausam-personalized-weather-intelligence.ai.studio/',
    image_url: '/assets/mausam.svg',
    featured: 1
  },
  {
    id: 2,
    title: 'Suraksha Kawach – AI Powered Fraud Intelligence System',
    subtitle: 'Real-time Financial Fraud Detection & Analytics',
    description: 'An AI/ML-based fraud detection prototype that analyzes transactions, estimates fraud risk, and provides explainable insights.',
    category: 'AI / Machine Learning',
    technologies: 'Python, Streamlit, XGBoost, SHAP, Pandas',
    github_url: 'https://github.com/ansh157080/Suraksha-Kawach',
    demo_url: '',
    image_url: '/assets/suraksha-kawach.svg',
    featured: 1
  }
];


// Base database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
};

// Create a connection pool targeting portfolio_db
const pool = mysql.createPool(dbConfig);

/**
 * Initializes database and tables automatically if they do not exist.
 * This ensures smooth one-command startup for Windows, XAMPP, and standalone MySQL.
 */
async function initializeDatabase() {
  // 1. Try to ensure the database exists. On hosted MySQL (e.g. TiDB Cloud) the
  //    database is pre-created and CREATE DATABASE is denied — that is fine, we
  //    still proceed to create tables inside the existing database.
  try {
    const rootConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
      ssl: dbConfig.ssl
    });
    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConnection.end();
  } catch (dbErr) {
    console.warn(`ℹ️ Database creation skipped (${dbErr.message}) — using existing database "${dbConfig.database}".`);
  }

  // 2. Create tables inside the database
  try {
    const conn = await pool.getConnection();
    try {
      // Projects table
      await conn.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          subtitle VARCHAR(255) DEFAULT '',
          description TEXT NOT NULL,
          category VARCHAR(100) NOT NULL,
          technologies VARCHAR(255) NOT NULL,
          github_url VARCHAR(255) DEFAULT '#',
          demo_url VARCHAR(255) DEFAULT '#',
          image_url VARCHAR(255) DEFAULT '/assets/suraksha-kawach.svg',
          featured TINYINT(1) DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);

      // Contacts table
      await conn.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) NOT NULL,
          subject VARCHAR(200) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);

      // Seed default projects if table is empty
      const [rows] = await conn.query('SELECT COUNT(*) AS count FROM projects');
      if (rows[0].count === 0) {
        console.log('📌 Seeding initial projects into MySQL...');
        for (const p of SEED_PROJECTS) {
          await conn.query(
            `INSERT INTO projects (id, title, subtitle, description, category, technologies, github_url, demo_url, image_url, featured)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [p.id, p.title, p.subtitle, p.description, p.category, p.technologies, p.github_url, p.demo_url, p.image_url, p.featured]
          );
        }
        console.log('✅ Default projects seeded successfully.');
      }

      console.log(`✅ MySQL connected and tables verified in database "${dbConfig.database}".`);
      return { connected: true, database: dbConfig.database };
    } finally {
      conn.release();
    }
  } catch (error) {
    console.warn(`⚠️ MySQL Initialization Note: ${error.message}`);
    console.warn('   Ensure MySQL is running (e.g. via XAMPP Control Panel) on port ' + dbConfig.port);
    return { connected: false, error: error.message };
  }
}

module.exports = {
  pool,
  dbConfig,
  initializeDatabase,
  SEED_PROJECTS
};
