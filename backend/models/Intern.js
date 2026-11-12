const mongoose = require('mongoose');

const internSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide intern full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide intern email'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    college: {
      type: String,
      trim: true,
      default: ''
    },
    course: {
      type: String,
      trim: true,
      default: ''
    },
    domain: {
      type: String,
      required: [true, 'Please provide internship domain / role'],
      trim: true,
      default: ''
    },
    department: {
      type: String,
      trim: true,
      default: ''
    },
    mode: {
      type: String,
      enum: ['offline', 'online', 'hybrid'],
      default: 'offline'
    },
    stipend: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    duration: {
      type: String,
      trim: true,
      default: ''
    },
    startDate: {
      type: String,
      trim: true,
      default: ''
    },
    endDate: {
      type: String,
      trim: true,
      default: ''
    },
    // Offer Letter Details
    offerLetterRef: {
      type: String,
      trim: true,
      default: ''
    },
    offerLetterDate: {
      type: String,
      trim: true,
      default: ''
    },
    acceptanceDueDate: {
      type: String,
      trim: true,
      default: ''
    },
    offerLetterSentAt: {
      type: Date,
      default: null
    },
    // Certificate Details
    certificateRef: {
      type: String,
      trim: true,
      default: ''
    },
    certificateIssueDate: {
      type: String,
      trim: true,
      default: ''
    },
    certificateStatus: {
      type: String,
      enum: ['draft', 'approved', 'revoked'],
      default: 'draft'
    },
    certificateEvaluation: {
      type: String,
      trim: true,
      default: ''
    },
    certificateSentAt: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate reference numbers before save if empty
internSchema.pre('save', async function (next) {
  const currentYear = new Date().getFullYear().toString().slice(-2);

  // If one is set and the other is empty, keep them identical
  if (this.offerLetterRef && !this.certificateRef) {
    this.certificateRef = this.offerLetterRef;
  } else if (!this.offerLetterRef && this.certificateRef) {
    this.offerLetterRef = this.certificateRef;
  } else if (!this.offerLetterRef && !this.certificateRef) {
    try {
      const count = await mongoose.model('Intern').countDocuments();
      const numStr = String(count + 1).padStart(3, '0');
      const generatedRef = `WNC/SI/FSD/${currentYear}/${numStr}`;
      this.offerLetterRef = generatedRef;
      this.certificateRef = generatedRef;
    } catch (e) {
      const fallbackRef = `WNC/SI/FSD/${currentYear}/001`;
      this.offerLetterRef = fallbackRef;
      this.certificateRef = fallbackRef;
    }
  }
  next();
});

module.exports = mongoose.model('Intern', internSchema);
