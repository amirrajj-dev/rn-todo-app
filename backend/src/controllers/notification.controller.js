import asyncHandler from "express-async-handler";
import notificationsModel from "../models/notification.model.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationsModel
    .find({ user: req.userId })
    .sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    message: "Notifications retrieved successfully",
    data: notifications,
  });
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    const error = new Error("Notification ID is required");
    error.status = 400;
    throw error;
  }

  const updatedNotification = await notificationsModel.findOneAndUpdate(
    { _id: id, user: req.userId },
    { $set: { isRead: true } },
    { new: true }
  );

  if (!updatedNotification) {
    const error = new Error("Notification not found or you do not have permission");
    error.status = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Notification marked as read successfully",
    data: updatedNotification,
  });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    const error = new Error("Notification ID is required");
    error.status = 400;
    throw error;
  }

  const deletedNotification = await notificationsModel.findOneAndDelete({ _id: id, user: req.userId });
  if (!deletedNotification) {
    const error = new Error("Notification not found or you do not have permission");
    error.status = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
    data: deletedNotification,
  });
});