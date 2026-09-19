const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Career Application Routes
 * Base path: /api/careers
 */

// POST /api/careers - Submit a new career application (Public)
router.post('/', submitApplication);

// GET /api/careers & /api/careers/all - Get all applications (SuperAdmin only)
router.get('/', protect, getAllApplications);
router.get('/all', protect, getAllApplications);

// PATCH /api/careers/:id/status - Update application review status
router.patch('/:id/status', protect, updateApplicationStatus);

// DELETE /api/careers/:id - Delete an application (SuperAdmin only)
router.delete('/:id', protect, deleteApplication);

module.exports = router;

