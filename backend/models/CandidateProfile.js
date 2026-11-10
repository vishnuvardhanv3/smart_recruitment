const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    headline: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    education: [
      {
        degree: String,
        fieldOfStudy: String,
        institution: String,
        startYear: String,
        endYear: String,
        grade: String,
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
      },
    ],
    resumeUrl: {
      type: String,
      default: '',
    },
    resumeOriginalName: {
      type: String,
      default: '',
    },
    resumeParsedAt: {
      type: Date,
    },
    resumeRawText: {
      type: String,
      default: '',
    },
    parsedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);

