const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  scheduleInterview,
  getMyInterviews,
  updateInterview,
} = require('../controllers/interviewController');

router.post('/', protect, authorize('recruiter'), scheduleInterview);
router.get('/my', protect, getMyInterviews);
router.put('/:id', protect, authorize('recruiter'), updateInterview);

module.exports = router;

