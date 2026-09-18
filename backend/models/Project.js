const mongoose = require('mongoose');

/**
 * Project / Product Schema
 * Defines projects added by Admin with ImageKit screenshots
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    shortDescription: {
      type: String,
      required: [true, 'Short summary is required'],
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters']
    },
    description: {
      type: String,
      required: [true, 'Full description is required'],
      trim: true
    },
    category: {
      type: String,
      default: 'Services',
      trim: true
    },
    features: {
      type: [String],
      default: []
    },
    demoUrl: {
      type: String,
      trim: true,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    color: {
      type: String,
      default: '#7dd3fc'
    },
    accentColor: {
      type: String,
      default: '#38bdf8'
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Project', projectSchema);
