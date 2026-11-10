const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// @desc    Schedule a new interview
// @route   POST /api/interviews
// @access  Private (Recruiter only)
exports.scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      title,
      round,
      interviewDate,
      startTime,
      endTime,
      type,
      meetingLink,
      location,
      notes,
    } = req.body;

    if (!applicationId || !interviewDate || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide applicationId, interviewDate, and startTime.',
      });
    }

    const application = await Application.findById(applicationId).populate('job candidate');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Verify recruiter owns the job
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to schedule interviews for this candidate.',
      });
    }

    const interview = await Interview.create({
      application: application._id,
      job: application.job._id,
      candidate: application.candidate._id,
      recruiter: req.user._id,
      title: title || `${round || 'Technical'} Interview for ${application.job.title}`,
      round: round || 'Technical Round 1',
      interviewDate: new Date(interviewDate),
      startTime,
      endTime: endTime || '',
      type: type || 'Online',
      meetingLink: meetingLink || 'https://meet.google.com/smarthire-interview',
      location: location || '',
      notes: notes || '',
      status: 'Scheduled',
    });

    // Update application status to 'Interview Scheduled'
    application.status = 'Interview Scheduled';
    application.statusHistory.push({
      status: 'Interview Scheduled',
      updatedBy: req.user._id,
      updatedAt: new Date(),
      notes: `Interview scheduled for ${new Date(interviewDate).toLocaleDateString()} at ${startTime}.`,
    });
    await application.save();

    // Notify candidate
    await Notification.create({
      recipient: application.candidate._id,
      title: 'Interview Scheduled! 📅',
      message: `An interview has been scheduled for "${application.job.title}" on ${new Date(interviewDate).toLocaleDateString()} at ${startTime}.`,
      type: 'interview_scheduled',
      link: '/candidate/interviews',
    });

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully!',
      interview,
    });
  } catch (err) {
    console.error('scheduleInterview error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to schedule interview.',
    });
  }
};

// @desc    Get user's interviews (Candidate or Recruiter)
// @route   GET /api/interviews/my
// @access  Private
exports.getMyInterviews = async (req, res) => {
  try {
    const query = {};

    if (req.user.role === 'candidate') {
      query.candidate = req.user._id;
    } else {
      query.recruiter = req.user._id;
    }

    const interviews = await Interview.find(query)
      .populate('job', 'title department companyName location')
      .populate('candidate', 'name email avatar')
      .populate('recruiter', 'name email')
      .populate('application', 'status matchScore')
      .sort({ interviewDate: 1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (err) {
    console.error('getMyInterviews error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve interviews.',
    });
  }
};

// @desc    Update interview details / status
// @route   PUT /api/interviews/:id
// @access  Private (Recruiter only)
exports.updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found.',
      });
    }

    if (interview.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this interview.',
      });
    }

    const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Interview updated successfully.',
      interview: updated,
    });
  } catch (err) {
    console.error('updateInterview error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update interview.',
    });
  }
};

