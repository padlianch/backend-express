/**
 * Send consistent error response
 * Only exposes error details in development mode
 */
const sendErrorResponse = (res, statusCode = 500, message = 'Server error.', error = null) => {
  const response = {
    success: false,
    message
  };

  // Only expose error details in development
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error.message || error;
  }

  return res.status(statusCode).json(response);
};

module.exports = { sendErrorResponse };
