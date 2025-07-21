import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import usersModel from "../models/user.model.js";
import todosModel from "../models/todo.model.js";
import notificationsModel from "../models/notification.model.js";

export const createTodo = [
  body("title")
    .trim()
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3, max: 40 })
    .withMessage("Title must be between 3 and 40 characters long"),
  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Description must be between 3 and 100 characters long"),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.errors = errors.array();
      error.status = 400;
      throw error;
    }

    const { title, description, completed, dueDate, priority } = req.body;
    const userId = req.userId;

    const todo = await todosModel.create({
      user: userId,
      title,
      description,
      completed,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
    });

    // Create notification if user wants notifications and dueDate is provided
    if (dueDate) {
      const user = await usersModel.findById(userId);
      if (user && user.wantToGetNotification) {
        await notificationsModel.create({
          user: userId,
          todoId: todo._id,
          message: `Reminder: Task "${title}" is due on ${new Date(
            dueDate
          ).toLocaleDateString()}`,
          type: "reminder",
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: todo,
    });
  }),
];

export const getTodos = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const todos = await todosModel
    .find({
      user: userId,
    })
    .sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    message: "Todos retrieved successfully",
    data: todos,
  });
});

export const updateTodo = [
  body("title")
    .optional()
    .trim()
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3, max: 40 })
    .withMessage("Title must be between 3 and 40 characters"),
  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Description must be between 3 and 100 characters"),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.errors = errors.array();
      error.status = 400;
      throw error;
    }
    const userId = req.userId;
    const todoId = req.params.id;
    if (!todoId) {
      const error = new Error("Todo ID is required");
      error.status = 400;
      throw error;
    }
    const todo = await todosModel.findOne({ _id: todoId, user: userId });
    if (!todo) {
      const error = new Error("Todo not found or you do not have permission");
      error.status = 404;
      throw error;
    }
    const { title, description, completed, priority, dueDate } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;
    if (priority) updates.priority = priority;
    if (dueDate !== undefined)
      updates.dueDate = dueDate ? new Date(dueDate) : null;
    updates.updatedAt = Date.now();
    const updatedTodo = await todosModel.findByIdAndUpdate(todoId, updates, {
      new: true,
    });
    if (!updatedTodo) {
      const error = new Error("Todo not found");
      error.status = 404;
      throw error;
    }
    if (dueDate !== undefined && dueDate) {
      const user = await usersModel.findById(userId);
      if (user && user.wantToGetNotification) {
        await notificationsModel.create({
          user: userId,
          todoId: updatedTodo._id,
          message: `Reminder: Task "${
            updatedTodo.title
          }" due date updated to ${new Date(dueDate).toLocaleDateString()}`,
          type: "update",
        });
      }
    }
    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  }),
];

export const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    const error = new Error("Todo ID is required");
    error.status = 400;
    throw error;
  }

  const deletedTodo = await todosModel.findOneAndDelete({
    _id: id,
    user: req.userId,
  });
  if (!deletedTodo) {
    const error = new Error("Todo not found or you do not have permission");
    error.status = 404;
    throw error;
  }

  // Delete notifications related to the deleted todo
  await notificationsModel.deleteMany({ todoId: deletedTodo._id });

  return res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
    data: deletedTodo, // Optional: included for consistency
  });
});
