const mongoose = require('mongoose');

/**
 * AffiliateCoupon Schema
 * Discount coupons created by SuperAdmin and assigned to specific or all affiliates and products.
 */
const affiliateCouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'percentage'
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [1, 'Discount value must be greater than 0']
    },
    // If null/empty, coupon is available for all affiliates
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Affiliate',
      default: null
    },
    // If empty, coupon is applicable to all software products
    applicableProducts: [
      {
        type: String,
        trim: true
      }
    ],
    maxUses: {
      type: Number,
      default: 0 // 0 means unlimited
    },
    usedCount: {
      type: Number,
      default: 0
    },
    expiryDate: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AffiliateCoupon', affiliateCouponSchema);
