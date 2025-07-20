import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { ENV } from './env.js';

const SALT_ROUNDS = 10;

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: '7d' });
};


export const verifyToken = (token) => {
  try {
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
  } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

export const hashPassword = async (password) => {
  try {
    return await hash(password, SALT_ROUNDS);
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};


export const comparePassword = async (password, hashedPassword) => {
  try {
    return await compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};