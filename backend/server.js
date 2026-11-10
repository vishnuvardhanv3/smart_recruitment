const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const { runSeed } = require('./seed/seedRunner');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Serve static uploaded resumes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'SmartHire API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Reseed Endpoint for easy reset
app.post('/api/seed', async (req, res) => {
  try {
    await runSeed();
    res.status(200).json({
      success: true,
      message: 'Database seeded successfully with realistic ATS data!',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed database: ' + err.message,
    });
  }
});

// Route Mounts
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.stack || err.message);

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Connect to Database, auto-seed if empty, and start server
const startServer = async () => {
  try {
    await connectDB();

    // Check if initial seed is needed
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Startup] Empty database detected. Running initial seed...');
      await runSeed();
    }

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 SmartHire Backend Server running on port ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
      console.log(`📁 Uploads served at: http://localhost:${PORT}/uploads`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
