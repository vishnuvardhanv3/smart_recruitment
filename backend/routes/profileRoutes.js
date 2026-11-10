const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMyProfile,
  updateCandidateProfile,
  updateRecruiterProfile,
  getNotifications,
  markNotificationsRead,
} = require('../controllers/profileController');

router.get('/', protect, getMyProfile);
router.put('/candidate', protect, authorize('candidate'), updateCandidateProfile);
router.put('/recruiter', protect, authorize('recruiter'), updateRecruiterProfile);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);

module.exports = router;

