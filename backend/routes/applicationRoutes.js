const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  getRecruiterApplications,
  getApplicationById,
  updateApplicationStatus,
} = require('../controllers/applicationController');

router.post('/', protect, authorize('candidate'), applyForJob);
router.get('/my', protect, authorize('candidate'), getMyApplications);
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterApplications);
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;

