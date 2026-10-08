const User = require('../models/User');
const Affiliate = require('../models/Affiliate');
const AffiliateLead = require('../models/AffiliateLead');
const AffiliatePayout = require('../models/AffiliatePayout');
const ProductPlan = require('../models/ProductPlan');
const AffiliateCoupon = require('../models/AffiliateCoupon');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { createTransporter, getFromAddress } = require('../config/mailer');

/**
 * Helper to generate JWT token for stealth impersonation
 */
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'webncode_super_secret_jwt_key_2026_x89f';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * Configure Nodemailer Transporter using SMTP
 */
const transporter = createTransporter();
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'durgesh.csai@gmail.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://webncode.in';

/**
 * Helper to dispatch notification emails to Admin (durgesh.csai@gmail.com)
 */
const sendAdminNotification = async (subject, htmlContent) => {
  try {
    const mailOptions = {
      from: getFromAddress(),
      to: ADMIN_NOTIFICATION_EMAIL,
      subject,
      html: htmlContent
    };
    await transporter.sendMail(mailOptions);
    console.log(`[Admin Alert] Email sent to ${ADMIN_NOTIFICATION_EMAIL}: ${subject}`);
  } catch (err) {
    console.warn(`[Admin Alert Warning] Could not send email notification:`, err.message);
  }
};

// =========================================================================
// PUBLIC METHODS
// =========================================================================

/**
 * Track referral link click
 * POST /api/affiliates/track-click
 */
exports.trackClick = async (req, res) => {
  try {
    const { referralCode } = req.body;
    if (!referralCode) {
      return res.status(400).json({ success: false, message: 'Referral code is required' });
    }

    const code = referralCode.trim().toUpperCase();
    const affiliate = await Affiliate.findOneAndUpdate(
      { referralCode: code, status: 'active' },
      { $inc: { clicksCount: 1 } },
      { new: true }
    );

    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive referral code' });
    }

    return res.status(200).json({ success: true, message: 'Click tracked' });
  } catch (error) {
    console.error('Track click error:', error);
    return res.status(500).json({ success: false, message: 'Failed to track click', error: error.message });
  }
};

// =========================================================================
// SUPERADMIN METHODS
// =========================================================================

/**
 * SuperAdmin: Create a new Affiliate
 * POST /api/affiliates
 */
