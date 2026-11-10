const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const User = require('../models/User');

// @desc    Get recruiter analytics & charts data
// @route   GET /api/analytics/recruiter
// @access  Private (Recruiter only)
exports.getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // Get all jobs by this recruiter
    const jobs = await Job.find({ recruiter: recruiterId });
    const jobIds = jobs.map((j) => j._id);

    // Get all applications for recruiter's jobs
    const applications = await Application.find({ job: { $in: jobIds } }).populate('job', 'title');
    const interviews = await Interview.find({ recruiter: recruiterId });

    // Distinct candidates
    const distinctCandidates = new Set(applications.map((a) => a.candidate.toString()));

    // Metrics
    const totalJobs = jobs.length;
    const totalApplications = applications.length;
    const totalCandidates = distinctCandidates.size;
    const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
    const interviewScheduledCount = applications.filter(
      (a) => a.status === 'Interview Scheduled'
    ).length;
    const selectedCount = applications.filter((a) => a.status === 'Selected').length;
    const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;
    const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;
    const appliedCount = applications.filter((a) => a.status === 'Applied').length;

    // Status breakdown for Recharts
    const statusDistribution = [
      { name: 'Applied', count: appliedCount, color: '#635BFF' },
      { name: 'Under Review', count: underReviewCount, color: '#F59E0B' },
      { name: 'Shortlisted', count: shortlistedCount, color: '#3B82F6' },
      { name: 'Interview Scheduled', count: interviewScheduledCount, color: '#8B5CF6' },
      { name: 'Selected', count: selectedCount, color: '#16A34A' },
      { name: 'Rejected', count: rejectedCount, color: '#EF4444' },
    ];

    // Applicants per job
    const applicantsPerJob = jobs.map((job) => ({
      title: job.title.length > 20 ? job.title.substring(0, 18) + '...' : job.title,
      fullTitle: job.title,
      applicants: applications.filter((a) => a.job?._id?.toString() === job._id.toString()).length,
    })).sort((a, b) => b.applicants - a.applicants).slice(0, 6);

    // Applications over time (last 7 days / weekly distribution)
    const dateCounts = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateCounts[key] = 0;
    }

    applications.forEach((app) => {
      const dateKey = new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      if (dateCounts[dateKey] !== undefined) {
        dateCounts[dateKey]++;
      }
    });

    const applicationsOverTime = Object.keys(dateCounts).map((date) => ({
      date,
      applications: dateCounts[date],
    }));

    res.status(200).json({
      success: true,
      metrics: {
        totalJobs,
        totalApplications,
        totalCandidates,
        shortlistedCount,
        interviewScheduledCount,
        selectedCount,
        rejectedCount,
      },
      charts: {
        statusDistribution,
        applicantsPerJob,
        applicationsOverTime,
      },
    });
  } catch (err) {
    console.error('getRecruiterAnalytics error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recruiter analytics.',
    });
  }
};

// @desc    Get candidate analytics
// @route   GET /api/analytics/candidate
// @access  Private (Candidate only)
exports.getCandidateAnalytics = async (req, res) => {
  try {
    const candidateId = req.user._id;

    const applications = await Application.find({ candidate: candidateId })
      .populate('job', 'title companyName location')
      .sort({ updatedAt: -1 });

    const interviews = await Interview.find({ candidate: candidateId })
      .populate('job', 'title companyName')
      .sort({ interviewDate: 1 });

    const totalApplications = applications.length;
    const shortlistedCount = applications.filter((a) =>
      ['Shortlisted', 'Interview Scheduled', 'Selected'].includes(a.status)
    ).length;

    // Upcoming interviews: date >= start of today
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const upcomingInterviews = interviews.filter(
      (inv) => new Date(inv.interviewDate) >= now && inv.status === 'Scheduled'
    );

    // Recent application updates
    const recentUpdates = applications.slice(0, 5).map((app) => ({
      id: app._id,
      jobTitle: app.job?.title || 'Unknown Job',
      company: app.job?.companyName || 'SmartHire Partner',
      status: app.status,
      updatedAt: app.updatedAt,
      matchScore: app.matchScore?.score || 0,
    }));

    res.status(200).json({
      success: true,
      metrics: {
        totalApplications,
        shortlistedCount,
        upcomingInterviewsCount: upcomingInterviews.length,
      },
      upcomingInterviews: upcomingInterviews.slice(0, 3),
      recentUpdates,
    });
  } catch (err) {
    console.error('getCandidateAnalytics error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve candidate analytics.',
    });
  }
};

