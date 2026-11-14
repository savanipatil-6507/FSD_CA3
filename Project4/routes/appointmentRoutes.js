/**
 * CRUD Routes for Hospital Appointments
 * Includes validation middleware and JWT protected routes.
 */
const express = require('express');
const store = require('../data/store');
const validateAppointment = require('../middleware/validateAppointment');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

/**
 * 1. GET /api/appointments
 * Retrieves all appointments, with optional filtering by status and search keyword
 */
router.get('/', (req, res, next) => {
  try {
    const { status, search } = req.query;
    let list = [...store.appointments];

    if (status && status !== 'ALL') {
      list = list.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 2. GET /api/appointments/admin/stats
 * [PROTECTED ROUTE] Requires valid JWT token
 * Provides aggregate appointment statistics for medical admins
 */
router.get('/admin/stats', authenticateToken, (req, res, next) => {
  try {
    const total = store.appointments.length;
    const scheduled = store.appointments.filter(a => a.status === 'Scheduled').length;
    const completed = store.appointments.filter(a => a.status === 'Completed').length;
    const cancelled = store.appointments.filter(a => a.status === 'Cancelled').length;

    res.status(200).json({
      success: true,
      authorizedUser: req.user.username,
      role: req.user.role,
      analytics: {
        totalAppointments: total,
        scheduled,
        completed,
        cancelled,
        completionRate: total > 0 ? `${((completed / total) * 100).toFixed(1)}%` : '0%'
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 3. GET /api/appointments/:id
 * Retrieves single appointment by ID
 */
router.get('/:id', (req, res, next) => {
  try {
    const appointment = store.appointments.find(a => a.id === req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Appointment with ID #${req.params.id} does not exist.`
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 4. POST /api/appointments
 * Creates new appointment; protected by validateAppointment middleware
 */
router.post('/', validateAppointment, (req, res, next) => {
  try {
    const { patientName, patientPhone, department, doctorName, appointmentDate, appointmentTime, reason } = req.body;

    const newAppointment = {
      id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      department: department.trim(),
      doctorName: doctorName.trim(),
      appointmentDate,
      appointmentTime,
      reason: reason.trim(),
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };

    store.appointments.unshift(newAppointment);

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully.',
      data: newAppointment
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 5. PUT /api/appointments/:id
 * Updates appointment details or status; protected by validateAppointment middleware
 */
router.put('/:id', validateAppointment, (req, res, next) => {
  try {
    const index = store.appointments.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Appointment with ID #${req.params.id} does not exist.`
      });
    }

    const current = store.appointments[index];
    const updated = {
      ...current,
      ...req.body,
      id: current.id, // prevent changing ID
      updatedAt: new Date().toISOString()
    };

    store.appointments[index] = updated;

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 6. DELETE /api/appointments/:id
 * [PROTECTED ROUTE] Requires valid JWT token
 * Deletes an appointment from the system
 */
router.delete('/:id', authenticateToken, (req, res, next) => {
  try {
    const index = store.appointments.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Appointment with ID #${req.params.id} does not exist.`
      });
    }

    const removed = store.appointments.splice(index, 1)[0];

    res.status(200).json({
      success: true,
      message: `Appointment #${req.params.id} was successfully deleted by ${req.user.username}.`,
      data: removed
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

