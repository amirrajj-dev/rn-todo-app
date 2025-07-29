import asyncHandler from "express-async-handler";
import notificationsModel from "../models/notification.model.js";
import todosModel from "../models/todo.model.js";
import usersModel from "../models/user.model.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const now = new Date();

  // Find overdue todos for the user
  const overdueTodos = await todosModel.find({
    user: userId,
    dueDate: { $lt: now },
    completed: false,
  });

  // Create overdue notifications if they don't exist
  for (const todo of overdueTodos) {
    const existingNotification = await notificationsModel.findOne({
      user: userId,
      todoId: todo._id,
      type: 'overdue',
    });

    if (!existingNotification) {
      const user = await usersModel.findById(userId);
      if (user && user.wantToGetNotification) {
        await notificationsModel.create({
          user: userId,
          todoId: todo._id,
          message: `Task "${todo.title}" is overdue! Due date was ${new Date(todo.dueDate).toLocaleDateString()}.`,
          type: 'overdue',
          isRead: false,
        });
      }
    }
  }

  const notifications = await notificationsModel
    .find({ user: userId })
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

export const markAllNotificationsAsRead = asyncHandler(async (req , res)=>{
  const {userId} = req
  if (!userId){
    const error = new Error("User ID is required");
    error.status = 400;
    throw error;
  }
  const notifications = await notificationsModel.updateMany({user:userId},{isRead:true})
  if (!notifications){
    const error = new Error("Notifications not found or you do not have permission");
    error.status = 404;
    throw error;
  }
  const updatedNotifications = await notificationsModel.find({ user: userId });
  return res.status(200).json({
    success: true,
    message: "All notifications marked as read successfully",
    data: updatedNotifications
  })
})