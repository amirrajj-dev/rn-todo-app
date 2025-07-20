import express from "express"

// middlewares
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"

//routes
import userRoutes from "./routes/user.route.js"
import notificationRoutes from "./routes/notification.route.js"
import authRoutes from "./routes/auth.route.js"
import todoRoutes from "./routes/todo.route.js"

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(helmet({
    crossOriginResourcePolicy: false ,
    contentSecurityPolicy : false
}))
app.use(morgan("dev"))

app.get("/" , (req , res)=>{
    res.send("Hello World")
})

app.use("/api/todos" , todoRoutes)
app.use("/api/users" , userRoutes)
app.use("/api/notifications" , notificationRoutes)
app.use("/api/auth" , authRoutes)

app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)
})