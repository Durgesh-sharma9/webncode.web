const AffiliateLead = require('../models/AffiliateLead');
const Application = require('../models/Application');
const AffiliatePayout = require('../models/AffiliatePayout');
const Affiliate = require('../models/Affiliate');
const AffiliateAnnouncement = require('../models/AffiliateAnnouncement');

/**
 * SuperAdmin: Fetch Real-Time Mission Control Notifications
 * Aggregates new leads, purchases reported (bought), job applications, and payout requests
 * GET /api/admin/notifications
 */
exports.getAdminNotifications = async (req, res) => {
  try {
    const notifications = [];

    // 1. SCHOOL PURCHASE REPORTED (Deal Confirmed - Needs Admin Approval)
    const confirmedLeads = await AffiliateLead.find({ status: 'Deal Confirmed' })
      .populate('affiliate', 'name email phone')
      .sort({ updatedAt: -1 })
      .limit(10);

    confirmedLeads.forEach((lead) => {
      notifications.push({
        id: `lead-confirmed-${lead._id}`,
        type: 'deal_bought',
        category: 'Leads & Deals',
        title: `🎉 School Purchase Reported: ${lead.organizationName}`,
        description: `Partner ${lead.affiliate?.name || 'Affiliate'} reported confirmed software purchase. Approval required to credit commission.`,
        meta: `Value: ₹${(lead.dealValue || 0).toLocaleString('en-IN')}`,
        link: '/admin/affiliates',
        priority: 'urgent',
        badge: 'Approval Needed',
        badgeColor: 'bg-amber-300 text-slate-950',
        timestamp: lead.updatedAt || lead.createdAt,
        rawId: lead._id
      });
    });

    // 2. NEW CLIENT LEADS SUBMITTED (Recent inquiry leads)
    const recentLeads = await AffiliateLead.find({ status: { $in: ['New', 'In Discussion'] } })
      .populate('affiliate', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(10);

    recentLeads.forEach((lead) => {
      notifications.push({
        id: `lead-new-${lead._id}`,
        type: 'new_lead',
        category: 'Leads & Deals',
        title: `🎯 New Lead Submitted: ${lead.organizationName}`,
        description: `Products: ${lead.product || 'Software'} pitched by ${lead.affiliate?.name || 'Partner'}.`,
        meta: lead.city ? `City: ${lead.city}` : undefined,
        link: '/admin/affiliates',
        priority: 'normal',
        badge: 'New Lead',
        badgeColor: 'bg-[#86efac] text-slate-950',
        timestamp: lead.createdAt,
        rawId: lead._id
      });
    });

    // 3. PENDING WITHDRAWAL / PAYOUT REQUESTS
    const pendingPayouts = await AffiliatePayout.find({ status: 'Pending' })
      .populate('affiliate', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    pendingPayouts.forEach((p) => {
      notifications.push({
        id: `payout-${p._id}`,
        type: 'payout_request',
        category: 'Leads & Deals',
        title: `💰 Withdrawal Request: ₹${p.amount.toLocaleString('en-IN')}`,
        description: `Partner ${p.affiliate?.name || 'Affiliate'} requested balance withdrawal via ${p.paymentMethod || 'UPI'}.`,
        link: '/admin/affiliates',
        priority: 'urgent',
        badge: 'Pending Payout',
        badgeColor: 'bg-[#fde047] text-slate-950',
        timestamp: p.createdAt,
        rawId: p._id
      });
    });

    // 4. CAREER / JOB RESUME APPLICATIONS
    const recentApplications = await Application.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(10);

    recentApplications.forEach((app) => {
      notifications.push({
        id: `career-${app._id}`,
        type: 'career_application',
        category: 'Careers',
        title: `💼 New Candidate Profile: ${app.fullName}`,
        description: `Applied for ${app.position || 'Software Role'} • Experience: ${app.experience || 'Fresher'}.`,
        meta: `City: ${app.city || 'N/A'}`,
        link: '/admin/careers',
        priority: 'normal',
        badge: 'Candidate Application',
        badgeColor: 'bg-purple-200 text-purple-950',
        timestamp: app.createdAt,
        rawId: app._id
      });
    });

    // 5. PENDING PARTNER REGISTRATIONS
    const pendingAffiliates = await Affiliate.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(5);

    pendingAffiliates.forEach((aff) => {
      notifications.push({
        id: `affiliate-reg-${aff._id}`,
        type: 'partner_registration',
        category: 'Leads & Deals',
        title: `🤝 Partner Application: ${aff.name}`,
        description: `Registered as affiliate partner with code ${aff.referralCode}. Review to activate.`,
        link: '/admin/affiliates',
        priority: 'normal',
        badge: 'Partner Approval',
        badgeColor: 'bg-blue-200 text-blue-950',
        timestamp: aff.createdAt,
        rawId: aff._id
      });
    });

    // Sort all notifications chronologically (newest first)
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Compute urgency metrics
    const urgentCount = notifications.filter((n) => n.priority === 'urgent').length;
    const boughtCount = confirmedLeads.length;
    const newLeadsCount = recentLeads.length;

    res.status(200).json({
      success: true,
      totalCount: notifications.length,
      urgentCount,
      boughtCount,
      newLeadsCount,
      notifications
    });
  } catch (error) {
    console.error('Fetch admin notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin notifications',
      error: error.message
    });
  }
};

/**
 * Public/Affiliate: Get Active Announcements
 * GET /api/affiliate-announcements
 */
exports.getAffiliateAnnouncements = async (req, res) => {
  try {
    const announcements = await AffiliateAnnouncement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    console.error('Fetch announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Broadcast / Create New Announcement for Affiliates
 * POST /api/affiliate-announcements
 */
exports.createAffiliateAnnouncement = async (req, res) => {
  try {
    const { title, message, type, priority, actionLink } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Announcement title and message are required'
      });
    }

    const announcement = await AffiliateAnnouncement.create({
      title: title.trim(),
      message: message.trim(),
      type: type || 'general',
      priority: priority || 'normal',
      actionLink: actionLink ? actionLink.trim() : '',
      isActive: true,
      author: 'Web n Code Management'
    });

    res.status(201).json({
      success: true,
      message: 'Announcement broadcasted successfully to all affiliates!',
      data: announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message
    });
  }
};

/**
 * SuperAdmin: Delete Announcement
 * DELETE /api/affiliate-announcements/:id
 */
exports.deleteAffiliateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await AffiliateAnnouncement.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete announcement',
      error: error.message
    });
  }
};
