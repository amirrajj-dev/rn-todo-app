import {Router} from "express"
import {deleteMe , getMe , updateMe} from "../controllers/user.controller.js"

const router = Router()

router.get("/me" , getMe)
router.put("/me" , updateMe)
router.delete("/me" , deleteMe)

export default router