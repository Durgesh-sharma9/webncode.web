const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getAllApplications,
  deleteApplication
} = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Career Application Routes
 * Base path: /api/careers
 */

// POST /api/careers - Submit a new career application (Public)
router.post('/', submitApplication);

// GET /api/careers - Get all applications (SuperAdmin only)
router.get('/', protect, getAllApplications);

// DELETE /api/careers/:id - Delete an application (SuperAdmin only)
router.delete('/:id', protect, deleteApplication);

module.exports = router;

