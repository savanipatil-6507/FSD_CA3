/**
 * Centralized Error Handling Middleware
 */
module.exports = function centralizedErrorHandler(err, req, res, next) {
  console.error('Unhandled Server Error:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      message: message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    }
  });
};

