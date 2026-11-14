/**
 * Event Notifier Module using Node.js 'events' and 'stream'
 * Processes appointment updates and streams notifications to an audit log file.
 */

const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class AppointmentNotifier extends EventEmitter {
  constructor() {
    super();

    // Ensure logs directory exists
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    this.logFilePath = path.join(logsDir, 'appointment-audit.log');

    // Create a persistent append-only writable stream for event auditing
    this.logStream = fs.createWriteStream(this.logFilePath, {
      flags: 'a',
      encoding: 'utf8'
    });

    this.registerListeners();
  }

  registerListeners() {
    // Listener for new appointment booking
    this.on('appointment:created', (appointment) => {
      const message = `[NOTIFICATION - CREATED] Appointment #${appointment.id} booked for ${appointment.patientName} with ${appointment.doctorName} on ${appointment.appointmentDate} at ${appointment.appointmentTime}`;
      console.log(`\x1b[32m${message}\x1b[0m`);
      this.writeToStream(message);
    });

    // Listener for appointment updates (status change, rescheduling)
    this.on('appointment:updated', (appointment) => {
      const message = `[NOTIFICATION - UPDATED] Appointment #${appointment.id} updated. Current Status: ${appointment.status}`;
      console.log(`\x1b[34m${message}\x1b[0m`);
      this.writeToStream(message);
    });

    // Listener for appointment cancellation / deletion
    this.on('appointment:deleted', (appointmentId) => {
      const message = `[NOTIFICATION - DELETED] Appointment #${appointmentId} was removed from the system.`;
      console.log(`\x1b[31m${message}\x1b[0m`);
      this.writeToStream(message);
    });
  }

  writeToStream(entry) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${entry}\n`;
    this.logStream.write(logLine);
  }
}

// Export singleton instance
module.exports = new AppointmentNotifier();

