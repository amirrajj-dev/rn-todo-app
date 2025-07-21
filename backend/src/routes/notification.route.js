import { Router } from "express";
import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead
} from "../controllers/notification.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"


const router = Router();

router.use(authMiddleware)

router.get("/", getNotifications);
router.put("/:id", markNotificationAsRead);
router.delete("/:id", deleteNotification);

export default router;