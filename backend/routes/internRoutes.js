const express = require('express');
const router = express.Router();
const internController = require('../controllers/internController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route for Certificate Verification (QR Code or Direct URL)
router.get('/verify/:ref', internController.verifyCertificatePublic);

// Admin Protected Routes
router.get('/next-ref', protect, authorize('admin'), internController.getNextReference);
router.get('/', protect, authorize('admin'), internController.getInterns);
router.get('/:id', protect, authorize('admin'), internController.getInternById);
router.post('/', protect, authorize('admin'), internController.createIntern);
router.put('/:id', protect, authorize('admin'), internController.updateIntern);
router.delete('/:id', protect, authorize('admin'), internController.deleteIntern);
router.patch('/:id/status', protect, authorize('admin'), internController.updateCertificateStatus);
router.post('/:id/send-offer-letter', protect, authorize('admin'), internController.sendOfferLetterEmail);
router.post('/:id/send-certificate', protect, authorize('admin'), internController.sendCertificateEmail);

module.exports = router;
