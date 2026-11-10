const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, protect, authorize } = require('../middleware/auth');
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');

// Optional auth helper so public job list/details can know if user is logged in
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (e) {
      // Ignore token errors for public routes
    }
  }
  next();
};

router.get('/', optionalAuth, getJobs);
router.get('/:id', optionalAuth, getJobById);
router.post('/', protect, authorize('recruiter'), createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);

module.exports = router;

