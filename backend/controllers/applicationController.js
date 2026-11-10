const Application = require('../models/Application');
const Job = require('../models/Job');
const CandidateProfile = require('../models/CandidateProfile');
const Notification = require('../models/Notification');
const { matchCandidateToJob } = require('../services/pythonService');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate only)
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Job ID.',
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found.',
      });
    }

    if (job.status !== 'Published') {
      return res.status(400).json({
        success: false,
        message: 'This job opening is no longer accepting applications.',
      });
    }

    // Check for existing application
    const existing = await Application.findOne({
      job: jobId,
      candidate: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this position.',
      });
    }

    // Get candidate profile
    const profile = await CandidateProfile.findOne({ user: req.user._id });
    if (!profile || !profile.resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume to your profile before applying.',
      });
    }

    // Run Python resume-to-job matching algorithm
    const candidateData = {
      skills: profile.skills || [],
      yearsOfExperience: profile.yearsOfExperience || 0,
      rawText: profile.resumeRawText || '',
    };

    const jobData = {
      requiredSkills: job.requiredSkills || [],
      preferredSkills: job.preferredSkills || [],
      minExperience: job.minExperience || 0,
      description: job.description || '',
    };

    console.log(`[ATS Matcher] Matching candidate ${req.user._id} to job ${job.title}...`);
    const matchResult = await matchCandidateToJob(candidateData, jobData);

    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      candidateProfile: profile._id,
      resumeUrl: profile.resumeUrl,
      coverLetter: coverLetter || '',
      matchScore: matchResult,
      status: 'Applied',
      statusHistory: [
        {
          status: 'Applied',
          updatedBy: req.user._id,
          updatedAt: new Date(),
          notes: 'Application received and registered in ATS.',
        },
      ],
      appliedAt: new Date(),
    });

    // Increment job application counter
    await Job.findByIdAndUpdate(job._id, { $inc: { applicationCount: 1 } });

    // Notify recruiter
    await Notification.create({
      recipient: job.recruiter,
      title: 'New Applicant Received',
      message: `${req.user.name} applied for "${job.title}" with a match score of ${matchResult.score}%.`,
      type: 'new_application',
      link: `/recruiter/applicants?jobId=${job._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (err) {
    console.error('applyForJob error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to submit job application.',
    });
  }
};

// @desc    Get candidate's own applications
// @route   GET /api/applications/my
// @access  Private (Candidate only)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error('getMyApplications error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your applications.',
    });
  }
};

// @desc    Get all applications for a specific job (Recruiter)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only)
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found.',
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not own this job posting.',
      });
    }

    const { status, minScore } = req.query;
    const query = { job: job._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (minScore) {
      query['matchScore.score'] = { $gte: Number(minScore) };
    }

    const applications = await Application.find(query)
      .populate('candidate', 'name email avatar')
      .populate('candidateProfile')
      .sort({ 'matchScore.score': -1, appliedAt: -1 });

    res.status(200).json({
      success: true,
      job,
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error('getJobApplications error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applicants.',
    });
  }
};

// @desc    Get all applications across all jobs for the current recruiter
// @route   GET /api/applications/recruiter
// @access  Private (Recruiter only)
exports.getRecruiterApplications = async (req, res) => {
  try {
    // Find all jobs by this recruiter
    const jobs = await Job.find({ recruiter: req.user._id }).select('_id title');
    const jobIds = jobs.map((j) => j._id);

    const { status, jobId, search } = req.query;
    const query = { job: { $in: jobIds } };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (jobId && jobId !== 'All') {
      query.job = jobId;
    }

    let applications = await Application.find(query)
      .populate('job', 'title department location employmentType')
      .populate('candidate', 'name email avatar')
      .populate('candidateProfile')
      .sort({ 'matchScore.score': -1, appliedAt: -1 });

    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      applications = applications.filter((app) => {
        const cName = app.candidate?.name?.toLowerCase() || '';
        const cEmail = app.candidate?.email?.toLowerCase() || '';
        const jTitle = app.job?.title?.toLowerCase() || '';
        return cName.includes(term) || cEmail.includes(term) || jTitle.includes(term);
      });
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error('getRecruiterApplications error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidate applications.',
    });
  }
};

// @desc    Get single application details
// @route   GET /api/applications/:id
// @access  Private (Candidate or Recruiter)
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('candidate', 'name email avatar')
      .populate('candidateProfile')
      .populate('statusHistory.updatedBy', 'name role');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Access control: either the applicant or the job recruiter
    const isApplicant = application.candidate._id.toString() === req.user._id.toString();
    const isJobOwner = application.job.recruiter.toString() === req.user._id.toString();

    if (!isApplicant && !isJobOwner) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this application.',
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (err) {
    console.error('getApplicationById error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application details.',
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const validStatuses = [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Selected',
      'Rejected',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Verify recruiter ownership of the job
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not own this job posting.',
      });
    }

    application.status = status;
    if (notes) application.recruiterNotes = notes;

    // Append history
    application.statusHistory.push({
      status,
      updatedBy: req.user._id,
      updatedAt: new Date(),
      notes: notes || `Status updated to ${status}`,
    });

    await application.save();

    // Create notification for candidate
    await Notification.create({
      recipient: application.candidate,
      title: 'Application Status Update',
      message: `Your application for "${application.job.title}" has been updated to "${status}".`,
      type: 'status_update',
      link: `/candidate/applications/${application._id}`,
    });

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      application,
    });
  } catch (err) {
    console.error('updateApplicationStatus error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status.',
    });
  }
};

