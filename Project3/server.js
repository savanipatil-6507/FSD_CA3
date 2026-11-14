/**
 * Hospital Appointment Server
 * Built exclusively using Node.js core modules (http, fs, path, events, stream).
 * No Express or third-party web frameworks used.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const appointmentService = require('./appointmentService');
const eventNotifier = require('./eventNotifier');

const PORT = process.env.PORT || 4000;

/**
 * Helper to write JSON responses
 */
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload, null, 2));
}

/**
 * Helper to collect and parse incoming JSON request body stream
 */
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Guard against payload flooding (max 1MB)
      if (body.length > 1e6) {
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });

    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON format in request body'));
      }
    });

    req.on('error', err => reject(err));
  });
}

/**
 * Validation utility for appointment creation/updates
 */
function validateAppointmentInput(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate || data.patientName !== undefined) {
    if (!data.patientName || typeof data.patientName !== 'string' || data.patientName.trim().length < 3) {
      errors.push('patientName is required (minimum 3 characters).');
    }
  }

  if (!isUpdate || data.patientPhone !== undefined) {
    const phonePattern = /^[6-9]\d{9}$/;
    if (!data.patientPhone || !phonePattern.test(String(data.patientPhone).trim())) {
      errors.push('patientPhone must be a valid 10-digit phone number.');
    }
  }

  if (!isUpdate || data.department !== undefined) {
    if (!data.department || typeof data.department !== 'string' || !data.department.trim()) {
      errors.push('department is required.');
    }
  }

  if (!isUpdate || data.doctorName !== undefined) {
    if (!data.doctorName || typeof data.doctorName !== 'string' || !data.doctorName.trim()) {
      errors.push('doctorName is required.');
    }
  }

  if (!isUpdate || data.appointmentDate !== undefined) {
    if (!data.appointmentDate || isNaN(Date.parse(data.appointmentDate))) {
      errors.push('appointmentDate must be a valid date format (YYYY-MM-DD).');
    }
  }

  if (!isUpdate || data.appointmentTime !== undefined) {
    if (!data.appointmentTime || typeof data.appointmentTime !== 'string') {
      errors.push('appointmentTime is required (e.g. "10:30").');
    }
  }

  if (!isUpdate || data.reason !== undefined) {
    if (!data.reason || typeof data.reason !== 'string' || data.reason.trim().length < 4) {
      errors.push('reason must contain at least 4 characters.');
    }
  }

  return errors;
}

// Create native HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  try {
    // ----------------------------------------------------
    // Root Information Endpoint
    // ----------------------------------------------------
    if (pathname === '/' && method === 'GET') {
      sendJson(res, 200, {
        service: 'City Care Hospital Appointment Utility (Core Node.js)',
        status: 'Online',
        modulesUsed: ['http', 'fs', 'path', 'events', 'stream'],
        endpoints: [
          { method: 'GET', path: '/api/appointments', desc: 'Retrieve all appointment records' },
          { method: 'GET', path: '/api/appointments/:id', desc: 'Retrieve single appointment by ID' },
          { method: 'POST', path: '/api/appointments', desc: 'Create a new appointment' },
          { method: 'PUT', path: '/api/appointments/:id', desc: 'Update existing appointment' },
          { method: 'DELETE', path: '/api/appointments/:id', desc: 'Delete appointment' },
          { method: 'GET', path: '/api/appointments/stream/export', desc: 'Stream appointment data as attachment' },
          { method: 'GET', path: '/api/logs', desc: 'Read event notification audit logs' }
        ]
      });
      return;
    }

    // ----------------------------------------------------
    // Stream Export: Streams records directly using fs.createReadStream
    // ----------------------------------------------------
    if (pathname === '/api/appointments/stream/export' && method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="appointments-export.json"'
      });
      const readStream = appointmentService.getReadStream();
      readStream.on('error', (err) => {
        sendJson(res, 500, { error: 'Failed to stream records file.', details: err.message });
      });
      readStream.pipe(res);
      return;
    }

    // ----------------------------------------------------
    // Audit Logs Endpoint
    // ----------------------------------------------------
    if (pathname === '/api/logs' && method === 'GET') {
      const logPath = eventNotifier.logFilePath;
      if (!fs.existsSync(logPath)) {
        sendJson(res, 200, { logs: [] });
        return;
      }
      const logs = await fs.promises.readFile(logPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(logs);
      return;
    }

    // ----------------------------------------------------
    // GET /api/appointments - List All Appointments
    // ----------------------------------------------------
    if (pathname === '/api/appointments' && method === 'GET') {
      const appointments = await appointmentService.getAll();
      sendJson(res, 200, {
        count: appointments.length,
        appointments
      });
      return;
    }

    // ----------------------------------------------------
    // POST /api/appointments - Create New Appointment
    // ----------------------------------------------------
    if (pathname === '/api/appointments' && method === 'POST') {
      const body = await parseJsonBody(req);
      const errors = validateAppointmentInput(body);

      if (errors.length > 0) {
        sendJson(res, 400, {
          success: false,
          error: 'Validation Failed',
          details: errors
        });
        return;
      }

      const created = await appointmentService.create(body);
      sendJson(res, 201, {
        success: true,
        message: 'Appointment successfully created and notification dispatched.',
        data: created
      });
      return;
    }

    // ----------------------------------------------------
    // Match /api/appointments/:id
    // ----------------------------------------------------
    const appointmentIdMatch = pathname.match(/^\/api\/appointments\/([a-zA-Z0-9\-_]+)$/);

    if (appointmentIdMatch) {
      const appointmentId = appointmentIdMatch[1];

      // GET Single
      if (method === 'GET') {
        const appointment = await appointmentService.getById(appointmentId);
        if (!appointment) {
          sendJson(res, 404, { success: false, error: `Appointment ${appointmentId} not found.` });
          return;
        }
        sendJson(res, 200, { success: true, data: appointment });
        return;
      }

      // PUT Update
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const errors = validateAppointmentInput(body, true);

        if (errors.length > 0) {
          sendJson(res, 400, { success: false, error: 'Validation Failed', details: errors });
          return;
        }

        const updated = await appointmentService.update(appointmentId, body);
        if (!updated) {
          sendJson(res, 404, { success: false, error: `Appointment ${appointmentId} not found.` });
          return;
        }

        sendJson(res, 200, {
          success: true,
          message: 'Appointment updated successfully.',
          data: updated
        });
        return;
      }

      // DELETE
      if (method === 'DELETE') {
        const deleted = await appointmentService.delete(appointmentId);
        if (!deleted) {
          sendJson(res, 404, { success: false, error: `Appointment ${appointmentId} not found.` });
          return;
        }

        sendJson(res, 200, {
          success: true,
          message: `Appointment ${appointmentId} was successfully deleted.`
        });
        return;
      }
    }

    // 404 Not Found fallback
    sendJson(res, 404, {
      error: 'Not Found',
      message: `The route ${method} ${pathname} does not exist.`
    });

  } catch (error) {
    console.error('Internal Server Error:', error);
    sendJson(res, 500, {
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred.'
    });
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏥 Hospital Appointment Core Node.js Server Utility`);
    console.log(`🚀 Running at http://localhost:${PORT}`);
    console.log(`📡 Storage: File System (fs) & Path module`);
    console.log(`🔔 Notifications: EventEmitter & Writable Stream`);
    console.log(`=======================================================`);
  });
}

module.exports = server;

