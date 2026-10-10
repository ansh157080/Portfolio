const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Basic RFC 5322 standard email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/contact
 * Handles contact form submissions and persists them into MySQL contacts table
 */
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  const errors = [];
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }
  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }
  if (!subject || subject.trim().length < 3) {
    errors.push('Subject must be at least 3 characters long.');
  }
  if (!message || message.trim().length < 5) {
    errors.push('Message must be at least 5 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO contacts (name, email, subject, message)
       VALUES (?, ?, ?, ?)`,
      [name.trim(), email.trim(), subject.trim(), message.trim()]
    );

    return res.status(201).json({
      success: true,
      message: `Thank you, ${name.trim()}! Your message has been sent and stored in the database. I will get back to you shortly.`,
      data: {
        id: result.insertId,
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Database error on POST /api/contact:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Database error: Unable to save message at this time. Please make sure MySQL is running.',
      error: error.message
    });
  }
});

/**
 * GET /api/contact
 * Retrieves submitted messages (for verification / admin view)
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Database error on GET /api/contact:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve contact messages from database.',
      error: error.message
    });
  }
});

module.exports = router;
