import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import usersModel from '../models/user.model.js';
import refreshTokenModel from '../models/refreshToken.model.js';
import { generateAccessToken, generateRefreshToken, comparePassword, hashPassword } from '../utils/auth.js';

const avatars = [
  'boy1.png',
  'boy2.png',
  'boy3.png',
  'girl1.png',
  'girl2.png',
  'girl3.png',
];

export const register = [
  body('username')
    .isLength({ min: 3 })
    .trim()
    .withMessage('Username must be at least 3 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email'),
  body('password')
    .isLength({ min: 8, max: 12 })
    .withMessage('Password must be between 8 and 12 characters'),
  body('gender')
    .isIn(['male', 'female'])
    .withMessage('Gender must be either male or female'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.errors = errors.array();
      error.status = 400;
      throw error;
    }

    const { username, email, password, gender } = req.body;

    const existingUser = await usersModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const error = new Error(
        existingUser.email === email ? 'Email already exists' : 'Username already exists'
      );
      error.status = 400;
      throw error;
    }

    // Assign random avatar based on gender
    const avatarOptions = gender === 'male' ? avatars.slice(0, 3) : avatars.slice(3);
    const profilePic = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];

    const hashedPassword = await hashPassword(password);

    const user = await usersModel.create({
      username,
      email,
      password: hashedPassword,
      gender,
      profilePic,
      wantToGetNotification: true,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await refreshTokenModel.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          gender: user.gender,
          profilePic: user.profilePic,
        },
        accessToken,
        refreshToken,
      },
    });
  }),
];

export const login = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.errors = errors.array();
      error.status = 400;
      throw error;
    }

    const { email, password } = req.body;
    const user = await usersModel.findOne({ email });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await refreshTokenModel.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          gender: user.gender,
          profilePic: user.profilePic,
        },
        accessToken,
        refreshToken,
      },
    });
  }),
];

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    const error = new Error('Refresh token required');
    error.status = 401;
    throw error;
  }

  const decoded = verifyToken(refreshToken);
  const storedToken = await refreshTokenModel.findOne({ token: refreshToken, userId: decoded.userId });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    const error = new Error('Invalid or expired refresh token');
    error.status = 401;
    throw error;
  }

  const accessToken = generateAccessToken(decoded.userId);
  return res.json({
    success: true,
    message: 'Token refreshed',
    data: { accessToken },
  });
});

export const logout = asyncHandler(async (req, res) => {
  await refreshTokenModel.deleteMany({ userId: req.userId });
  return res.json({ success: true, message: 'Logged out successfully' });
});