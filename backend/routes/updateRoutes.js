const express = require('express');
const router = express.Router();
const {
  getAllUpdates,
  getUpdateBySlugOrId,
  createUpdate,
  updateUpdate,
  deleteUpdate,
  toggleFeaturedUpdate
} = require('../controllers/updateController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Updates & Announcements Routes
 * Base path: /api/updates
 */

// Public routes
router.get('/', getAllUpdates);
router.get('/:slug', getUpdateBySlugOrId);

// Protected Admin routes
router.post('/', protect, createUpdate);
router.put('/:id', protect, updateUpdate);
router.patch('/:id/feature', protect, toggleFeaturedUpdate);
router.put('/:id/feature', protect, toggleFeaturedUpdate);
router.delete('/:id', protect, deleteUpdate);

module.exports = router;
