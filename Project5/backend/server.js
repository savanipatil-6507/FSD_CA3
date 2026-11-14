/**
 * Fullstack Hospital Appointment Backend Server
 * Express.js with PostgreSQL / SQLite Sequelize Persistence
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, Appointment } = require('./models/Appointment');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration
const allowedOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root Health Route
app.get('/', (req, res) => {
  res.json({
    service: 'Fullstack Hospital Appointment REST API',
    status: 'Online',
    database: process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite (Local)',
    clientOrigin: allowedOrigin
  });
});

// Mount Routes
app.use('/api/appointments', appointmentRoutes);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Database/Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

// Initialize Database & Start Server
async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');

    // Seed sample records if database is empty
    const count = await Appointment.count();
    if (count === 0) {
      await Appointment.bulkCreate([
        {
          appointmentNumber: 'APT-501',
          patientName: 'Hannah Baker',
          patientPhone: '9876543210',
          department: 'Neurology',
          doctorName: 'Dr. Gregory House',
          appointmentDate: '2026-11-25',
          appointmentTime: '10:00',
          reason: 'Neurological evaluation and EEG follow-up',
          status: 'Scheduled'
        },
        {
          appointmentNumber: 'APT-502',
          patientName: 'Marcus Miller',
          patientPhone: '9123456789',
          department: 'Cardiology',
          doctorName: 'Dr. Allison Cameron',
          appointmentDate: '2026-11-26',
          appointmentTime: '14:30',
          reason: 'Blood pressure spike and palpitations',
          status: 'Completed'
        }
      ]);
      console.log('🌱 Seeded initial appointment records.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Express backend listening on http://localhost:${PORT}`);
      console.log(`🌐 Allowed CORS Origin: ${allowedOrigin}`);
    });
  } catch (error) {
    console.error('❌ Failed to start backend server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;

