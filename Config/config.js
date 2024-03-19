import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

export const connectionDB = async () =>{
    try{
        const con =await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected to MongoDB: ${con.connection.host}`)
}catch(err) {
    console.log("Error while connecting database",err)
}}

//database connection