const mongoose = require('mongoose');

/**
 * Affiliate Schema
 * Stores partner profile, unique referral code, commission rates, and payout info
 */
const affiliateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    referralCode: {
      type: String,
      required: [true, 'Referral code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    payoutType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    commissionRate: {
      type: Number,
      default: 10, // Default 10%
      min: 0,
      max: 100
    },
    fixedAmount: {
      type: Number,
      default: 0, // Flat reward per project/deal in INR
      min: 0
    },
    allowedProducts: {
      type: [String],
      default: [] // Array of product names/slugs this affiliate is authorized to sell
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
    clicksCount: {
      type: Number,
      default: 0
    },
    bankDetails: {
      primaryMethod: { type: String, enum: ['upi', 'bank'], default: 'upi' },
      upiId: { type: String, default: '', trim: true },
      accountHolder: { type: String, default: '', trim: true },
      accountNumber: { type: String, default: '', trim: true },
      ifscCode: { type: String, default: '', trim: true },
      bankName: { type: String, default: '', trim: true },
      accountType: { type: String, enum: ['savings', 'current'], default: 'savings' }
    },
    notifications: {
      emailOnDealWon: { type: Boolean, default: true },
      emailOnPayout: { type: Boolean, default: true },
      monthlySummary: { type: Boolean, default: true }
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Affiliate', affiliateSchema);
