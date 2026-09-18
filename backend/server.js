const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('./routes/contactRoutes');
const careerRoutes = require('./routes/careerRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
// Enable CORS (Cross-Origin Resource Sharing) for frontend-backend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse incoming JSON requests (Increased limit for Base64 resume uploads)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded data
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes
// Mount auth routes at /api/auth
app.use('/api/auth', authRoutes);

// Mount project routes at /api/projects
app.use('/api/projects', projectRoutes);

// Mount contact routes at /api/contact
app.use('/api/contact', contactRoutes);

// Mount career routes at /api/careers
app.use('/api/careers', careerRoutes);

// Root endpoint for health check
app.get('/', (req, res) => {
  res.json({
    message: 'Web n Code Technologies API Server',
    status: 'running',
    version: '1.0.0'
  });
});

// Connect to MongoDB Atlas with auto-retry
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas successfully');
  } catch (error) {
    console.error('⚠️ MongoDB connection issue (retrying in 5s):', error.message);
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  // Close server & exit process
  process.exit(1);
});
