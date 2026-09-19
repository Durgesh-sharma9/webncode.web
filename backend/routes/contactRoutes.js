const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  deleteContact
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Contact Routes
 * Base path: /api/contact
 */

// POST /api/contact - Create a new contact submission (Public endpoint)
router.post('/', createContact);

// GET /api/contact - Get all contact submissions (SuperAdmin only)
router.get('/', protect, getAllContacts);

// DELETE /api/contact/:id - Delete a contact enquiry (SuperAdmin only)
router.delete('/:id', protect, deleteContact);

module.exports = router;