exports.createAffiliate = async (req, res) => {
  try {
    const { name, email, phone, password, payoutType, commissionRate, fixedAmount, referralCode, notes, allowedProducts, sendEmail } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = (referralCode && referralCode.trim())
      ? referralCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '')
      : `WNC-P${Math.floor(1000 + Math.random() * 9000)}`;

    // Check if email already in use
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user account with this email already exists'
      });
    }

    // 1. Create User with role 'affiliate'
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: 'affiliate'
    });

    // 2. Create Affiliate Profile
    const affiliate = await Affiliate.create({
      user: user._id,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      referralCode: cleanCode,
      payoutType: payoutType === 'fixed' ? 'fixed' : 'percentage',
      commissionRate: commissionRate !== undefined ? Number(commissionRate) : 10,
      fixedAmount: fixedAmount !== undefined ? Number(fixedAmount) : 0,
      allowedProducts: Array.isArray(allowedProducts) ? allowedProducts : [],
      notes: notes || '',
      status: 'active'
    });

    // 3. Optional: Send credentials email via Nodemailer
    if (sendEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const loginUrl = `${process.env.FRONTEND_URL || 'https://webncode.in'}/login`;
        const rewardText = affiliate.payoutType === 'fixed' 
          ? `₹${affiliate.fixedAmount} Flat reward per closed project` 
          : `${affiliate.commissionRate}% Commission per closed deal`;

        const mailOptions = {
          from: getFromAddress(),
          to: cleanEmail,
          subject: 'Welcome to Web n Code Partner Program!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #0f172a; border-radius: 8px;">
              <h2 style="color: #0f172a; margin-top: 0;">Welcome, ${name}!</h2>
              <p>You have been onboarded as an official Partner for <strong>Web n Code Technologies</strong>.</p>
              
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${cleanEmail}</p>
                <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
                <p style="margin: 5px 0;"><strong>Reward Model:</strong> ${rewardText}</p>
              </div>

              <p>Log in to your Partner Portal to submit school/client leads and monitor your earnings.</p>
              <p style="margin-top: 25px; font-size: 12px; color: #64748b;">Web n Code Technologies — Code. Innovate. Grow.</p>
            </div>
          `
        };
        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.warn('Affiliate welcome email send notice:', mailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Affiliate onboarded successfully',
      data: affiliate
    });
  } catch (error) {
    console.error('Create affiliate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create affiliate',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Get all Affiliates with computed stats
 * GET /api/affiliates
 */
exports.getAllAffiliates = async (req, res) => {
  try {
    const affiliates = await Affiliate.find().sort({ createdAt: -1 }).lean();
    const allLeads = await AffiliateLead.find().lean();
    const allPayouts = await AffiliatePayout.find().lean();

    // Compute metrics for each affiliate in-memory (100x faster)
    const enriched = affiliates.map((aff) => {
      const affIdStr = String(aff._id);
      const leads = allLeads.filter((l) => String(l.affiliate) === affIdStr);
      const totalLeads = leads.length;
      const wonLeads = leads.filter((l) => l.status === 'Deal Won');
      const dealsWon = wonLeads.length;

      // Total commissions earned on closed deals
      const totalEarned = wonLeads.reduce((acc, curr) => acc + (curr.commissionAmount || 0), 0);

      // Total payouts already disbursed
      const payouts = allPayouts.filter((p) => String(p.affiliate) === affIdStr);
      const totalPaid = payouts.filter((p) => p.status === 'Paid').reduce((acc, curr) => acc + (curr.amount || 0), 0);
      const pendingPayout = payouts.filter((p) => p.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0);
      const availableBalance = Math.max(0, totalEarned - totalPaid - pendingPayout);

      return {
        ...aff,
        stats: {
          clicks: aff.clicksCount || 0,
          totalLeads,
          dealsWon,
          totalEarned,
          totalPaid,
          pendingPayout,
          availableBalance
        }
      };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched
    });
  } catch (error) {
    console.error('Get all affiliates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch affiliates',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Update Affiliate profile, status, or commission
 * PUT /api/affiliates/:id
 */
exports.updateAffiliate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, payoutType, commissionRate, fixedAmount, status, notes, password, allowedProducts } = req.body;

    const affiliate = await Affiliate.findById(id);
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate not found' });
    }

    if (name) affiliate.name = name.trim();
    if (phone !== undefined) affiliate.phone = phone.trim();
    if (payoutType !== undefined) affiliate.payoutType = payoutType === 'fixed' ? 'fixed' : 'percentage';
    if (commissionRate !== undefined) affiliate.commissionRate = Number(commissionRate);
    if (fixedAmount !== undefined) affiliate.fixedAmount = Number(fixedAmount);
    if (allowedProducts !== undefined) affiliate.allowedProducts = Array.isArray(allowedProducts) ? allowedProducts : [];
    if (status) affiliate.status = status;
    if (notes !== undefined) affiliate.notes = notes;

    await affiliate.save();

    // If name or password update requested, update the associated User
    if (name || password) {
      const user = await User.findById(affiliate.user);
      if (user) {
        if (name) user.name = name.trim();
        if (password && password.length >= 6) user.password = password;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Affiliate updated successfully',
      data: affiliate
    });
  } catch (error) {
    console.error('Update affiliate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update affiliate',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Delete an affiliate
 * DELETE /api/affiliates/:id
 */
exports.deleteAffiliate = async (req, res) => {
  try {
    const { id } = req.params;
    const affiliate = await Affiliate.findById(id);
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate not found' });
    }

    // Remove user account
    if (affiliate.user) {
      await User.findByIdAndDelete(affiliate.user);
    }

    await Affiliate.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Affiliate and associated user account deleted successfully'
    });
  } catch (error) {
    console.error('Delete affiliate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete affiliate',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Get leads for an affiliate or all affiliate leads
 * GET /api/affiliates/leads
 */
exports.getAllAffiliateLeadsForAdmin = async (req, res) => {
  try {
    const { affiliateId, status } = req.query;
    const filter = {};
    if (affiliateId) filter.affiliate = affiliateId;
    if (status && status !== 'All') filter.status = status;

    const leads = await AffiliateLead.find(filter)
      .populate('affiliate', 'name email referralCode commissionRate phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Get affiliate leads for admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch affiliate leads',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Update Lead status, dealValue, commission
 * PUT /api/affiliates/leads/:leadId
 */
exports.updateLeadByAdmin = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status, dealValue, commissionAmount, commissionStatus, notes, adminNotes, rejectionReason, appliedCoupon, discountAmount, product, products } = req.body;

    const lead = await AffiliateLead.findById(leadId).populate('affiliate');
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (status) lead.status = status;
    if (dealValue !== undefined) lead.dealValue = Number(dealValue);
    if (product) lead.product = product;
    if (products && Array.isArray(products) && products.length > 0) lead.products = products;
    if (appliedCoupon !== undefined) lead.appliedCoupon = String(appliedCoupon).trim().toUpperCase();
    if (discountAmount !== undefined) lead.discountAmount = Number(discountAmount) || 0;

    // If deal won and no commission set, auto-calculate based on affiliate payout model
    if (status === 'Deal Won') {
      if (commissionAmount !== undefined) {
        lead.commissionAmount = Number(commissionAmount);
      } else if (!lead.commissionAmount || lead.commissionAmount === 0) {
        const aff = lead.affiliate;
        if (aff && aff.payoutType === 'fixed') {
          lead.commissionAmount = Number(aff.fixedAmount || 0);
        } else if (lead.dealValue > 0) {
          const rate = (aff && aff.commissionRate) || 10;
          lead.commissionAmount = Math.round((lead.dealValue * rate) / 100);
        }
      }
      if (!commissionStatus) lead.commissionStatus = 'Approved';
      lead.rejectionReason = ''; // Clear any rejection reason if won

      // If coupon was applied, increment usedCount
      if (lead.appliedCoupon) {
        await AffiliateCoupon.findOneAndUpdate(
          { code: lead.appliedCoupon },
          { $inc: { usedCount: 1 } }
        ).catch(() => {});
      }
    } else if (status === 'Lost') {
      // If deal cancelled/lost
      lead.commissionAmount = 0;
      lead.commissionStatus = 'Pending';
      if (rejectionReason !== undefined) lead.rejectionReason = rejectionReason;
    }

    if (status !== 'Lost' && commissionAmount !== undefined) lead.commissionAmount = Number(commissionAmount);
    if (status !== 'Lost' && commissionStatus) lead.commissionStatus = commissionStatus;
    if (notes !== undefined) lead.notes = notes;
    if (adminNotes !== undefined) lead.adminNotes = adminNotes;
    if (rejectionReason !== undefined) lead.rejectionReason = rejectionReason;

    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      error: error.message
    });
  }
};

/**
 * Helper: Accurately sync lead commission status based on total paid payouts.
 * Ensures leads are only marked 'Paid' if their commission was actually disbursed,
 * otherwise keeps them as 'Approved' (in wallet, ready to withdraw).
 */
const syncAffiliateLeadPayoutStatus = async (affiliateId) => {
  try {
    const payouts = await AffiliatePayout.find({ affiliate: affiliateId, status: 'Paid' });
    let remainingPaid = payouts.reduce((acc, p) => acc + (p.amount || 0), 0);

    const wonLeads = await AffiliateLead.find({ affiliate: affiliateId, status: 'Deal Won' }).sort({ createdAt: 1 });
    for (const lead of wonLeads) {
      const comm = lead.commissionAmount || 0;
      if (comm > 0 && remainingPaid >= comm) {
        lead.commissionStatus = 'Paid';
        remainingPaid -= comm;
      } else {
        lead.commissionStatus = 'Approved';
      }
      await lead.save();
    }
  } catch (err) {
    console.error('Error syncing affiliate lead payout status:', err);
  }
};

/**
 * SuperAdmin: Record a payout transaction
 * POST /api/affiliates/:id/payout
 */
exports.recordPayoutByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, transactionReference, notes } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payout amount is required' });
    }

    const affiliate = await Affiliate.findById(id);
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate not found' });
    }

    const payout = await AffiliatePayout.create({
      affiliate: affiliate._id,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'UPI',
      transactionReference: transactionReference || '',
      notes: notes || '',
      paidAt: new Date()
    });

    // Synchronize lead commission statuses based on actual cumulative paid amount
    await syncAffiliateLeadPayoutStatus(affiliate._id);

    res.status(201).json({
      success: true,
      message: 'Payout recorded successfully',
      data: payout
    });
  } catch (error) {
    console.error('Record payout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payout',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Stealth Impersonate / View as Affiliate
 * POST /api/affiliates/:id/impersonate
 * Completely silent - no emails or alerts sent to the affiliate
 */
exports.impersonateAffiliate = async (req, res) => {
  try {
    const { id } = req.params;
    const affiliate = await Affiliate.findById(id).populate('user');
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate not found' });
    }

    let targetUser = affiliate.user;
    if (!targetUser) {
      targetUser = await User.findOne({ email: affiliate.email });
    }

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'No associated user account found for this affiliate partner'
      });
    }

    // Generate JWT for the affiliate user silently without sending any notification
    const token = generateToken(targetUser._id);

    res.status(200).json({
      success: true,
      message: `Impersonation session established for ${affiliate.name}`,
      token,
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        affiliate: {
          id: affiliate._id,
          referralCode: affiliate.referralCode,
          payoutType: affiliate.payoutType,
          commissionRate: affiliate.commissionRate,
          fixedAmount: affiliate.fixedAmount,
          allowedProducts: affiliate.allowedProducts,
          status: affiliate.status,
          phone: affiliate.phone,
          bankDetails: affiliate.bankDetails
        }
      }
    });
  } catch (error) {
    console.error('Affiliate impersonation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create impersonation session',
      error: error.message
    });
  }
};

// =========================================================================
// AFFILIATE PORTAL METHODS (ROLE: AFFILIATE)
// =========================================================================

/**
 * Helper: Find Affiliate record for currently authenticated user
 */
const getAffiliateForUser = async (userId) => {
  return await Affiliate.findOne({ user: userId });
};

/**
 * Affiliate: Get Dashboard Stats & Overview
 * GET /api/affiliate-portal/dashboard
 */
exports.getAffiliateDashboard = async (req, res) => {
  try {
    const affiliate = await getAffiliateForUser(req.user.id);
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    }

    // Always ensure lead payout statuses accurately match recorded payouts
    await syncAffiliateLeadPayoutStatus(affiliate._id);

    const leads = await AffiliateLead.find({ affiliate: affiliate._id }).sort({ createdAt: -1 });
    const totalLeads = leads.length;
    const wonLeads = leads.filter((l) => l.status === 'Deal Won');
    const dealsWon = wonLeads.length;

    // Commission calculations
    const totalEarned = wonLeads.reduce((acc, curr) => acc + (curr.commissionAmount || 0), 0);
    const payouts = await AffiliatePayout.find({ affiliate: affiliate._id });
    const totalPaid = payouts.filter((p) => p.status === 'Paid').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const pendingWithdrawal = payouts.filter((p) => p.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const availableBalance = Math.max(0, totalEarned - totalPaid - pendingWithdrawal);
    const latestPaidPayout = payouts
      .filter((p) => p.status === 'Paid')
      .sort((a, b) => new Date(b.paidAt || b.updatedAt) - new Date(a.paidAt || a.updatedAt))[0] || null;

    const now = new Date();
    const assignedCoupons = await AffiliateCoupon.find({
      affiliate: affiliate._id,
      isActive: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: now } }
      ]
    }).sort({ createdAt: -1 });

    const activeValidCoupons = assignedCoupons.filter(
      (c) => c.maxUses === 0 || c.usedCount < c.maxUses
    );

    res.status(200).json({
      success: true,
      data: {
        profile: {
          id: affiliate._id,
          name: affiliate.name,
          email: affiliate.email,
          phone: affiliate.phone,
          referralCode: affiliate.referralCode,
          payoutType: affiliate.payoutType || 'percentage',
          commissionRate: affiliate.commissionRate ?? 10,
          fixedAmount: affiliate.fixedAmount ?? 0,
          allowedProducts: affiliate.allowedProducts || [],
          status: affiliate.status,
          bankDetails: affiliate.bankDetails,
          notifications: affiliate.notifications || {
            emailOnDealWon: true,
            emailOnPayout: true,
            monthlySummary: true
          }
        },
        stats: {
          clicks: affiliate.clicksCount || 0,
          totalLeads,
          dealsWon,
          totalEarned,
          totalPaid,
          pendingWithdrawal,
          pendingPayout: pendingWithdrawal,
          availableBalance
        },
        latestPaidPayout: latestPaidPayout ? {
          id: latestPaidPayout._id,
          amount: latestPaidPayout.amount,
          paidAt: latestPaidPayout.paidAt,
          transactionReference: latestPaidPayout.transactionReference,
          paymentMethod: latestPaidPayout.paymentMethod
        } : null,
        recentLeads: leads.slice(0, 5),
        assignedCoupons: activeValidCoupons
      }
    });
  } catch (error) {
    console.error('Get affiliate dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

/**
 * Affiliate: Get their Leads
 * GET /api/affiliate-portal/leads
 */
exports.getAffiliateLeads = async (req, res) => {
  try {
    const affiliate = await getAffiliateForUser(req.user.id);
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    }

    // Always ensure lead payout statuses accurately match recorded payouts
    await syncAffiliateLeadPayoutStatus(affiliate._id);

    const leads = await AffiliateLead.find({ affiliate: affiliate._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Get affiliate leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
      error: error.message
    });
  }
};

const PRODUCT_CATALOG_PRICES = {
  'School ERP Pro': 50000,
  'Attendance Management System': 20000,
  'Timetable Pro': 15000,
  'Result Management System': 15000,
  'Web Builder Pro': 25000,
  'Sports Academy Pro': 30000,
  'Daily Test Pro': 15000,
  'Custom Software / App': 75000
};

const getCatalogPriceForProducts = async (productList) => {
  if (!Array.isArray(productList) || productList.length === 0) return 25000;
  try {
    const allDbPlans = await ProductPlan.find().lean();
    let total = 0;
    for (const item of productList) {
      const clean = String(item).trim().toLowerCase();
      const matched = allDbPlans.find((p) => {
        const fullCombo = `${p.projectName} - ${p.planName}`.toLowerCase();
        const fullCombo2 = `${p.projectName}: ${p.planName}`.toLowerCase();
        return (
          p.planName.toLowerCase() === clean ||
          fullCombo === clean ||
          fullCombo2 === clean ||
          clean.includes(p.planName.toLowerCase()) ||
          p.projectName.toLowerCase() === clean
        );
      });
      if (matched) {
        total += matched.price;
      } else {
        total += (PRODUCT_CATALOG_PRICES[item] || 25000);
      }
    }
    return total > 0 ? total : 25000;
  } catch {
    return productList.reduce((sum, p) => sum + (PRODUCT_CATALOG_PRICES[p] || 25000), 0);
  }
};

/**
 * Affiliate: Manually Submit a New Client Lead
 * POST /api/affiliate-portal/leads
 */
exports.createAffiliateLead = async (req, res) => {
  try {
    const affiliate = await getAffiliateForUser(req.user.id);
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    }

    const { organizationName, contactPerson, phone, email, city, product, products, notes, estimatedValue, appliedCoupon, discountAmount } = req.body;

    if (!organizationName || !contactPerson || !phone) {
      return res.status(400).json({
        success: false,
        message: 'School/Organization name, contact person, and phone are required'
      });
    }

    const productList = Array.isArray(products) && products.length > 0
      ? products
      : (product ? String(product).split(',').map(p => p.trim()).filter(Boolean) : ['School ERP Pro']);
    const productDisplay = productList.length > 0 ? productList.join(', ') : 'School ERP Pro';

    // For new inquiry leads, deal value and commission remain 0 until reviewed & finalized by Admin
    const lead = await AffiliateLead.create({
      affiliate: affiliate._id,
      organizationName: organizationName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : '',
      city: city ? city.trim() : '',
      product: productDisplay,
      products: productList,
      dealValue: 0,
      commissionAmount: 0,
      status: 'New',
      source: 'manual_by_affiliate',
      notes: notes || '',
      appliedCoupon: '',
      discountAmount: 0
    });

    // Notify SuperAdmin via email (durgesh.csai@gmail.com)
    sendAdminNotification(
      `🎯 [Web n Code] New Client Lead: ${organizationName.trim()} (by ${affiliate.name})`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #0f172a; border-radius: 8px;">
          <div style="background-color: #0f172a; color: #ffffff; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 18px;">🎯 New Client Lead Submitted</h2>
          </div>
          <p>Partner <strong>${affiliate.name}</strong> has submitted a new client lead for software purchase.</p>

          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <table style="width: 100%; font-size: 13px; line-height: 1.6;">
              <tr><td style="font-weight: bold; width: 140px; color: #64748b;">School / Client:</td><td><strong>${organizationName.trim()}</strong></td></tr>
              <tr><td style="font-weight: bold; color: #64748b;">Contact Person:</td><td>${contactPerson.trim()}</td></tr>
              <tr><td style="font-weight: bold; color: #64748b;">Phone:</td><td><a href="tel:${phone.trim()}">${phone.trim()}</a></td></tr>
              ${email ? `<tr><td style="font-weight: bold; color: #64748b;">Email:</td><td>${email.trim()}</td></tr>` : ''}
              ${city ? `<tr><td style="font-weight: bold; color: #64748b;">City / Location:</td><td>${city.trim()}</td></tr>` : ''}
              <tr><td style="font-weight: bold; color: #64748b;">Product Pitched:</td><td><strong style="color: #2563eb;">${productDisplay}</strong></td></tr>
              ${finalDealValue > 0 ? `<tr><td style="font-weight: bold; color: #64748b;">Expected Value:</td><td>₹${finalDealValue.toLocaleString('en-IN')}</td></tr>` : ''}
              ${notes ? `<tr><td style="font-weight: bold; color: #64748b;">Partner Note:</td><td><em>"${notes.trim()}"</em></td></tr>` : ''}
              <tr><td style="font-weight: bold; color: #64748b;">Partner:</td><td>${affiliate.name} (${affiliate.email} / ${affiliate.phone})</td></tr>
            </table>
          </div>

          <div style="margin-top: 20px;">
            <a href="${FRONTEND_URL}/admin/affiliates" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px;">Open Admin Panel to Review & Close Deal</a>
          </div>
          <p style="margin-top: 25px; font-size: 11px; color: #94a3b8;">Web n Code Technologies Admin Alert Notification</p>
        </div>
      `
    );

    res.status(201).json({
      success: true,
      message: 'Lead registered successfully! Web n Code team will reach out for the demo.',
      data: lead
    });
  } catch (error) {
    console.error('Create affiliate lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit lead',
      error: error.message
    });
  }
};

