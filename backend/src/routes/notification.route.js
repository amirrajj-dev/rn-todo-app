import { Router } from "express";
import {
  createNotification,
  deleteNotification,
  getNotification,
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller.js";

const router = Router();

router.post("/", createNotification);
router.get("/", getNotifications);
router.get("/:id", getNotification);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;
