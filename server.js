const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { initializeDatabase, pool, dbConfig } = require('./src/config/db');
const projectRoutes = require('./src/routes/projectRoutes');
const contactRoutes = require('./src/routes/contactRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.url.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbMessage = 'MySQL is not connected';

  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    if (rows && rows[0].solution === 2) {
      dbStatus = 'connected';
      dbMessage = `Connected to MySQL database "${dbConfig.database}" on port ${dbConfig.port}`;
    }
  } catch (err) {
    dbMessage = err.message;
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      message: dbMessage,
      host: dbConfig.host,
      databaseName: dbConfig.database,
      port: dbConfig.port
    }
  });
});

// Catch-all for SPA / browser refresh to serve index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server & Initialize Database
async function startServer() {
  console.log('⚡ Initializing Anshu Thakur Portfolio Server...');
  await initializeDatabase();

  const server = app.listen(PORT, () => {
    console.log(`
============================================================
🌟 ANSHU THAKUR - PERSONAL PORTFOLIO WEBSITE (FULL-STACK)
============================================================
🚀 Local Server:      http://localhost:${PORT}
🔌 Projects API:     http://localhost:${PORT}/api/projects
📨 Contact API:      http://localhost:${PORT}/api/contact
❤️  Health Check:     http://localhost:${PORT}/api/health
📁 Database:         MySQL (XAMPP / Local) -> "${dbConfig.database}"
============================================================
    `);
  });

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
