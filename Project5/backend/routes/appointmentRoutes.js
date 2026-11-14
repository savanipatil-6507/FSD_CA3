const express = require('express');
const { Appointment } = require('../models/Appointment');

const router = express.Router();

/**
 * GET /api/appointments
 * Retrieve all records from database
 */
router.get('/', async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const appointments = await Appointment.findAll({
      where,
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
    });

    let result = appointments;
    if (search) {
      const q = search.toLowerCase();
      result = appointments.filter(a =>
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q) ||
        a.appointmentNumber.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/appointments/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Appointment with ID ${req.params.id} does not exist.`
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
 * POST /api/appointments
 * Validate and insert record into database
 */
router.post('/', async (req, res, next) => {
  try {
    const { patientName, patientPhone, department, doctorName, appointmentDate, appointmentTime, reason } = req.body;

    // Basic Input Validation
    if (!patientName || !patientPhone || !department || !doctorName || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'All fields are required.'
      });
    }

    const appointmentNumber = 'APT-' + Math.floor(1000 + Math.random() * 9000);

    const newAppointment = await Appointment.create({
      appointmentNumber,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      department: department.trim(),
      doctorName: doctorName.trim(),
      appointmentDate,
      appointmentTime,
      reason: reason.trim(),
      status: 'Scheduled'
    });

    res.status(201).json({
      success: true,
      message: 'Appointment successfully created in database.',
      data: newAppointment
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/appointments/:id
 * Update status or fields
 */
router.put('/:id', async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Appointment with ID ${req.params.id} does not exist.`
      });
    }

    const { status, appointmentDate, appointmentTime, reason } = req.body;

    if (status) appointment.status = status;
    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (appointmentTime) appointment.appointmentTime = appointmentTime;
    if (reason) appointment.reason = reason;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully in database.',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/appointments/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Appointment with ID ${req.params.id} does not exist.`
      });
    }

    await appointment.destroy();

    res.status(200).json({
      success: true,
      message: `Appointment ${req.params.id} deleted from database.`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

