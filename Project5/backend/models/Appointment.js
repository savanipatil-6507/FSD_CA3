/**
 * Database Model for Hospital Appointment
 * Configured with Sequelize (PostgreSQL for Render / SQLite for local development)
 */
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Determine database connection: PostgreSQL (Render/Local) or local SQLite fallback
let sequelize;

if (process.env.DATABASE_URL) {
  const isLocalDb = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: isLocalDb ? false : (process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false)
    },
    logging: false
  });
  console.log(`📦 Connected to PostgreSQL Database (${isLocalDb ? 'Localhost' : 'Cloud/Remote'}) via Sequelize.`);
} else {
  // Local SQLite fallback
  const dbPath = path.join(__dirname, '..', 'hospital.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
  });
  console.log(`📦 Connected to Local SQLite Database (${dbPath}) via Sequelize.`);
}

// Define the Appointment Schema
const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  appointmentNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Patient name cannot be empty.' },
      len: { args: [3, 100], msg: 'Patient name must be between 3 and 100 characters.' }
    }
  },
  patientPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: {
        args: /^[6-9]\d{9}$/,
        msg: 'Please provide a valid 10-digit mobile number.'
      }
    }
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  appointmentDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  appointmentTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
    defaultValue: 'Scheduled'
  }
}, {
  timestamps: true,
  tableName: 'appointments'
});

module.exports = { sequelize, Appointment };

