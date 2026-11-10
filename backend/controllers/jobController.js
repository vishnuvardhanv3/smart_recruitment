const Job = require('../models/Job');
const Application = require('../models/Application');
const RecruiterProfile = require('../models/RecruiterProfile');

// @desc    Get all jobs (with filters, search, and pagination)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { search, location, employmentType, department, experienceLevel, status, myJobs } = req.query;

    const query = {};

    // If recruiter requests their own jobs, show all statuses
    if (myJobs === 'true' && req.user && req.user.role === 'recruiter') {
      query.recruiter = req.user._id;
      if (status) query.status = status;
    } else {
      // By default public and candidate view only 'Published' jobs
      query.status = status || 'Published';
    }

    if (location && location !== 'All Locations') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (employmentType && employmentType !== 'All Types') {
      query.employmentType = employmentType;
    }

    if (department && department !== 'All Departments') {
      query.department = { $regex: department, $options: 'i' };
    }

    if (experienceLevel && experienceLevel !== 'All Levels') {
      query.experienceLevel = experienceLevel;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { companyName: searchRegex },
        { requiredSkills: searchRegex },
        { location: searchRegex },
      ];
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error('getJobs error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve jobs.',
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found.',
      });
    }

    // Check if the current user has already applied
    let hasApplied = false;
    let applicationStatus = null;
    let applicationId = null;

    if (req.user && req.user.role === 'candidate') {
      const existingApp = await Application.findOne({
        job: job._id,
        candidate: req.user._id,
      });
      if (existingApp) {
        hasApplied = true;
        applicationStatus = existingApp.status;
        applicationId = existingApp._id;
      }
    }

    res.status(200).json({
      success: true,
      job,
      hasApplied,
      applicationStatus,
      applicationId,
    });
  } catch (err) {
    console.error('getJobById error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job details.',
    });
  }
};

// @desc    Create a job opening
// @route   POST /api/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      location,
      employmentType,
      experienceLevel,
      minExperience,
      salary,
      requiredSkills,
      preferredSkills,
      qualifications,
      responsibilities,
      status,
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job title, description, and location.',
      });
    }

    // Fetch recruiter company name
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
    const companyName = recruiterProfile?.companyName || 'SmartHire Enterprise';

    // Format skills if sent as comma-separated string
    const formatList = (val) => {
      if (Array.isArray(val)) return val.map((s) => s.trim()).filter(Boolean);
      if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
      return [];
    };

    const job = await Job.create({
      recruiter: req.user._id,
      companyName,
      title,
      description,
      department: department || 'Engineering',
      location,
      employmentType: employmentType || 'Full-time',
      experienceLevel: experienceLevel || 'Mid Level',
      minExperience: Number(minExperience) || 0,
      salary: salary || { min: 0, max: 0, currency: 'USD', period: 'yearly' },
      requiredSkills: formatList(requiredSkills),
      preferredSkills: formatList(preferredSkills),
      qualifications: formatList(qualifications),
      responsibilities: formatList(responsibilities),
      status: status || 'Published',
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully.',
      job,
    });
  } catch (err) {
    console.error('createJob error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create job posting.',
    });
  }
};

// @desc    Update a job opening
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found.',
      });
    }

    // Verify ownership
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this job.',
      });
    }

    const formatList = (val) => {
      if (Array.isArray(val)) return val.map((s) => s.trim()).filter(Boolean);
      if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
      return undefined;
    };

    const updates = { ...req.body };
    if (updates.requiredSkills) updates.requiredSkills = formatList(updates.requiredSkills);
    if (updates.preferredSkills) updates.preferredSkills = formatList(updates.preferredSkills);
    if (updates.qualifications) updates.qualifications = formatList(updates.qualifications);
    if (updates.responsibilities) updates.responsibilities = formatList(updates.responsibilities);

    job = await Job.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully.',
      job,
    });
  } catch (err) {
    console.error('updateJob error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update job posting.',
    });
  }
};

// @desc    Delete a job opening
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found.',
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this job.',
      });
    }

    // Delete associated applications
    await Application.deleteMany({ job: job._id });
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job and associated applications deleted successfully.',
    });
  } catch (err) {
    console.error('deleteJob error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job posting.',
    });
  }
};

