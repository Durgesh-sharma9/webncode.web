const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // SECTION 1: Personal Details
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  gender: { type: String, required: true },

  // SECTION 2: Professional Links
  linkedin: { type: String },
  github: { type: String },
  portfolio: { type: String },

  // SECTION 3: Career Details
  position: { type: String, required: true },
  experience: { type: String, required: true },
  currentCompany: { type: String },
  currentRole: { type: String },
  noticePeriod: { type: String, required: true },

  // SECTION 4: Product Builder Questions
  builtProduct: { type: String, required: true },
  projectLinks: { type: String },
  whyJoin: { type: String, required: true },

  // SECTION 5: Internship/Academic Fields
  college: { type: String },
  course: { type: String },
  currentYear: { type: String },
  graduationYear: { type: String },

  // SECTION 6: Resume Tracking
  resumeName: { type: String, required: true },

  // SECTION 7: Declaration
  declaration: { type: Boolean, required: true }

}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);