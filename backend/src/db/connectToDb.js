import mongoose from "mongoose"
import { ENV } from "../utils/env.js"

export const connectToDb = async ()=>{
    try {
        if (mongoose.connections[0].readyState){
            console.log("Already Connected To DB 🐧💙")
            return
        }
        await mongoose.connect(ENV.MONGODB_URI).then(()=>{
            console.log("Connected To DB Succesfully 🐧💙")
        }) 
    } catch (error) {
        console.log("Error Connecting To DB 🐧😔")
        process.exit(1)
    }
}