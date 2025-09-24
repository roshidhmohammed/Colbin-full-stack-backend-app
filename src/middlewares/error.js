class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Mongo invalid ObjectId
  if (err.name === "CastError") {
    err = new ErrorHandler(`Resource not found. Invalid ${err.path}`, 400);
  }

  // Duplicate key
  if (err.code === 11000) {
    err = new ErrorHandler(
      `Duplicate field value entered: ${JSON.stringify(err.keyValue)}`,
      400
    );
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { ErrorHandler, errorHandler };
