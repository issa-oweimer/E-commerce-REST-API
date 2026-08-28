function errorHandler(err, req, res, next) {
  
  console.error(`[${new Date().toISOString()}] Error occurred:`, err.message);

  const statusCode = err.status || err.statusCode || 500;
  
  
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
  });
}

module.exports = errorHandler;