/**
 * Affiliate: Manage / Update their own Lead
 * PUT /api/affiliate-portal/leads/:leadId
 */
exports.updateLeadByAffiliate = async (req, res) => {
  try {
    const affiliate = await getAffiliateForUser(req.user.id);
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    }

    const lead = await AffiliateLead.findOne({ _id: req.params.leadId, affiliate: affiliate._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found or unauthorized' });
    }

    const {
      organizationName,
      contactPerson,
      phone,
      email,
      city,
      product,
      products,
      dealValue,
      status,
      notes
    } = req.body;

    if (organizationName !== undefined) lead.organizationName = organizationName.trim();
    if (contactPerson !== undefined) lead.contactPerson = contactPerson.trim();
    if (phone !== undefined) lead.phone = phone.trim();
    if (email !== undefined) lead.email = email.trim();
    if (city !== undefined) lead.city = city.trim();

    if (products && Array.isArray(products) && products.length > 0) {
      lead.products = products;
      lead.product = products.join(', ');
    } else if (product !== undefined && product.trim()) {
      lead.product = product.trim();
      lead.products = [product.trim()];
    }

    if (status !== undefined) {
      const validStatuses = ['New', 'In Discussion', 'Contacted', 'Demo Scheduled', 'In Negotiation', 'Deal Confirmed', 'Deal Won', 'Lost'];
      if (validStatuses.includes(status)) {
        lead.status = status;
        if (status === 'Deal Won' && !lead.commissionStatus) {
          lead.commissionStatus = 'Pending';
        }

        // If affiliate reports school confirmed purchase, notify admin
        if (status === 'Deal Confirmed') {
          sendAdminNotification(
            `🎉 [Approval Required] School Confirmed Purchase: ${lead.organizationName} (Partner: ${affiliate.name})`,
            `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #0f172a; border-radius: 8px;">
                <div style="background-color: #15803d; color: #ffffff; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;">
                  <h2 style="margin: 0; font-size: 18px;">🎉 School Confirmed Order Request!</h2>
                </div>
                <p>Partner <strong>${affiliate.name}</strong> reported that <strong>${lead.organizationName}</strong> has confirmed their software purchase.</p>
                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <p style="margin: 4px 0;"><strong>School / Client:</strong> ${lead.organizationName}</p>
                  <p style="margin: 4px 0;"><strong>Contact:</strong> ${lead.contactPerson} (${lead.phone})</p>
                  <p style="margin: 4px 0;"><strong>Products:</strong> ${lead.product || 'Software'}</p>
                  <p style="margin: 4px 0;"><strong>Expected Value:</strong> ₹${(lead.dealValue || 0).toLocaleString('en-IN')}</p>
                  <p style="margin: 4px 0;"><strong>Partner Commission:</strong> ₹${(lead.commissionAmount || 0).toLocaleString('en-IN')}</p>
                  ${req.body.confirmationNotes ? `<p style="margin: 4px 0; color: #166534;"><strong>Partner Confirmation Note:</strong> "${req.body.confirmationNotes.trim()}"</p>` : ''}
                </div>
                <div style="margin-top: 20px;">
                  <a href="${FRONTEND_URL}/admin/affiliates" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px;">Open Admin Panel to Approve Deal & Credit Commission</a>
                </div>
              </div>
            `
          );
        }
      }
    }

    if (req.body.confirmationNotes !== undefined) {
      lead.confirmationNotes = req.body.confirmationNotes.trim();
    }

    if (notes !== undefined) {
      lead.notes = notes.trim();
    }

    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully!',
      data: lead
    });
  } catch (error) {
    console.error('Update lead by affiliate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      error: error.message
    });
  }
};

