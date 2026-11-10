const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    candidateProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CandidateProfile',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    coverLetter: {
      type: String,
      default: '',
    },
    matchScore: {
      score: { type: Number, default: 0 },
      matchedSkills: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
      experienceMatch: { type: Boolean, default: true },
      explanation: { type: String, default: '' },
      breakdown: {
        skillsScore: { type: Number, default: 0 },
        experienceScore: { type: Number, default: 0 },
        keywordScore: { type: Number, default: 0 },
      },
    },
    status: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview Scheduled',
        'Selected',
        'Rejected',
      ],
      default: 'Applied',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedAt: { type: Date, default: Date.now },
        notes: { type: String, default: '' },
      },
    ],
    recruiterNotes: {
      type: String,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent candidate from applying multiple times to the same job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);

