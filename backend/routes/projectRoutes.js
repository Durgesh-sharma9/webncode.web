const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createProject,
  getAllProjects,
  getProjectBySlug,
  updateProject,
  deleteProject
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

// GET /api/projects/:slug - Public: Get project details
router.get('/:slug', getProjectBySlug);

// POST /api/projects - Protected: Create new project & upload images to ImageKit
router.post('/', protect, upload.array('images', 8), createProject);

// PUT /api/projects/:id - Protected: Edit project & add new images
router.put('/:id', protect, upload.array('images', 8), updateProject);

// DELETE /api/projects/:id - Protected: Delete a project
router.delete('/:id', protect, deleteProject);

module.exports = router;
