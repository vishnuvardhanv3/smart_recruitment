const CandidateProfile = require('../models/CandidateProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    if (req.user.role === 'candidate') {
      let profile = await CandidateProfile.findOne({ user: req.user._id });
      if (!profile) {
        profile = await CandidateProfile.create({
          user: req.user._id,
          fullName: req.user.name,
          email: req.user.email,
        });
      }
      return res.status(200).json({ success: true, profile, user: req.user });
    } else {
      let profile = await RecruiterProfile.findOne({ user: req.user._id });
      if (!profile) {
        profile = await RecruiterProfile.create({
          user: req.user._id,
          companyName: 'SmartHire Enterprise',
        });
      }
      return res.status(200).json({ success: true, profile, user: req.user });
    }
  } catch (err) {
    console.error('getMyProfile error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

// @desc    Update candidate profile
// @route   PUT /api/profile/candidate
// @access  Private (Candidate)
exports.updateCandidateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      location,
      headline,
      bio,
      skills,
      yearsOfExperience,
      education,
      experience,
    } = req.body;

    let profile = await CandidateProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new CandidateProfile({ user: req.user._id });
    }

    if (fullName) {
      profile.fullName = fullName;
      await User.findByIdAndUpdate(req.user._id, { name: fullName });
    }
    if (phone !== undefined) profile.phone = phone;
    if (location !== undefined) profile.location = location;
    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) {
      profile.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (yearsOfExperience !== undefined) profile.yearsOfExperience = Number(yearsOfExperience) || 0;
    if (education !== undefined) profile.education = education;
    if (experience !== undefined) profile.experience = experience;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      profile,
    });
  } catch (err) {
    console.error('updateCandidateProfile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update candidate profile.' });
  }
};

// @desc    Update recruiter profile
// @route   PUT /api/profile/recruiter
// @access  Private (Recruiter)
exports.updateRecruiterProfile = async (req, res) => {
  try {
    let profile = await RecruiterProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new RecruiterProfile({ user: req.user._id });
    }

    Object.assign(profile, req.body);
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Company profile updated successfully!',
      profile,
    });
  } catch (err) {
    console.error('updateRecruiterProfile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update recruiter profile.' });
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = notifications.filter((n) => !n.read).length;

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err) {
    console.error('getNotifications error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
};

// @desc    Mark notifications as read
// @route   PUT /api/notifications/read
// @access  Private
exports.markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update notifications.' });
  }
};

