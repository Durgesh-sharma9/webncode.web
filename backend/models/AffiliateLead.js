const mongoose = require('mongoose');

/**
 * AffiliateLead Schema
 * Tracks schools/clients submitted by affiliates or coming through referral links
 */
const affiliateLeadSchema = new mongoose.Schema(
  {
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Affiliate',
      required: true
    },
    organizationName: {
      type: String,
      required: [true, 'School or Organization name is required'],
      trim: true
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    city: {
      type: String,
      default: '',
      trim: true
    },
    product: {
      type: String,
      default: 'School ERP Pro'
    },
    products: [{
      type: String
    }],
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Demo Scheduled', 'In Negotiation', 'Deal Won', 'Lost'],
      default: 'New'
    },
    dealValue: {
      type: Number,
      default: 0
    },
    commissionAmount: {
      type: Number,
      default: 0
    },
    commissionStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Paid'],
      default: 'Pending'
    },
    source: {
      type: String,
      enum: ['manual_by_affiliate', 'website_referral_link'],
      default: 'manual_by_affiliate'
    },
    notes: {
      type: String,
      default: ''
    },
    rejectionReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AffiliateLead', affiliateLeadSchema);
