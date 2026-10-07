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
router.post(['/request-payout', '/portal/request-payout'], protect, authorize('affiliate'), affiliateController.requestPayoutByAffiliate);

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

// Lead update and delete for both Affiliate and Admin
router.put(['/leads/:leadId', '/portal/leads/:leadId'], protect, (req, res, next) => {
  if (req.user && req.user.role === 'affiliate') {
    return affiliateController.updateLeadByAffiliate(req, res, next);
  }
  if (req.user && req.user.role === 'admin') {
    return affiliateController.updateLeadByAdmin(req, res, next);
  }
  return res.status(403).json({ success: false, message: 'Unauthorized' });
});

router.delete(['/leads/:leadId', '/portal/leads/:leadId'], protect, (req, res, next) => {
  if (req.user && (req.user.role === 'affiliate' || req.user.role === 'admin')) {
    return affiliateController.deleteLeadByAffiliate(req, res, next);
  }
  return res.status(403).json({ success: false, message: 'Unauthorized' });
});

// -------------------------------------------------------------
// SUPERADMIN MANAGEMENT ROUTES (Role: admin)
// -------------------------------------------------------------
router.post('/', protect, authorize('admin'), affiliateController.createAffiliate);
router.get('/', protect, authorize('admin'), affiliateController.getAllAffiliates);
router.put('/:id', protect, authorize('admin'), affiliateController.updateAffiliate);
router.delete('/:id', protect, authorize('admin'), affiliateController.deleteAffiliate);
router.post('/:id/payout', protect, authorize('admin'), affiliateController.recordPayoutByAdmin);
router.post('/:id/impersonate', protect, authorize('admin'), affiliateController.impersonateAffiliate);

// SuperAdmin Payout Requests Management
router.get('/payout-requests', protect, authorize('admin'), affiliateController.getAllPayoutRequestsForAdmin);
router.put('/payout-requests/:payoutId/confirm', protect, authorize('admin'), affiliateController.confirmPayoutRequestByAdmin);
router.put('/payout-requests/:payoutId/reject', protect, authorize('admin'), affiliateController.rejectPayoutRequestByAdmin);

// -------------------------------------------------------------
// PRODUCT PLANS & PRICING ROUTES
// -------------------------------------------------------------
router.get(['/plans', '/portal/plans'], affiliateController.getAllPlans);
router.post('/plans', protect, authorize('admin'), affiliateController.createPlan);
router.put('/plans/:id', protect, authorize('admin'), affiliateController.updatePlan);
router.delete('/plans/:id', protect, authorize('admin'), affiliateController.deletePlan);

// -------------------------------------------------------------
// DISCOUNT COUPON ROUTES
// -------------------------------------------------------------
router.get('/coupons', protect, authorize('admin'), affiliateController.getAllCouponsForAdmin);
router.post('/coupons', protect, authorize('admin'), affiliateController.createCouponByAdmin);
router.put('/coupons/:id', protect, authorize('admin'), affiliateController.updateCouponByAdmin);
router.delete('/coupons/:id', protect, authorize('admin'), affiliateController.deleteCouponByAdmin);

// Affiliate & validation coupon routes
router.get(['/portal/coupons', '/my-coupons'], protect, authorize('affiliate', 'admin'), affiliateController.getAffiliateCoupons);
router.post('/coupons/validate', protect, affiliateController.validateCoupon);

module.exports = router;
