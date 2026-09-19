const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Category Routes
 * Base path: /api/categories
 */

// Public endpoint: Get all categories with dynamic project count
router.get('/', getAllCategories);

// Protected Admin endpoints
router.post('/', protect, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
