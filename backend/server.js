
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend pages and files
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve root-level assets (JavaScript, CSS, etc.)
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Serve uploaded member photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/caregivers', require('./routes/caregiverRoutes'));
app.use('/api/family', require('./routes/familyRoutes'));
app.use('/api/familycontacts', require('./routes/familyRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/healthrecords', require('./routes/healthRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/emergencycontacts', require('./routes/emergencyRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/panic', require('./routes/panicRoutes'));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
