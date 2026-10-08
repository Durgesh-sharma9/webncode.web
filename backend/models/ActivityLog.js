const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      index: true
    },
    category: {
      type: String,
      enum: ['leads', 'financial', 'partners', 'broadcast', 'careers', 'system'],
      default: 'system',
      index: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    actor: {
      name: { type: String, default: 'System' },
      role: { type: String, default: 'system' }, // 'admin', 'affiliate', 'client', 'system'
      email: { type: String, default: '' },
      id: { type: String, default: '' }
    },
    entityId: {
      type: String,
      default: ''
    },
    entityType: {
      type: String,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
