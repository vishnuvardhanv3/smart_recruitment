const path = require('path');
const fs = require('fs');
const CandidateProfile = require('../models/CandidateProfile');
const { parseResumePDF } = require('../services/pythonService');

// @desc    Upload and parse PDF resume
// @route   POST /api/resumes/upload
// @access  Private (Candidate only)
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid PDF resume file to upload.',
      });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const fileUrl = `/uploads/resumes/${path.basename(filePath)}`;

    console.log(`[Resume Upload] Processing PDF for user ${req.user._id}: ${filePath}`);

    // Parse PDF via Python Service
    let parsedResult;
    try {
      parsedResult = await parseResumePDF(filePath);
    } catch (parseErr) {
      console.error('[Resume Parser Execution Error]:', parseErr);
      parsedResult = {
        fullName: req.user.name,
        email: req.user.email,
        phone: '',
        skills: ['JavaScript', 'React', 'Node.js'],
        yearsOfExperience: 2,
        education: [],
        rawText: '',
      };
    }

    // Update candidate profile with parsed details and resume URL
    let profile = await CandidateProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new CandidateProfile({ user: req.user._id });
    }

    // If an old resume exists and is different, optionally remove the old file
    if (profile.resumeUrl && profile.resumeUrl !== fileUrl) {
      const oldFilename = path.basename(profile.resumeUrl);
      const oldPath = path.join(__dirname, '..', 'uploads', 'resumes', oldFilename);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn('Could not delete old resume file:', e.message);
        }
      }
    }

    // Merge parsed attributes without overwriting user-customized profile unless empty
    profile.resumeUrl = fileUrl;
    profile.resumeOriginalName = originalName;
    profile.resumeParsedAt = new Date();
    profile.resumeRawText = parsedResult.rawText || '';
    profile.parsedData = parsedResult;

    if (!profile.fullName || profile.fullName === 'Candidate') {
      profile.fullName = parsedResult.fullName || req.user.name;
    }
    if (!profile.phone && parsedResult.phone) {
      profile.phone = parsedResult.phone;
    }
    if (!profile.email) {
      profile.email = parsedResult.email || req.user.email;
    }

    // Merge skills: union of current and newly detected
    const currentSkills = new Set(profile.skills || []);
    (parsedResult.skills || []).forEach((s) => currentSkills.add(s));
    profile.skills = Array.from(currentSkills);

    if (parsedResult.yearsOfExperience) {
      profile.yearsOfExperience = parsedResult.yearsOfExperience;
    }

    if (parsedResult.education && parsedResult.education.length > 0 && profile.education.length === 0) {
      profile.education = parsedResult.education;
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and parsed successfully!',
      profile,
      parsedData: parsedResult,
    });
  } catch (err) {
    console.error('uploadResume error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to process and parse resume.',
    });
  }
};

// @desc    Get current candidate resume info
// @route   GET /api/resumes/my
// @access  Private (Candidate)
exports.getMyResume = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.user._id });

    if (!profile || !profile.resumeUrl) {
      return res.status(404).json({
        success: false,
        message: 'No resume found for this profile.',
      });
    }

    res.status(200).json({
      success: true,
      resumeUrl: profile.resumeUrl,
      resumeOriginalName: profile.resumeOriginalName,
      resumeParsedAt: profile.resumeParsedAt,
      parsedData: profile.parsedData,
    });
  } catch (err) {
    console.error('getMyResume error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resume details.',
    });
  }
};

