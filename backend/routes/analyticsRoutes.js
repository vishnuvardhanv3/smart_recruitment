const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getRecruiterAnalytics,
  getCandidateAnalytics,
} = require('../controllers/analyticsController');

router.get('/recruiter', protect, authorize('recruiter'), getRecruiterAnalytics);
router.get('/candidate', protect, authorize('candidate'), getCandidateAnalytics);

module.exports = router;

