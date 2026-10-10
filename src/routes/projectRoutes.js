const express = require('express');
const router = express.Router();
const { pool, SEED_PROJECTS } = require('../config/db');

/**
 * GET /api/projects
 * Fetches all projects or filters by category
 * Query params: ?category=...
 */
router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    let sql = 'SELECT * FROM projects';
    const params = [];

    if (category && category.trim().toLowerCase() !== 'all') {
      sql += ' WHERE LOWER(category) = LOWER(?) OR category LIKE ?';
      params.push(category.trim(), `%${category.trim()}%`);
    }

    sql += ' ORDER BY id ASC';

    const [rows] = await pool.query(sql, params);
    return res.status(200).json({
      success: true,
      count: rows.length,
      source: 'mysql',
      data: rows
    });
  } catch (error) {
    console.error('Database query error on GET /api/projects:', error.message);

    // Resilient fallback: return static seed projects if MySQL is offline
    let fallbackData = [...SEED_PROJECTS];
    if (category && category.trim().toLowerCase() !== 'all') {
      const catLower = category.trim().toLowerCase();
      fallbackData = fallbackData.filter(p =>
        p.category.toLowerCase().includes(catLower)
      );
    }

    return res.status(200).json({
      success: true,
      count: fallbackData.length,
      source: 'fallback',
      warning: 'Database temporarily unavailable. Displaying local project data.',
      data: fallbackData
    });
  }
});

/**
 * GET /api/projects/:id
 * Fetches a single project by ID
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      source: 'mysql',
      data: rows[0]
    });
  } catch (error) {
    console.error(`Database error on GET /api/projects/${id}:`, error.message);
    const foundFallback = SEED_PROJECTS.find(p => String(p.id) === String(id));
    if (foundFallback) {
      return res.status(200).json({
        success: true,
        source: 'fallback',
        data: foundFallback
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve project details.'
    });
  }
});

/**
 * POST /api/projects
 * Adds a new project to the database
 */
router.post('/', async (req, res) => {
  const {
    title,
    subtitle,
    description,
    category,
    technologies,
    github_url,
    demo_url,
    image_url,
    featured
  } = req.body;

  if (!title || !description || !category || !technologies) {
    return res.status(400).json({
      success: false,
      message: 'Title, description, category, and technologies are required.'
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO projects (title, subtitle, description, category, technologies, github_url, demo_url, image_url, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        (subtitle || '').trim(),
        description.trim(),
        category.trim(),
        technologies.trim(),
        github_url || '#',
        demo_url || '#',
        image_url || '/assets/suraksha-kawach.svg',
        featured !== undefined ? (featured ? 1 : 0) : 1
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Project created successfully in MySQL database.',
      data: {
        id: result.insertId,
        title,
        category
      }
    });
  } catch (error) {
    console.error('Database error on POST /api/projects:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Could not save project to MySQL. Ensure database is running.',
      error: error.message
    });
  }
});

module.exports = router;
