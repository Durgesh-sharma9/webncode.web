const mongoose = require('mongoose');

/**
 * Developer / Team Member Schema
 * For showcasing developers and company team members on the About page
 */
const developerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      default: 'FULL STACK DEVELOPER'
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    image: {
      type: String,
      required: [true, 'Profile image is required']
    },
    hoverImage: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'JAIPUR, INDIA',
      trim: true
    },
    flag: {
      type: String,
      default: '🇮🇳'
    },
    team: {
      type: String,
      default: 'WnC TEAM',
      trim: true
    },
    linkedin: {
      type: String,
      default: '',
      trim: true
    },
    github: {
      type: String,
      default: '',
      trim: true
    },
    twitter: {
      type: String,
      default: '',
      trim: true
    },
    instagram: {
      type: String,
      default: '',
      trim: true
    },
    email: {
      type: String,
      default: '',
      trim: true
    },
    order: {
      type: Number,
      default: 0
    },
    isFounder: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Developer', developerSchema);
