const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts
} = require('../controllers/contactController');

/**
 * Contact Routes
 * Base path: /api/contact
 */

// POST /api/contact - Create a new contact submission
// Public endpoint for website contact form
router.post('/', createContact);

// GET /api/contact - Get all contact submissions (Admin)
// Returns all enquiries sorted by newest first
// Note: Add authentication middleware in production for security
router.get('/', getAllContacts);

module.exports = router;
