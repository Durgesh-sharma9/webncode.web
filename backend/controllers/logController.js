const ActivityLog = require('../models/ActivityLog');
const AffiliateLead = require('../models/AffiliateLead');
const AffiliatePayout = require('../models/AffiliatePayout');
const Affiliate = require('../models/Affiliate');
const AffiliateAnnouncement = require('../models/AffiliateAnnouncement');
const Application = require('../models/Application');
const Contact = require('../models/Contact');

/**
 * Helper to record a new log programmatically from any controller
 */
exports.logActivity = async ({
  type,
  category = 'system',
  title,
  description = '',
  actor = { name: 'Super Admin', role: 'admin' },
  entityId = '',
  entityType = '',
  metadata = {}
}) => {
  try {
    return await ActivityLog.create({
      type,
      category,
      title,
      description,
      actor,
      entityId: String(entityId),
      entityType,
      metadata,
      createdAt: new Date()
    });
  } catch (err) {
    console.error('Failed to write activity log:', err);
    return null;
  }
};

/**
 * GET /api/logs
 * Retrieve all logs, dynamically synthesizing past activities across all collections
 */
exports.getLogs = async (req, res) => {
  try {
    const {
      category = 'all',
      actorRole = 'all',
      search = '',
      timeRange = 'all',
      limit = 200
    } = req.query;

    // 1. Fetch persisted activity logs
    const storedLogs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 200)
      .lean();

    // 2. Synthesize historical records from database collections so admin has full visibility from day 1
    const synthesizedLogs = [];

    // A. Leads & Deals History
    const leads = await AffiliateLead.find()
      .populate('affiliate', 'name email referralCode')
      .sort({ createdAt: -1 })
      .lean();

    leads.forEach((l) => {
      const partnerName = l.affiliate?.name || 'Partner';
      const partnerCode = l.affiliate?.referralCode || '';
      const products = Array.isArray(l.products) && l.products.length > 0 ? l.products.join(', ') : (l.product || 'Software');

      // Lead Submission Log
      synthesizedLogs.push({
        _id: `synth-lead-created-${l._id}`,
        type: 'LEAD_SUBMITTED',
        category: 'leads',
        title: `Client Lead Submitted: ${l.organizationName}`,
        description: `Partner ${partnerName} (${partnerCode}) registered lead for ${l.organizationName} in ${l.city || 'Unspecified'}. Products: ${products}.`,
        actor: {
          name: partnerName,
          role: 'affiliate',
          email: l.affiliate?.email || '',
          id: String(l.affiliate?._id || '')
        },
        entityId: String(l._id),
        entityType: 'lead',
        metadata: {
          organizationName: l.organizationName,
          contactPerson: l.contactPerson,
          phone: l.phone,
          city: l.city,
          products,
          dealValue: l.dealValue || 0,
          status: l.status
        },
        createdAt: l.createdAt || new Date()
      });

      // Lead Confirmed / Reported by Affiliate
      if (l.status === 'Deal Confirmed' || (l.dealReportedAt && l.status === 'Deal Won')) {
        synthesizedLogs.push({
          _id: `synth-lead-reported-${l._id}`,
          type: 'PURCHASE_REPORTED',
          category: 'leads',
          title: `School Purchase Reported: ${l.organizationName}`,
          description: `Partner ${partnerName} reported that client agreed to purchase. Awaiting Super Admin review and plan verification.`,
          actor: {
            name: partnerName,
            role: 'affiliate',
            email: l.affiliate?.email || '',
            id: String(l.affiliate?._id || '')
          },
          entityId: String(l._id),
          entityType: 'lead',
          metadata: {
            organizationName: l.organizationName,
            products,
            reportedPlan: l.reportedPlan || ''
          },
          createdAt: l.dealReportedAt || l.updatedAt || l.createdAt
        });
      }

      // Deal Won / Closed & Approved by Super Admin
      if (l.status === 'Deal Won') {
        synthesizedLogs.push({
          _id: `synth-lead-won-${l._id}`,
          type: 'DEAL_WON',
          category: 'leads',
          title: `Deal Approved & Won: ${l.organizationName}`,
          description: `Super Admin confirmed closed sale of ₹${(l.dealValue || 0).toLocaleString('en-IN')}. Partner commission of ₹${(l.commissionAmount || 0).toLocaleString('en-IN')} credited to ${partnerName}.`,
          actor: {
            name: 'Super Admin',
            role: 'admin',
            email: 'admin@webncode.in',
            id: 'admin'
          },
          entityId: String(l._id),
          entityType: 'lead',
          metadata: {
            organizationName: l.organizationName,
            products,
            dealValue: l.dealValue || 0,
            commissionAmount: l.commissionAmount || 0,
            soldPlans: l.soldPlans || []
          },
          createdAt: l.dealWonAt || l.updatedAt || l.createdAt
        });
      }

      // Deal Lost / Cancelled
      if (l.status === 'Lost') {
        synthesizedLogs.push({
          _id: `synth-lead-lost-${l._id}`,
          type: 'LEAD_LOST',
          category: 'leads',
          title: `Lead Cancelled: ${l.organizationName}`,
          description: `Lead closed as lost/cancelled.${l.rejectionReason ? ` Reason: ${l.rejectionReason}` : ''}`,
          actor: {
            name: 'Super Admin',
            role: 'admin'
          },
          entityId: String(l._id),
          entityType: 'lead',
          metadata: {
            organizationName: l.organizationName,
            reason: l.rejectionReason
          },
          createdAt: l.updatedAt || l.createdAt
        });
      }
    });

    // B. Financial & Payout History
    const payouts = await AffiliatePayout.find()
      .populate('affiliate', 'name email referralCode')
      .sort({ createdAt: -1 })
      .lean();

    payouts.forEach((p) => {
      const partnerName = p.affiliate?.name || 'Partner';
      
      // Withdrawal Request
      synthesizedLogs.push({
        _id: `synth-payout-req-${p._id}`,
        type: 'WITHDRAWAL_REQUEST',
        category: 'financial',
        title: `Withdrawal Requested: ₹${(p.amount || 0).toLocaleString('en-IN')}`,
        description: `Partner ${partnerName} submitted payout request of ₹${(p.amount || 0).toLocaleString('en-IN')} via ${p.paymentMethod || 'Bank / UPI'}.`,
        actor: {
          name: partnerName,
          role: 'affiliate',
          email: p.affiliate?.email || '',
          id: String(p.affiliate?._id || '')
        },
        entityId: String(p._id),
        entityType: 'payout',
        metadata: {
          amount: p.amount || 0,
          paymentMethod: p.paymentMethod,
          status: p.status
        },
        createdAt: p.requestedAt || p.createdAt
      });

      // Payout Completed / Transferred
      if (p.status === 'paid' || p.status === 'completed') {
        synthesizedLogs.push({
          _id: `synth-payout-paid-${p._id}`,
          type: 'PAYOUT_TRANSFERRED',
          category: 'financial',
          title: `Payout Transferred: ₹${(p.amount || 0).toLocaleString('en-IN')}`,
          description: `Super Admin disbursed payment of ₹${(p.amount || 0).toLocaleString('en-IN')} to ${partnerName}.${p.transactionReference ? ` Ref: ${p.transactionReference}` : ''}`,
          actor: {
            name: 'Super Admin',
            role: 'admin'
          },
          entityId: String(p._id),
          entityType: 'payout',
          metadata: {
            amount: p.amount || 0,
            partnerName,
            transactionReference: p.transactionReference
          },
          createdAt: p.processedAt || p.updatedAt || p.createdAt
        });
      }
    });

    // C. Partner Onboarding History
    const affiliates = await Affiliate.find().sort({ createdAt: -1 }).lean();
    affiliates.forEach((a) => {
      synthesizedLogs.push({
        _id: `synth-aff-reg-${a._id}`,
        type: 'PARTNER_ONBOARDED',
        category: 'partners',
        title: `Partner Onboarded: ${a.name}`,
        description: `New affiliate partner onboarded with code ${a.referralCode}. Payout mode: ${a.payoutType === 'fixed' ? `Flat ₹${a.fixedAmount}` : `${a.commissionRate}%`}.`,
        actor: {
          name: 'Super Admin',
          role: 'admin'
        },
        entityId: String(a._id),
        entityType: 'affiliate',
        metadata: {
          name: a.name,
          email: a.email,
          referralCode: a.referralCode,
          phone: a.phone
        },
        createdAt: a.createdAt
      });
    });

    // D. Announcements & Broadcasts History
    const announcements = await AffiliateAnnouncement.find().sort({ createdAt: -1 }).lean();
    announcements.forEach((an) => {
      synthesizedLogs.push({
        _id: `synth-broadcast-${an._id}`,
        type: 'BROADCAST_SENT',
        category: 'broadcast',
        title: `Broadcast Dispatched: ${an.title}`,
        description: `Super Admin broadcasted notification to ${an.targetRole || 'all partners'}: "${an.message.slice(0, 100)}..."`,
        actor: {
          name: 'Super Admin',
          role: 'admin'
        },
        entityId: String(an._id),
        entityType: 'announcement',
        metadata: {
          title: an.title,
          type: an.type,
          urgency: an.type
        },
        createdAt: an.createdAt
      });
    });

    // E. Careers / Applications History
    const applications = await Application.find().sort({ createdAt: -1 }).limit(50).lean();
    applications.forEach((ap) => {
      synthesizedLogs.push({
        _id: `synth-job-${ap._id}`,
        type: 'JOB_APPLICATION',
        category: 'careers',
        title: `Career Application: ${ap.fullName || 'Candidate'}`,
        description: `Candidate submitted application for ${ap.position || 'Open Role'} (${ap.email || ''}).`,
        actor: {
          name: ap.fullName || 'Applicant',
          role: 'client',
          email: ap.email
        },
        entityId: String(ap._id),
        entityType: 'application',
        metadata: {
          position: ap.position,
          phone: ap.phone
        },
        createdAt: ap.createdAt
      });
    });

    // F. Contact Inquiries History
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(50).lean();
    contacts.forEach((co) => {
      synthesizedLogs.push({
        _id: `synth-contact-${co._id}`,
        type: 'CONTACT_INQUIRY',
        category: 'system',
        title: `Website Inquiry: ${co.name || 'Visitor'}`,
        description: `Inquiry received on website: "${co.subject || co.message?.slice(0, 80) || ''}"`,
        actor: {
          name: co.name || 'Visitor',
          role: 'client',
          email: co.email
        },
        entityId: String(co._id),
        entityType: 'contact',
        metadata: {
          subject: co.subject,
          phone: co.phone
        },
        createdAt: co.createdAt
      });
    });

    // 3. Merge stored logs & synthesized logs
    // Filter out duplicates (if stored log already exists with same entityId and type)
    const storedEntityKeys = new Set(
      storedLogs.map((sl) => `${sl.entityId}-${sl.type}`)
    );

    const mergedLogs = [
      ...storedLogs,
      ...synthesizedLogs.filter((sl) => !storedEntityKeys.has(`${sl.entityId}-${sl.type}`))
    ];

    // 4. Sort strictly chronologically descending
    mergedLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 5. Apply filters
    let filtered = mergedLogs;

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter((l) => l.category === category);
    }

    // Actor Role filter
    if (actorRole !== 'all') {
      filtered = filtered.filter((l) => l.actor?.role === actorRole);
    }

    // Time Range filter
    if (timeRange !== 'all') {
      const now = new Date();
      let cutoff = new Date();
      if (timeRange === 'today') {
        cutoff.setHours(0, 0, 0, 0);
      } else if (timeRange === 'week') {
        cutoff.setDate(now.getDate() - 7);
      } else if (timeRange === 'month') {
        cutoff.setMonth(now.getMonth() - 1);
      }
      filtered = filtered.filter((l) => new Date(l.createdAt) >= cutoff);
    }

    // Search query filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((l) => {
        const title = (l.title || '').toLowerCase();
        const desc = (l.description || '').toLowerCase();
        const actorName = (l.actor?.name || '').toLowerCase();
        const actorEmail = (l.actor?.email || '').toLowerCase();
        const entityId = (l.entityId || '').toLowerCase();
        return (
          title.includes(q) ||
          desc.includes(q) ||
          actorName.includes(q) ||
          actorEmail.includes(q) ||
          entityId.includes(q)
        );
      });
    }

    // KPI counts
    const counts = {
      total: mergedLogs.length,
      leads: mergedLogs.filter((l) => l.category === 'leads').length,
      financial: mergedLogs.filter((l) => l.category === 'financial').length,
      partners: mergedLogs.filter((l) => l.category === 'partners').length,
      broadcast: mergedLogs.filter((l) => l.category === 'broadcast').length,
      careers: mergedLogs.filter((l) => l.category === 'careers').length,
      uniqueActors: new Set(mergedLogs.map((l) => l.actor?.name).filter(Boolean)).size
    };

    return res.status(200).json({
      success: true,
      counts,
      count: filtered.length,
      data: filtered.slice(0, Number(limit) || 200)
    });
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve system activity logs'
    });
  }
};

/**
 * POST /api/logs
 * Manually post a custom audit log entry
 */
exports.createLog = async (req, res) => {
  try {
    const { type, category, title, description, metadata } = req.body;
    if (!type || !title) {
      return res.status(400).json({ success: false, message: 'Type and Title are required' });
    }

    const log = await ActivityLog.create({
      type,
      category: category || 'system',
      title,
      description: description || '',
      actor: {
        name: req.user?.name || 'Super Admin',
        role: req.user?.role || 'admin',
        email: req.user?.email || '',
        id: String(req.user?._id || '')
      },
      metadata: metadata || {},
      createdAt: new Date()
    });

    return res.status(201).json({ success: true, data: log });
  } catch (err) {
    console.error('Error creating activity log:', err);
    return res.status(500).json({ success: false, message: 'Failed to create log entry' });
  }
};
