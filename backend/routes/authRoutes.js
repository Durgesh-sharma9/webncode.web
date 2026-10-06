const express = require('express');
const router = express.Router();
const { register, login, getMe, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// POST /api/auth/login - SuperAdmin login & return JWT token
router.post('/login', login);

// GET /api/auth/me - Get current logged-in user profile (Protected)
router.get('/me', protect, getMe);

// PUT /api/auth/update-password - Change user password (Protected)
router.put('/update-password', protect, updatePassword);

module.exports = router;
