/**
 * In-memory Data Store for Appointments and Authenticated Staff/Users
 */
const bcrypt = require('bcryptjs');

// Pre-hash default admin password 'admin123'
const defaultHashedPassword = bcrypt.hashSync('admin123', 10);

const store = {
  users: [
    {
      id: 'USR-1',
      username: 'admin',
      passwordHash: defaultHashedPassword,
      role: 'hospital_administrator'
    }
  ],

  appointments: [
    {
      id: 'APT-401',
      patientName: 'Lucas Grey',
      patientPhone: '9876543210',
      department: 'Cardiology',
      doctorName: 'Dr. Clara Oswald',
      appointmentDate: '2026-11-25',
      appointmentTime: '10:00',
      reason: 'Heart rhythm evaluation',
      status: 'Scheduled',
      createdAt: '2026-11-14T08:00:00.000Z'
    },
    {
      id: 'APT-402',
      patientName: 'Maya Patel',
      patientPhone: '9123456789',
      department: 'Orthopedics',
      doctorName: 'Dr. John Watson',
      appointmentDate: '2026-11-26',
      appointmentTime: '14:30',
      reason: 'Wrist fracture recovery checkup',
      status: 'Scheduled',
      createdAt: '2026-11-14T09:30:00.000Z'
    }
  ]
};

module.exports = store;

