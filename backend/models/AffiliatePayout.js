const mongoose = require('mongoose');

/**
 * AffiliatePayout Schema
 * Stores payment transactions disbursed to affiliates
 */
const affiliatePayoutSchema = new mongoose.Schema(
  {
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Affiliate',
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Payout amount is required'],
      min: 1
    },
    paymentMethod: {
      type: String,
      default: 'UPI'
    },
    payoutDetails: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Rejected'],
      default: 'Pending'
    },
    transactionReference: {
      type: String,
      default: '',
      trim: true
    },
    notes: {
      type: String,
      default: ''
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    paidAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AffiliatePayout', affiliatePayoutSchema);
