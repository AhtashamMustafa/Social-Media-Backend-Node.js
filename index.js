import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"
import  {connectionDB} from "./Config/config.js"
import  usersRoute from "./routes/users.js";
import  authRoute from "./routes/auth.js";
import  postsRoute from "./routes/posts.js";

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(helmet())
app.use(morgan("common"));

app.use("/api/users", usersRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postsRoute)

















let port=process.env.PORT ||3000
connectionDB().then((e)=>{
    app.listen(port,()=>{
        console.log(`Backend server is running on port ${port}`);
    });
}).catch((e)=>{
    console.log("Error in connecting to the database on index ==>", e);
})
