const mongoose = require('mongoose');

/**
 * Category Schema
 * Dynamic product / project categories managed by SuperAdmin
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    color: {
      type: String,
      default: '#7dd3fc'
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

categorySchema.index({ order: 1, name: 1 });

module.exports = mongoose.model('Category', categorySchema);
