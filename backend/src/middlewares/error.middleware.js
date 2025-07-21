import { ENV } from '../utils/env.js';

export const errorMiddleware = (err, req, res, next) => {
  if (ENV.NODE_ENV === 'development') {
    console.error({
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  } else {
    console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);
  }

  const response = {
    success: false,
    message: 'Internal Server Error',
    errors: [],
  };

  if (err.name === 'ValidationError') {
    response.status = 400;
    response.message = 'Validation failed';
    response.errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === 'CastError') {
    response.status = 400;
    response.message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'TokenExpiredError') {
    response.status = 401;
    response.message = 'Token expired';
  } else if (err.name === 'JsonWebTokenError') {
    response.status = 401;
    response.message = 'Invalid token';
  } else if (err.name === 'MulterError') {
    response.status = 400;
    response.message = err.code === 'LIMIT_FILE_SIZE' ? 'File too large' : 'File upload error';
  } else if (err.errors && Array.isArray(err.errors)) {
    response.status = 400;
    response.message = 'Validation failed';
    response.errors = err.errors.map((e) => ({
      field: e.param,
      message: e.msg,
    }));
  } else {
    response.status = err.status || 500;
    response.message = ENV.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  }

  res.status(response.status).json(response);
};

export default errorMiddleware;