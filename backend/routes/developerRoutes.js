const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getAllDevelopers,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper
} = require('../controllers/developerController');
const { protect } = require('../middleware/authMiddleware');

// Multer memory storage configuration for photo buffers
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max photo size
  }
});

const devUpload = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'hoverPhoto', maxCount: 1 }
]);

/**
 * Developer Routes
 * Base path: /api/developers
 */

// GET /api/developers - Public: List all developers
router.get('/', getAllDevelopers);

// POST /api/developers - Protected: Add developer with photo & hoverPhoto upload
router.post('/', protect, devUpload, createDeveloper);

// PUT /api/developers/:id - Protected: Edit developer & optionally upload new photos
router.put('/:id', protect, devUpload, updateDeveloper);

// DELETE /api/developers/:id - Protected: Delete developer
router.delete('/:id', protect, deleteDeveloper);

module.exports = router;
