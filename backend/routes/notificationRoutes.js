const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// SuperAdmin Real-Time Notifications
router.get('/admin/notifications', protect, authorize('admin'), notificationController.getAdminNotifications);

// Affiliate Announcements
// GET is accessible by authenticated affiliates and admins
router.get('/affiliate-announcements', notificationController.getAffiliateAnnouncements);
// POST & DELETE are protected for SuperAdmin
router.post('/affiliate-announcements', protect, authorize('admin'), notificationController.createAffiliateAnnouncement);
router.delete('/affiliate-announcements/:id', protect, authorize('admin'), notificationController.deleteAffiliateAnnouncement);

module.exports = router;
