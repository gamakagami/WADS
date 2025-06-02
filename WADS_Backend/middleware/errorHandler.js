const errorHandler = (err, req, res, next) => {
  // If no status code was set, use 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401);
    res.json({
      message: 'Invalid token',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
    return;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    res.status(400);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
    return;
  }

  // Handle all other errors
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;
  