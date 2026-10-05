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
      enum: ['UPI', 'Bank Transfer (IMPS/NEFT)', 'Cash', 'Cheque', 'Other'],
      default: 'UPI'
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
    paidAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AffiliatePayout', affiliatePayoutSchema);
