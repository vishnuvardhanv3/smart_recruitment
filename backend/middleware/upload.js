const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate clean unique filename: candidateId_timestamp_cleanName.pdf
    const candidateId = req.user ? req.user._id.toString() : 'guest';
    const cleanOriginal = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${candidateId}-${Date.now()}-${cleanOriginal}`);
  },
});

// File filter - PDF only
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pdf' && file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF resumes are supported.'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

module.exports = upload;

