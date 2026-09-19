const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createProject,
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  updateProject,
  deleteProject,
  toggleFeatureProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// Multer memory storage configuration for file buffers
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB max file size
  }
});

/**
 * Project Routes
 * Base path: /api/projects
 */

// GET /api/projects - Public: List all projects
router.get('/', getAllProjects);

// GET /api/projects/id/:id - Public: Get project details by MongoDB ObjectId
router.get('/id/:id', getProjectById);

// GET /api/projects/:slug - Public: Get project details by slug or ID
router.get('/:slug', getProjectBySlug);

// POST /api/projects - Protected: Create new project & upload images to ImageKit
router.post('/', protect, upload.array('images', 8), createProject);

// PATCH /api/projects/:id/feature - Protected: Toggle featured status
router.patch('/:id/feature', protect, toggleFeatureProject);

// PUT /api/projects/:id/feature - Protected: Set featured status (alias)
router.put('/:id/feature', protect, toggleFeatureProject);

// PUT /api/projects/:id - Protected: Edit project & add new images
router.put('/:id', protect, upload.array('images', 8), updateProject);

// DELETE /api/projects/:id - Protected: Delete a project
router.delete('/:id', protect, deleteProject);

module.exports = router;
