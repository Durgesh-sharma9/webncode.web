const express = require('express');
const router = express.Router();
const { submitApplication } = require('../controllers/careerController');

/**
 * Career Application Routes
 * Base path: /api/careers
 */

// POST /api/careers - Submit a new career application
router.post('/', submitApplication);

module.exports = router;
