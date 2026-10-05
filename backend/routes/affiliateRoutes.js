const express = require('express');
const router = express.Router();
const affiliateController = require('../controllers/affiliateController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to track referral clicks
router.post('/track-click', affiliateController.trackClick);

// -------------------------------------------------------------
// AFFILIATE PORTAL ROUTES (Role: affiliate)
// -------------------------------------------------------------
router.get(['/dashboard', '/portal/dashboard'], protect, authorize('affiliate'), affiliateController.getAffiliateDashboard);
router.put(['/payout-settings', '/portal/payout-settings'], protect, authorize('affiliate'), affiliateController.updatePayoutSettings);
router.get(['/payouts', '/portal/payouts'], protect, authorize('affiliate'), affiliateController.getAffiliatePayouts);

// Shared /leads route based on authenticated role
router.get(['/leads', '/portal/leads'], protect, (req, res, next) => {
  if (req.user && req.user.role === 'affiliate') {
    return affiliateController.getAffiliateLeads(req, res, next);
  }
  if (req.user && req.user.role === 'admin') {
    return affiliateController.getAllAffiliateLeadsForAdmin(req, res, next);
  }
  return res.status(403).json({ success: false, message: 'Unauthorized' });
});

router.post(['/leads', '/portal/leads'], protect, authorize('affiliate'), affiliateController.createAffiliateLead);

// -------------------------------------------------------------
// SUPERADMIN MANAGEMENT ROUTES (Role: admin)
// -------------------------------------------------------------
router.post('/', protect, authorize('admin'), affiliateController.createAffiliate);
router.get('/', protect, authorize('admin'), affiliateController.getAllAffiliates);
router.put('/leads/:leadId', protect, authorize('admin'), affiliateController.updateLeadByAdmin);
router.put('/:id', protect, authorize('admin'), affiliateController.updateAffiliate);
router.delete('/:id', protect, authorize('admin'), affiliateController.deleteAffiliate);
router.post('/:id/payout', protect, authorize('admin'), affiliateController.recordPayoutByAdmin);

module.exports = router;
