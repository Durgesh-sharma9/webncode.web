const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Super Admin Activity Log History Routes
router.get('/', protect, authorize('admin'), logController.getLogs);
router.post('/', protect, authorize('admin'), logController.createLog);

module.exports = router;
