const mongoose = require('mongoose');

/**
 * Update / Announcement Schema
 * Supports dynamic product releases, company milestones, and career opportunities
 */
const updateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt / short summary is required'],
      trim: true,
      maxlength: [400, 'Excerpt cannot exceed 400 characters']
    },
    content: {
      type: String,
      required: [true, 'Full content is required'],
      trim: true
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      default: () => new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    },
    category: {
      type: String,
      enum: ['Product', 'Company', 'Careers'],
      default: 'Product',
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for fast search and sorting
updateSchema.index({ date: -1, createdAt: -1 });
updateSchema.index({ category: 1 });
updateSchema.index({ featured: 1 });

module.exports = mongoose.model('Update', updateSchema);