/**
 * Affiliate: Delete their own Lead
 * DELETE /api/affiliate-portal/leads/:leadId
 */
exports.deleteLeadByAffiliate = async (req, res) => {
  try {
    const affiliate = await getAffiliateForUser(req.user.id);
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    }

    const lead = await AffiliateLead.findOne({ _id: req.params.leadId, affiliate: affiliate._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found or unauthorized' });
    }

    if (lead.commissionStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete lead with already paid commissions'
      });
    }

    await AffiliateLead.deleteOne({ _id: lead._id });

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead by affiliate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: error.message
    });
  }
};

/**
 * Affiliate: Update Bank & UPI Payout details and Partner Preferences
 * PUT /api/affiliate-portal/payout-settings
 */
exports.updatePayoutSettings = async (req, res) => {
  try {
    const affiliate = await getAffiliateForUser(req.user.id);
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    }

    const {
      primaryMethod,
      upiId,
      accountHolder,
      accountNumber,
      ifscCode,
      bankName,
      accountType,
      phone,
      notifications
    } = req.body;

    affiliate.bankDetails = {
      primaryMethod: primaryMethod || affiliate.bankDetails?.primaryMethod || 'upi',
      upiId: upiId !== undefined ? upiId.trim() : (affiliate.bankDetails?.upiId || ''),
      accountHolder: accountHolder !== undefined ? accountHolder.trim() : (affiliate.bankDetails?.accountHolder || ''),
      accountNumber: accountNumber !== undefined ? accountNumber.trim() : (affiliate.bankDetails?.accountNumber || ''),
      ifscCode: ifscCode !== undefined ? ifscCode.trim().toUpperCase() : (affiliate.bankDetails?.ifscCode || ''),
      bankName: bankName !== undefined ? bankName.trim() : (affiliate.bankDetails?.bankName || ''),
      accountType: accountType || affiliate.bankDetails?.accountType || 'savings'
    };

    if (phone !== undefined) {
      affiliate.phone = phone.trim();
    }

    if (notifications && typeof notifications === 'object') {
      affiliate.notifications = {
        emailOnDealWon: notifications.emailOnDealWon ?? affiliate.notifications?.emailOnDealWon ?? true,
        emailOnPayout: notifications.emailOnPayout ?? affiliate.notifications?.emailOnPayout ?? true,
        monthlySummary: notifications.monthlySummary ?? affiliate.notifications?.monthlySummary ?? true
      };
    }

    await affiliate.save();

    res.status(200).json({
      success: true,
      message: 'Partner settings & payout details updated successfully',
      data: {
        bankDetails: affiliate.bankDetails,
        phone: affiliate.phone,
        notifications: affiliate.notifications
      }
    });
  } catch (error) {
    console.error('Update payout settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payout settings',
      error: error.message
    });
  }
};

