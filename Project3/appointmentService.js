/**
 * Hospital Appointment Service
 * Uses File System (fs) and Path modules to persist and retrieve records.
 */

const fs = require('fs');
const path = require('path');
const eventNotifier = require('./eventNotifier');

const dataDir = path.join(__dirname, 'data');
const dataFilePath = path.join(dataDir, 'appointments.json');

// Ensure data folder and initial file exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
}

class AppointmentService {
  /**
   * Reads all appointment records from JSON file
   */
  async getAll() {
    try {
      const data = await fs.promises.readFile(dataFilePath, 'utf8');
      return JSON.parse(data || '[]');
    } catch (error) {
      console.error('Error reading records file:', error);
      throw new Error('Unable to read appointments database file.');
    }
  }

  /**
   * Retrieves single record by ID
   */
  async getById(id) {
    const appointments = await this.getAll();
    return appointments.find(a => a.id === id) || null;
  }

  /**
   * Persists a new appointment record and emits an event
   */
  async create(appointmentData) {
    const appointments = await this.getAll();

    const newAppointment = {
      id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
      patientName: appointmentData.patientName.trim(),
      patientPhone: appointmentData.patientPhone.trim(),
      department: appointmentData.department.trim(),
      doctorName: appointmentData.doctorName.trim(),
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      reason: appointmentData.reason.trim(),
      status: appointmentData.status || 'Scheduled',
      createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);

    // Atomically persist to file using fs.promises
    await fs.promises.writeFile(dataFilePath, JSON.stringify(appointments, null, 2), 'utf8');

    // Notify listeners via EventEmitter
    eventNotifier.emit('appointment:created', newAppointment);

    return newAppointment;
  }

  /**
   * Updates an existing appointment
   */
  async update(id, updateData) {
    const appointments = await this.getAll();
    const index = appointments.findIndex(a => a.id === id);

    if (index === -1) {
      return null;
    }

    const updated = {
      ...appointments[index],
      ...updateData,
      id: appointments[index].id, // Prevent ID tampering
      updatedAt: new Date().toISOString()
    };

    appointments[index] = updated;

    await fs.promises.writeFile(dataFilePath, JSON.stringify(appointments, null, 2), 'utf8');

    // Notify listeners via EventEmitter
    eventNotifier.emit('appointment:updated', updated);

    return updated;
  }

  /**
   * Deletes an appointment by ID
   */
  async delete(id) {
    const appointments = await this.getAll();
    const index = appointments.findIndex(a => a.id === id);

    if (index === -1) {
      return false;
    }

    appointments.splice(index, 1);

    await fs.promises.writeFile(dataFilePath, JSON.stringify(appointments, null, 2), 'utf8');

    // Notify listeners via EventEmitter
    eventNotifier.emit('appointment:deleted', id);

    return true;
  }

  /**
   * Returns a Readable Stream for exporting records
   */
  getReadStream() {
    return fs.createReadStream(dataFilePath, { encoding: 'utf8' });
  }

  /**
   * Returns path to the data file
   */
  getFilePath() {
    return dataFilePath;
  }
}

module.exports = new AppointmentService();

