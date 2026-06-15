const mongoose = require('mongoose');

/**
 * Contact Schema
 * Defines the structure for contact form submissions
 */
const contactSchema = new mongoose.Schema({
  // Name of the person submitting the form (required)
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },

  // Email address of the person (required, must be valid email format)
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },

  // Phone number of the person (required)
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },

  // Message content (required)
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },

  // Timestamp when the contact was created (auto-generated)
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Contact model
module.exports = mongoose.model('Contact', contactSchema);
