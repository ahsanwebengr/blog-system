/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ error: `${field} already exists` });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
