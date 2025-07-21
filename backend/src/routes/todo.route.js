import {Router} from "express"
import {createTodo , deleteTodo , getTodos , updateTodo} from "../controllers/todo.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router = Router()

router.use(authMiddleware)

router.post('/' , createTodo)
router.get('/' , getTodos)
router.put('/:id' , updateTodo)
router.delete('/:id' , deleteTodo)


export default router;