/**
 * Request Logging Middleware
 * Logs incoming HTTP method, URL, timestamp, and response status code.
 */
module.exports = function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const color = statusCode >= 400 ? '\x1b[31m' : statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
    console.log(`[${timestamp}] ${color}${req.method} ${req.originalUrl} ${statusCode}\x1b[0m - ${duration}ms`);
  });

  next();
};

