const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: 'SmartHire Enterprise',
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
    },
    department: {
      type: String,
      trim: true,
      default: 'Engineering',
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Principal'],
      default: 'Mid Level',
    },
    minExperience: {
      type: Number,
      default: 1,
    },
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      period: { type: String, default: 'yearly' }, // yearly, monthly
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Please specify at least one required skill'],
      default: [],
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Closed'],
      default: 'Published',
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for search
jobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text', companyName: 'text' });

module.exports = mongoose.model('Job', jobSchema);

