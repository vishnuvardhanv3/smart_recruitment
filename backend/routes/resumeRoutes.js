const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const { uploadResume, getMyResume } = require('../controllers/resumeController');

router.post('/upload', protect, authorize('candidate'), upload.single('resume'), uploadResume);
router.get('/my', protect, authorize('candidate'), getMyResume);

module.exports = router;

