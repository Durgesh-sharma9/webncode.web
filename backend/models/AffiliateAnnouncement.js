const mongoose = require('mongoose');

/**
 * AffiliateAnnouncement Schema
 * Announcements, broadcast notices, and commission boosts posted by SuperAdmin for Affiliates
 */
const affiliateAnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Announcement message is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['general', 'boost', 'important', 'offer'],
      default: 'general'
    },
    priority: {
      type: String,
      enum: ['normal', 'high', 'urgent'],
      default: 'normal'
    },
    actionLink: {
      type: String,
      trim: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    author: {
      type: String,
      default: 'Web n Code SuperAdmin'
    }
  },
  {
    timestamps: true
  }
);

affiliateAnnouncementSchema.index({ createdAt: -1 });
affiliateAnnouncementSchema.index({ isActive: 1 });

module.exports = mongoose.model('AffiliateAnnouncement', affiliateAnnouncementSchema);
