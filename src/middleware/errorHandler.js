function errorHandler(err, req, res, next) {
  console.error("Error Logged:", err.message);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
}

module.exports = errorHandler;