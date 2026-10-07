const mongoose = require('mongoose');

const productPlanSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, 'Project / Product name is required'],
      trim: true
    },
    planName: {
      type: String,
      required: [true, 'Plan name is required (e.g. Starter, Standard, Enterprise)'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price in ₹ is required'],
      min: 0,
      default: 0
    },
    billingCycle: {
      type: String,
      required: true,
      enum: ['Yearly', 'Monthly', 'One-time', 'Quarterly', 'Starting'],
      default: 'Yearly'
    },
    defaultCommissionRate: {
      type: Number,
      default: 15,
      min: 0,
      max: 100
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    features: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure uniqueness of planName per projectName
productPlanSchema.index({ projectName: 1, planName: 1 }, { unique: true });

module.exports = mongoose.model('ProductPlan', productPlanSchema);
