import asyncHandler from 'express-async-handler';
import { verifyToken } from '../utils/auth.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    const error = new Error('No token provided');
    error.status = 401;
    throw error;
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    const err = new Error('Invalid token');
    err.status = 401;
    throw err;
  }
});

export default authMiddleware;