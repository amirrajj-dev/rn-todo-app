import { Router } from "express";
import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "../controllers/notification.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"


const router = Router();

router.use(authMiddleware)

router.get("/", getNotifications);
router.put("/:id", markNotificationAsRead);
router.put("/mark-all-read" , markAllNotificationsAsRead)
router.delete("/:id", deleteNotification);

export default router;