const User = require('../models/User');
const Affiliate = require('../models/Affiliate');
const AffiliateLead = require('../models/AffiliateLead');
const AffiliatePayout = require('../models/AffiliatePayout');
const nodemailer = require('nodemailer');
const { createTransporter, getFromAddress } = require('../config/mailer');

/**
 * Configure Nodemailer Transporter using SMTP
 */
const transporter = createTransporter();

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
    const affiliates = await Affiliate.find().sort({ createdAt: -1 });

    // Compute metrics for each affiliate
    const enriched = await Promise.all(
      affiliates.map(async (aff) => {
        const leads = await AffiliateLead.find({ affiliate: aff._id });
        const totalLeads = leads.length;
        const wonLeads = leads.filter((l) => l.status === 'Deal Won');
        const dealsWon = wonLeads.length;

        // Total commissions earned on closed deals
        const totalEarned = wonLeads.reduce((acc, curr) => acc + (curr.commissionAmount || 0), 0);

        // Total payouts already disbursed
        const payouts = await AffiliatePayout.find({ affiliate: aff._id });
        const totalPaid = payouts.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        const pendingPayout = Math.max(0, totalEarned - totalPaid);

        return {
          ...aff.toObject(),
          stats: {
            clicks: aff.clicksCount || 0,
            totalLeads,
            dealsWon,
            totalEarned,
            totalPaid,
            pendingPayout
          }
        };
      })
    );

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
    const { status, dealValue, commissionAmount, commissionStatus, notes, rejectionReason } = req.body;

    const lead = await AffiliateLead.findById(leadId).populate('affiliate');
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (status) lead.status = status;
    if (dealValue !== undefined) lead.dealValue = Number(dealValue);

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
    } else if (status === 'Lost') {
      // If deal cancelled/lost
      lead.commissionAmount = 0;
      lead.commissionStatus = 'Pending';
      if (rejectionReason !== undefined) lead.rejectionReason = rejectionReason;
    }

    if (commissionAmount !== undefined) lead.commissionAmount = Number(commissionAmount);
    if (commissionStatus) lead.commissionStatus = commissionStatus;
    if (notes !== undefined) lead.notes = notes;
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

    // Mark approved leads up to this amount as 'Paid'
    await AffiliateLead.updateMany(
      { affiliate: affiliate._id, status: 'Deal Won', commissionStatus: 'Approved' },
      { commissionStatus: 'Paid' }
    );

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
          bankDetails: affiliate.bankDetails
        },
        stats: {
          clicks: affiliate.clicksCount || 0,
          totalLeads,
          dealsWon,
          totalEarned,
          totalPaid,
          pendingWithdrawal,
          availableBalance
        },
        recentLeads: leads.slice(0, 5)
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

    const { organizationName, contactPerson, phone, email, city, product, notes, estimatedValue } = req.body;

    if (!organizationName || !contactPerson || !phone) {
      return res.status(400).json({
        success: false,
        message: 'School/Organization name, contact person, and phone are required'
      });
    }

    const estValue = Number(estimatedValue) || 0;
    const projectedCommission = estValue > 0 ? Math.round((estValue * affiliate.commissionRate) / 100) : 0;

    const lead = await AffiliateLead.create({
      affiliate: affiliate._id,
      organizationName: organizationName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : '',
      city: city ? city.trim() : '',
      product: product || 'School ERP Pro',
      dealValue: estValue,
      commissionAmount: projectedCommission,
      status: 'New',
      source: 'manual_by_affiliate',
      notes: notes || ''
    });

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
 * Affiliate: Update Bank & UPI Payout details
 * PUT /api/affiliate-portal/payout-settings
 */
exports.updatePayoutSettings = async (req, res) => {
  try {
    const affiliate = await getAffiliateForUser(req.user.id);
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    }

    const { upiId, accountHolder, accountNumber, ifscCode, bankName } = req.body;

    affiliate.bankDetails = {
      upiId: upiId !== undefined ? upiId.trim() : affiliate.bankDetails.upiId,
      accountHolder: accountHolder !== undefined ? accountHolder.trim() : affiliate.bankDetails.accountHolder,
      accountNumber: accountNumber !== undefined ? accountNumber.trim() : affiliate.bankDetails.accountNumber,
      ifscCode: ifscCode !== undefined ? ifscCode.trim() : affiliate.bankDetails.ifscCode,
      bankName: bankName !== undefined ? bankName.trim() : affiliate.bankDetails.bankName
    };

    await affiliate.save();

    res.status(200).json({
      success: true,
      message: 'Payout banking details updated successfully',
      data: affiliate.bankDetails
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

    const { amount, paymentMethod, notes } = req.body;
    const reqAmount = Number(amount);

    if (!reqAmount || reqAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid withdrawal amount' });
    }

    if (reqAmount < 500) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal amount is ₹500' });
    }

    // Check bank / UPI configuration
    const hasUpi = affiliate.bankDetails && affiliate.bankDetails.upiId && affiliate.bankDetails.upiId.trim();
    const hasBank = affiliate.bankDetails && affiliate.bankDetails.accountNumber && affiliate.bankDetails.accountNumber.trim();

    if (!hasUpi && !hasBank) {
      return res.status(400).json({
        success: false,
        message: 'Please configure your UPI ID or Bank Account in "Bank & UPI Settings" before requesting withdrawal.'
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

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted! We will verify your details and disburse payment within 24 hours.',
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

    // Mark approved leads for this affiliate as Paid
    await AffiliateLead.updateMany(
      { affiliate: payout.affiliate?._id || payout.affiliate, status: 'Deal Won', commissionStatus: 'Approved' },
      { commissionStatus: 'Paid' }
    );

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
