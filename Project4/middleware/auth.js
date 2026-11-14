/**
 * JWT Authentication Middleware
 * Protects sensitive routes by verifying Bearer token.
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hospital_appointment_secret_jwt_key_2026';

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Access Denied',
      message: 'Authorization header with Bearer token is required.'
    });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access Denied',
      message: 'Malformed authorization token.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains { id, username, role }
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or Expired Token',
      message: err.message
    });
  }
};

