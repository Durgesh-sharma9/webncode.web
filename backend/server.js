const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('./routes/contactRoutes');
const careerRoutes = require('./routes/careerRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const developerRoutes = require('./routes/developerRoutes');
const updateRoutes = require('./routes/updateRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
// Enable CORS for frontend-backend communication (supports 5173, 5174, 5175, etc.)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    return callback(null, true);
  },
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

// Mount contact routes at /api/contact and /api/contacts
app.use('/api/contact', contactRoutes);
app.use('/api/contacts', contactRoutes);

// Mount career routes at /api/careers
app.use('/api/careers', careerRoutes);

// Mount settings routes at /api/settings
app.use('/api/settings', settingsRoutes);

// Mount developers routes at /api/developers
app.use('/api/developers', developerRoutes);

// Mount updates routes at /api/updates
app.use('/api/updates', updateRoutes);

// Mount categories routes at /api/categories
app.use('/api/categories', categoryRoutes);

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

// Server initialized successfully
