import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import usersModel from "../models/user.model.js";
import todosModel from "../models/todo.model.js";
import notificationsModel from "../models/notification.model.js";
import refreshTokenModel from "../models/refreshToken.model.js";
import { hashPassword } from "../utils/auth.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryActions.js";

export const getMe = asyncHandler(async (req, res) => {
  const user = await usersModel.findById(req.userId).select("-password");
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

export const updateMe = [
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email"),
  body("password")
    .optional()
    .isLength({ min: 8, max: 12 })
    .withMessage("Password must be between 8 and 12 characters"),
  body("username")
    .optional()
    .isLength({ min: 3 })
    .trim()
    .withMessage("Username must be at least 3 characters"),
  body("wantToGetNotification")
    .optional()
    .isBoolean()
    .withMessage("wantToGetNotification must be a boolean"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.errors = errors.array();
      error.status = 400;
      throw error;
    }

    const { username, email, password, wantToGetNotification } = req.body;
    const updates = {};

    if (username) {
      const existingUser = await usersModel.findOne({
        username,
        _id: { $ne: req.userId },
      });
      if (existingUser) {
        const error = new Error("Username already exists");
        error.status = 400;
        throw error;
      }
      updates.username = username;
    }

    if (email) {
      const existingUser = await usersModel.findOne({
        email,
        _id: { $ne: req.userId },
      });
      if (existingUser) {
        const error = new Error("Email already exists");
        error.status = 400;
        throw error;
      }
      updates.email = email;
    }

    if (password) updates.password = await hashPassword(password);

    if (wantToGetNotification !== undefined)
      updates.wantToGetNotification = wantToGetNotification;

    // Handle profile picture update
    if (req.file) {
      try {
        const user = await usersModel.findById(req.userId);
        if (!user) {
          const error = new Error("User not found");
          error.status = 404;
          throw error;
        }

        if (user.profilePublicId) {
          await deleteFromCloudinary(user.profilePublicId, "image");
        }

        // Upload new image to Cloudinary
        const { secure_url, public_id } = await uploadToCloudinary(req.file);
        updates.profilePic = secure_url;
        updates.profilePublicId = public_id;
      } catch (error) {
        const uploadError = new Error("Failed to upload profile picture");
        uploadError.status = 500;
        throw uploadError;
      }
    }

    const user = await usersModel
      .findByIdAndUpdate(req.userId, updates, { new: true })
      .select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  }),
];

export const deleteMe = asyncHandler(async (req, res) => {
  const user = await usersModel.findById(req.userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  // Delete profile picture from Cloudinary if it exists
  if (user.profilePublicId) {
    try {
      await deleteFromCloudinary(user.profilePublicId, "image");
    } catch (error) {
      const deleteError = new Error(
        "Failed to delete profile picture from Cloudinary"
      );
      deleteError.status = 500;
      throw deleteError;
    }
  }

  // Delete user and related data
  await usersModel.findByIdAndDelete(req.userId);
  await todosModel.deleteMany({ user: req.userId });
  await notificationsModel.deleteMany({ user: req.userId });
  await refreshTokenModel.deleteMany({ userId: req.userId });

  return res
    .status(200)
    .json({ success: true, message: "User account deleted successfully" });
});