import express from "express"

// middlewares
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"

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

app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)
})