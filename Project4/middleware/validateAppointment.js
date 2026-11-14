/**
 * Input Validation Middleware for Appointments
 * Validates request payload before reaching route controllers.
 */
module.exports = function validateAppointment(req, res, next) {
  const isPut = req.method === 'PUT';
  const { patientName, patientPhone, department, doctorName, appointmentDate, appointmentTime, reason, status } = req.body;
  const errors = [];

  // For POST (or PUT if field provided)
  if (!isPut || patientName !== undefined) {
    if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 3) {
      errors.push('patientName is required (minimum 3 characters).');
    }
  }

  if (!isPut || patientPhone !== undefined) {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!patientPhone || !phoneRegex.test(String(patientPhone).trim())) {
      errors.push('patientPhone must be a valid 10-digit mobile number.');
    }
  }

  if (!isPut || department !== undefined) {
    if (!department || typeof department !== 'string' || !department.trim()) {
      errors.push('department is required.');
    }
  }

  if (!isPut || doctorName !== undefined) {
    if (!doctorName || typeof doctorName !== 'string' || !doctorName.trim()) {
      errors.push('doctorName is required.');
    }
  }

  if (!isPut || appointmentDate !== undefined) {
    if (!appointmentDate || isNaN(Date.parse(appointmentDate))) {
      errors.push('appointmentDate must be a valid date in YYYY-MM-DD format.');
    }
  }

  if (!isPut || appointmentTime !== undefined) {
    if (!appointmentTime || typeof appointmentTime !== 'string') {
      errors.push('appointmentTime is required.');
    }
  }

  if (!isPut || reason !== undefined) {
    if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
      errors.push('reason must be at least 5 characters long.');
    }
  }

  if (status !== undefined) {
    const validStatuses = ['Scheduled', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      errors.push(`status must be one of: ${validStatuses.join(', ')}.`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors
    });
  }

  next();
};