/**
 * Affiliate: Get Payout History
 * GET /api/affiliate-portal/payouts
 */
exports.getAffiliatePayouts = async (req, res) => {
  try {
    const affiliate = await getAffiliateForUser(req.user.id);
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    }

    const payouts = await AffiliatePayout.find({ affiliate: affiliate._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payouts.length,
      data: payouts
    });
  } catch (error) {
    console.error('Get affiliate payouts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payout history',
      error: error.message
    });
  }
};

/**
 * Affiliate: Request a payout withdrawal
 * POST /api/affiliate-portal/request-payout
 */
exports.requestPayoutByAffiliate = async (req, res) => {
  try {
    const affiliate = await getAffiliateForUser(req.user.id);
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    }

    const { amount, paymentMethod, notes, upiId, accountNumber, ifscCode, accountHolder, bankName } = req.body;
    const reqAmount = Number(amount);

    if (!reqAmount || reqAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid withdrawal amount' });
    }

    if (reqAmount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal amount is ₹100' });
    }

    // If affiliate passed bank/upi details inline, save them to profile
    if (!affiliate.bankDetails) affiliate.bankDetails = {};
    if (upiId && upiId.trim()) affiliate.bankDetails.upiId = upiId.trim();
    if (accountNumber && accountNumber.trim()) {
      affiliate.bankDetails.accountNumber = accountNumber.trim();
      if (ifscCode) affiliate.bankDetails.ifscCode = ifscCode.trim().toUpperCase();
      if (accountHolder) affiliate.bankDetails.accountHolder = accountHolder.trim();
      if (bankName) affiliate.bankDetails.bankName = bankName.trim();
    }
    if (upiId || accountNumber) {
      await affiliate.save();
    }

    // Check bank / UPI configuration
    const hasUpi = affiliate.bankDetails && affiliate.bankDetails.upiId && affiliate.bankDetails.upiId.trim();
    const hasBank = affiliate.bankDetails && affiliate.bankDetails.accountNumber && affiliate.bankDetails.accountNumber.trim();

    if (!hasUpi && !hasBank) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your UPI ID or Bank Account to receive payment.'
      });
    }

    // Calculate available balance
    const wonLeads = await AffiliateLead.find({ affiliate: affiliate._id, status: 'Deal Won' });
    const totalEarned = wonLeads.reduce((acc, curr) => acc + (curr.commissionAmount || 0), 0);

    const allPayouts = await AffiliatePayout.find({ affiliate: affiliate._id });
    const totalPaid = allPayouts.filter((p) => p.status === 'Paid').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const pendingRequests = allPayouts.filter((p) => p.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const availableBalance = Math.max(0, totalEarned - totalPaid - pendingRequests);

    if (reqAmount > availableBalance) {
      return res.status(400).json({
        success: false,
        message: `Requested amount exceeds your available balance of ₹${availableBalance.toLocaleString('en-IN')}`
      });
    }

    const payoutDetails = hasUpi
      ? `UPI: ${affiliate.bankDetails.upiId}`
      : `Bank: ${affiliate.bankDetails.bankName || 'Bank'} A/C: ${affiliate.bankDetails.accountNumber} (IFSC: ${affiliate.bankDetails.ifscCode})`;

    const payout = await AffiliatePayout.create({
      affiliate: affiliate._id,
      amount: reqAmount,
      paymentMethod: paymentMethod || (hasUpi ? 'UPI' : 'Bank Transfer'),
      payoutDetails,
      status: 'Pending',
      notes: notes || '',
      requestedAt: new Date()
    });

    // Notify SuperAdmin via email (durgesh.csai@gmail.com)
    sendAdminNotification(
      `💸 [Web n Code] New Payout Request: ₹${reqAmount.toLocaleString('en-IN')} by ${affiliate.name}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #0f172a; border-radius: 8px;">
          <div style="background-color: #0f172a; color: #ffffff; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 18px;">💸 New Payout Withdrawal Request (24h Policy)</h2>
          </div>
          <p>Partner <strong>${affiliate.name}</strong> has submitted a request to withdraw commissions.</p>

          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <table style="width: 100%; font-size: 13px; line-height: 1.6;">
              <tr><td style="font-weight: bold; width: 140px; color: #64748b;">Partner Name:</td><td><strong>${affiliate.name}</strong></td></tr>
              <tr><td style="font-weight: bold; color: #64748b;">Phone:</td><td>${affiliate.phone || 'N/A'}</td></tr>
              <tr><td style="font-weight: bold; color: #64748b;">Email:</td><td>${affiliate.email}</td></tr>
              <tr><td style="font-weight: bold; color: #64748b;">Amount Requested:</td><td><strong style="color: #16a34a; font-size: 16px;">₹${reqAmount.toLocaleString('en-IN')}</strong></td></tr>
              <tr><td style="font-weight: bold; color: #64748b;">Beneficiary:</td><td><strong>${payoutDetails}</strong></td></tr>
              <tr><td style="font-weight: bold; color: #64748b;">Payment Method:</td><td>${paymentMethod || (hasUpi ? 'UPI' : 'Bank Transfer')}</td></tr>
              ${notes ? `<tr><td style="font-weight: bold; color: #64748b;">Partner Note:</td><td><em>"${notes.trim()}"</em></td></tr>` : ''}
            </table>
          </div>

          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 6px; font-size: 12px; color: #92400e; margin: 15px 0;">
            ⏰ <strong>24 Hours Action Required:</strong> Please verify details in the admin portal, disburse funds via UPI/Bank, and record the UTR number.
          </div>

          <div style="margin-top: 20px;">
            <a href="${FRONTEND_URL}/admin/affiliates" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px;">Open Admin Panel to Review & Pay</a>
          </div>
          <p style="margin-top: 25px; font-size: 11px; color: #94a3b8;">Web n Code Technologies Admin Alert Notification</p>
        </div>
      `
    );

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted! We will verify your deals and credit funds within 24 to 48 hours.',
      data: payout
    });
  } catch (error) {
    console.error('Request payout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit payout request',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Get all payout requests across all partners
 * GET /api/affiliates/payout-requests
 */
exports.getAllPayoutRequestsForAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;

    const payouts = await AffiliatePayout.find(filter)
      .populate('affiliate', 'name email phone bankDetails payoutType commissionRate fixedAmount')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payouts.length,
      data: payouts
    });
  } catch (error) {
    console.error('Get all payout requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payout requests',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Confirm and disburse a payout request
 * PUT /api/affiliates/payout-requests/:payoutId/confirm
 */
exports.confirmPayoutRequestByAdmin = async (req, res) => {
  try {
    const { payoutId } = req.params;
    const { transactionReference, paymentMethod, notes } = req.body;

    const payout = await AffiliatePayout.findById(payoutId).populate('affiliate');
    if (!payout) {
      return res.status(404).json({ success: false, message: 'Payout request not found' });
    }

    if (payout.status === 'Paid') {
      return res.status(400).json({ success: false, message: 'This payout has already been marked as Paid' });
    }

    payout.status = 'Paid';
    payout.paidAt = new Date();
    if (transactionReference) payout.transactionReference = transactionReference.trim();
    if (paymentMethod) payout.paymentMethod = paymentMethod;
    if (notes) payout.notes = notes;
    await payout.save();

    // Synchronize lead commission statuses based on actual cumulative paid amount
    await syncAffiliateLeadPayoutStatus(payout.affiliate?._id || payout.affiliate);

    res.status(200).json({
      success: true,
      message: `Payment of ₹${payout.amount.toLocaleString('en-IN')} confirmed successfully!`,
      data: payout
    });
  } catch (error) {
    console.error('Confirm payout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payout',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Reject a payout request
 * PUT /api/affiliates/payout-requests/:payoutId/reject
 */
exports.rejectPayoutRequestByAdmin = async (req, res) => {
  try {
    const { payoutId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const payout = await AffiliatePayout.findById(payoutId).populate('affiliate');
    if (!payout) {
      return res.status(404).json({ success: false, message: 'Payout request not found' });
    }

    payout.status = 'Rejected';
    payout.rejectionReason = rejectionReason.trim();
    await payout.save();

    res.status(200).json({
      success: true,
      message: 'Payout request has been rejected and amount released back to partner balance.',
      data: payout
    });
  } catch (error) {
    console.error('Reject payout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject payout request',
      error: error.message
    });
  }
};

// =========================================================================
// PRODUCT PLANS & PRICING MANAGEMENT (SuperAdmin & Affiliate Sync)
// =========================================================================

const DEFAULT_STARTER_PLANS = [
  { projectName: 'School ERP Pro', planName: 'Starter (Up to 500 Students)', price: 25000, billingCycle: 'Yearly', defaultCommissionRate: 15, description: 'Basic student, fees, and attendance management module.' },
  { projectName: 'School ERP Pro', planName: 'Standard Campus (Up to 1500 Students)', price: 50000, billingCycle: 'Yearly', defaultCommissionRate: 15, description: 'Complete school ERP with exam, marksheet, parent portal, and SMS alerts.' },
  { projectName: 'School ERP Pro', planName: 'Enterprise Elite (Unlimited Students)', price: 90000, billingCycle: 'Yearly', defaultCommissionRate: 15, description: 'Multi-branch, dedicated Android/iOS parent app, GPS bus tracking, priority support.' },

  { projectName: 'Web Builder Pro', planName: 'Starter School / Org Website', price: 15000, billingCycle: 'One-time', defaultCommissionRate: 15, description: 'Fast, modern, mobile-responsive institutional website.' },
  { projectName: 'Web Builder Pro', planName: 'Dynamic Institutional CMS Portal', price: 35000, billingCycle: 'Yearly', defaultCommissionRate: 15, description: 'Full CMS with dynamic notice board, gallery, online inquiry, and CMS control panel.' },

  { projectName: 'Timetable Pro', planName: 'Single School Annual License', price: 15000, billingCycle: 'Yearly', defaultCommissionRate: 15, description: 'AI-based automatic teacher-subject clash-free timetable generator.' },
  { projectName: 'Timetable Pro', planName: 'Multi-Campus Chain License', price: 28000, billingCycle: 'Yearly', defaultCommissionRate: 15, description: 'Centralized timetable scheduler for school groups and university campuses.' },

  { projectName: 'Attendance Management System', planName: 'Biometric & RFID Cloud Suite', price: 20000, billingCycle: 'Yearly', defaultCommissionRate: 15, description: 'Automated biometric & RFID hardware integration with instant SMS to parents.' },
  { projectName: 'Result Management System', planName: 'Report Card & Marksheet Generator', price: 15000, billingCycle: 'Yearly', defaultCommissionRate: 15, description: 'CBSE / ICSE / State board grading, tabulations, and printable marksheet generator.' },
  { projectName: 'Sports Academy Pro', planName: 'Sports Academy Annual Suite', price: 30000, billingCycle: 'Yearly', defaultCommissionRate: 15, description: 'Batch scheduling, tournament brackets, fee collection, and player progress tracker.' },
  { projectName: 'Daily Test Pro', planName: 'Online Exam & Mock Test Engine', price: 15000, billingCycle: 'Yearly', defaultCommissionRate: 15, description: 'Question bank, online test portal, timer, and student performance analytics.' },
  { projectName: 'Custom Software / App', planName: 'Bespoke Custom App / ERP', price: 75000, billingCycle: 'Starting', defaultCommissionRate: 10, description: 'Custom full-stack web and mobile application developed for specific institutional needs.' }
];

/**
 * Get all product plans (public / authenticated for affiliate lead submission)
 * GET /api/affiliates/plans
 */
exports.getAllPlans = async (req, res) => {
  try {
    let plans = await ProductPlan.find().sort({ projectName: 1, price: 1 }).lean();

    // Auto-seed default templates if collection is empty
    if (!plans || plans.length === 0) {
      try {
        await ProductPlan.insertMany(DEFAULT_STARTER_PLANS);
        plans = await ProductPlan.find().sort({ projectName: 1, price: 1 }).lean();
      } catch (seedErr) {
        console.warn('Auto seed plans notice:', seedErr.message);
        plans = DEFAULT_STARTER_PLANS;
      }
    }

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    console.error('Get product plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product plans',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Create a new Plan for a Project
 * POST /api/affiliates/plans
 */
exports.createPlan = async (req, res) => {
  try {
    const { projectName, planName, price, billingCycle, defaultCommissionRate, description, features } = req.body;

    if (!projectName || !projectName.trim()) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }
    if (!planName || !planName.trim()) {
      return res.status(400).json({ success: false, message: 'Plan name is required (e.g. Starter, Standard, Enterprise)' });
    }
    if (price === undefined || price === null || isNaN(Number(price))) {
      return res.status(400).json({ success: false, message: 'Valid price in ₹ is required' });
    }

    const cleanProject = projectName.trim();
    const cleanPlan = planName.trim();

    // Check duplicate
    const existing = await ProductPlan.findOne({
      projectName: new RegExp(`^${cleanProject}$`, 'i'),
      planName: new RegExp(`^${cleanPlan}$`, 'i')
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Plan "${cleanPlan}" already exists for project "${cleanProject}". Please choose another plan name or edit the existing one.`
      });
    }

    const newPlan = await ProductPlan.create({
      projectName: cleanProject,
      planName: cleanPlan,
      price: Math.max(0, Number(price)),
      billingCycle: billingCycle || 'Yearly',
      defaultCommissionRate: defaultCommissionRate !== undefined ? Number(defaultCommissionRate) : 15,
      description: (description || '').trim(),
      features: Array.isArray(features) ? features : [],
      status: 'active',
      createdBy: req.user?._id
    });

    res.status(201).json({
      success: true,
      message: `Plan "${newPlan.planName}" created successfully for ${newPlan.projectName}!`,
      data: newPlan
    });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create plan',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Update Plan
 * PUT /api/affiliates/plans/:id
 */
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectName, planName, price, billingCycle, defaultCommissionRate, description, features, status } = req.body;

    const plan = await ProductPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    if (projectName) plan.projectName = projectName.trim();
    if (planName) plan.planName = planName.trim();
    if (price !== undefined) plan.price = Math.max(0, Number(price));
    if (billingCycle) plan.billingCycle = billingCycle;
    if (defaultCommissionRate !== undefined) plan.defaultCommissionRate = Number(defaultCommissionRate);
    if (description !== undefined) plan.description = description.trim();
    if (features !== undefined && Array.isArray(features)) plan.features = features;
    if (status) plan.status = status;

    await plan.save();

    res.status(200).json({
      success: true,
      message: `Plan updated successfully!`,
      data: plan
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update plan',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Delete Plan
 * DELETE /api/affiliates/plans/:id
 */
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await ProductPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    await ProductPlan.deleteOne({ _id: plan._id });

    res.status(200).json({
      success: true,
      message: `Plan "${plan.planName}" deleted successfully.`
    });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete plan',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Get all discount coupons
 * GET /api/affiliates/coupons
 */
exports.getAllCouponsForAdmin = async (req, res) => {
  try {
    const coupons = await AffiliateCoupon.find()
      .populate('affiliate', 'name email referralCode phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    console.error('Get all coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load discount coupons',
      error: error.message
    });
  }
};

/**
 * Affiliate: Get active coupons applicable to logged-in affiliate
 * GET /api/affiliate-portal/coupons
 */
exports.getAffiliateCoupons = async (req, res) => {
  try {
    const affiliate = await getAffiliateForUser(req.user.id);
    if (!affiliate) {
      if (req.user && req.user.role === 'admin') {
        const adminCoupons = await AffiliateCoupon.find({ isActive: true }).sort({ createdAt: -1 });
        return res.json({ success: true, count: adminCoupons.length, data: adminCoupons });
      }
      return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    }

    const now = new Date();
    const query = {
      isActive: true,
      $or: [
        { affiliate: null },
        { affiliate: affiliate._id }
      ],
      $and: [
        {
          $or: [
            { expiryDate: null },
            { expiryDate: { $gt: now } }
          ]
        }
      ]
    };

    const coupons = await AffiliateCoupon.find(query).sort({ createdAt: -1 });

    // Filter out coupons that have reached maxUses
    const validCoupons = coupons.filter(c => c.maxUses === 0 || c.usedCount < c.maxUses);

    res.status(200).json({
      success: true,
      count: validCoupons.length,
      data: validCoupons
    });
  } catch (error) {
    console.error('Get affiliate coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load available coupons',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Create a new discount coupon
 * POST /api/affiliates/coupons
 */
exports.createCouponByAdmin = async (req, res) => {
  try {
    const {
      code,
      discountType = 'percentage',
      discountValue,
      affiliate = null,
      applicableProducts = [],
      maxUses = 0,
      expiryDate = null,
      description = ''
    } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    if (!discountValue || Number(discountValue) <= 0) {
      return res.status(400).json({ success: false, message: 'Discount value must be greater than 0' });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check if coupon code already exists
    const existing = await AffiliateCoupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({ success: false, message: `Coupon code "${cleanCode}" already exists` });
    }

    const coupon = await AffiliateCoupon.create({
      code: cleanCode,
      discountType,
      discountValue: Number(discountValue),
      affiliate: affiliate && affiliate !== 'all' ? affiliate : null,
      applicableProducts: Array.isArray(applicableProducts) ? applicableProducts : [],
      maxUses: Number(maxUses) || 0,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      description: description.trim(),
      isActive: true
    });

    const populatedCoupon = await AffiliateCoupon.findById(coupon._id)
      .populate('affiliate', 'name email referralCode');

    res.status(201).json({
      success: true,
      message: `Coupon "${cleanCode}" created successfully!`,
      data: populatedCoupon
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create discount coupon',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Update coupon
 * PUT /api/affiliates/coupons/:id
 */
exports.updateCouponByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await AffiliateCoupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    const {
      code,
      discountType,
      discountValue,
      affiliate,
      applicableProducts,
      maxUses,
      expiryDate,
      isActive,
      description
    } = req.body;

    if (code && code.trim()) {
      const cleanCode = code.trim().toUpperCase();
      if (cleanCode !== coupon.code) {
        const existing = await AffiliateCoupon.findOne({ code: cleanCode });
        if (existing) {
          return res.status(400).json({ success: false, message: `Coupon code "${cleanCode}" already in use` });
        }
        coupon.code = cleanCode;
      }
    }

    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
    if (affiliate !== undefined) coupon.affiliate = (affiliate && affiliate !== 'all') ? affiliate : null;
    if (applicableProducts !== undefined) coupon.applicableProducts = Array.isArray(applicableProducts) ? applicableProducts : [];
    if (maxUses !== undefined) coupon.maxUses = Number(maxUses) || 0;
    if (expiryDate !== undefined) coupon.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (isActive !== undefined) coupon.isActive = Boolean(isActive);
    if (description !== undefined) coupon.description = description.trim();

    await coupon.save();

    const populatedCoupon = await AffiliateCoupon.findById(coupon._id)
      .populate('affiliate', 'name email referralCode');

    res.status(200).json({
      success: true,
      message: `Coupon "${coupon.code}" updated successfully!`,
      data: populatedCoupon
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update discount coupon',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Delete coupon
 * DELETE /api/affiliates/coupons/:id
 */
exports.deleteCouponByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await AffiliateCoupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    await AffiliateCoupon.deleteOne({ _id: coupon._id });

    res.status(200).json({
      success: true,
      message: `Coupon "${coupon.code}" deleted successfully.`
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete coupon',
      error: error.message
    });
  }
};

/**
 * Validate coupon application
 * POST /api/affiliates/coupons/validate
 */
exports.validateCoupon = async (req, res) => {
  try {
    const { code, affiliateId, products = [], baseAmount = 0 } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await AffiliateCoupon.findOne({ code: cleanCode });

    if (!coupon) {
      return res.status(404).json({ success: false, message: `Coupon code "${cleanCode}" is invalid.` });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: `Coupon "${cleanCode}" is currently inactive.` });
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: `Coupon "${cleanCode}" has expired.` });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: `Coupon "${cleanCode}" usage limit has been reached.` });
    }

    // Check affiliate scope
    if (coupon.affiliate && affiliateId) {
      if (String(coupon.affiliate) !== String(affiliateId)) {
        return res.status(400).json({ success: false, message: `Coupon "${cleanCode}" is not authorized for this affiliate partner.` });
      }
    }

    // Check product scope (fuzzy match so plan names like "Web Builder Pro - Plan A" match "Web Builder Pro")
    let discountBase = Number(baseAmount) || 0;

    if (coupon.applicableProducts && coupon.applicableProducts.length > 0 && products.length > 0) {
      const matchingItems = products.filter((p) => {
        const pLower = String(p).toLowerCase().trim();
        return coupon.applicableProducts.some((appProd) => {
          const appLower = String(appProd).toLowerCase().trim();
          return pLower.includes(appLower) || appLower.includes(pLower);
        });
      });

      if (matchingItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Coupon "${cleanCode}" is only applicable to: ${coupon.applicableProducts.join(', ')}`
        });
      }

      // If only some bundled products match, calculate discount base solely on the matching products
      if (matchingItems.length < products.length) {
        const matchingPrice = await getCatalogPriceForProducts(matchingItems);
        discountBase = matchingPrice;
      }
    }

    // Compute discount amount
    const numBase = Number(baseAmount) || 0;
    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((discountBase * coupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(discountBase, coupon.discountValue);
    }

    const discountedDealValue = Math.max(0, numBase - discountAmount);

    res.status(200).json({
      success: true,
      message: `Coupon "${cleanCode}" applied successfully!`,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        discountedDealValue,
        description: coupon.description
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate coupon',
      error: error.message
    });
  }
};


