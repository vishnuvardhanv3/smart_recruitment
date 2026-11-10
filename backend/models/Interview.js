const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
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
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Technical & Fit Interview',
      trim: true,
    },
    round: {
      type: String,
      enum: ['Initial Screening', 'Technical Round 1', 'Technical Round 2', 'System Design', 'HR Round', 'Final Executive'],
      default: 'Technical Round 1',
    },
    interviewDate: {
      type: Date,
      required: [true, 'Interview date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'], // e.g. "14:00"
    },
    endTime: {
      type: String,
      default: '', // e.g. "15:00"
    },
    type: {
      type: String,
      enum: ['Online', 'Offline'],
      default: 'Online',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Scheduled',
    },
    feedback: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);

