import { Router } from "express";
import { login, logout, refreshToken, register } from '../controllers/auth.controller.js';
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logout);

export default router;