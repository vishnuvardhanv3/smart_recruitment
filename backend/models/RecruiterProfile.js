const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    companyWebsite: {
      type: String,
      trim: true,
      default: '',
    },
    companyLogo: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      trim: true,
      default: 'Talent Acquisition Manager',
    },
    department: {
      type: String,
      trim: true,
      default: 'Human Resources',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    companyOverview: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);

