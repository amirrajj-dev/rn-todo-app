import {Router} from "express"
import {deleteMe , getMe , updateMe} from "../controllers/user.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import upload from "../middlewares/upload.middleware.js"


const router = Router()

router.get("/me" , authMiddleware , getMe)
router.put("/me" , authMiddleware , upload.single("image") , updateMe)
router.delete("/me" , deleteMe)

export default router;