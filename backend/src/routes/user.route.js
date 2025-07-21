import { Router } from "express";
import { deleteMe, getMe, updateMe } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import uploadMiddleware from "../middlewares/upload.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/me", getMe);
router.put("/me", uploadMiddleware("image"), updateMe);
router.delete("/me", deleteMe);

export default router;