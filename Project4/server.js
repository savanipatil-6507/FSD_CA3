/**
 * Express.js REST API Server for Hospital Appointments
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors());
app.use(express.json());

// Custom Request Logging Middleware
app.use(logger);

// Welcome & Health Check Route
app.get('/', (req, res) => {
  res.json({
    service: 'City Care Hospital Appointment REST API',
    status: 'Running',
    framework: 'Express.js',
    features: [
      'CRUD Endpoints (GET, POST, PUT, DELETE)',
      'Request Logging Middleware',
      'Input Validation Middleware',
      'Centralized Error Handling',
      'JWT Authentication & bcrypt Password Hashing',
      'Protected Admin Routes'
    ]
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Catch-all 404 Route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Express.js REST API Server active on http://localhost:${PORT}`);
    console.log(`🔒 Authentication: JWT with bcrypt hashing`);
    console.log(`🛡️  Validation & Logging Middleware loaded`);
    console.log(`=======================================================`);
  });
}

module.exports = app;

