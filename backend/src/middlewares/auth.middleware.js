import asyncHandler from 'express-async-handler';
import { verifyToken } from '../utils/auth.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
});

export default authMiddleware;