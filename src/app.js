import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
//express ke saath json ko config kar rahe hain
//excepting json files
app.use(express.json({ limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRoutes from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"

//routes declaration
//routes declaration

app.use("/api/users", userRoutes)

app.use("/api/videos", videoRouter)
// app.use("/api/comments", commentRouter)
// app.use("/api/likes", likeRouter)
// app.use("/api/playlist", playlistRouter)
// app.use("/api/dashboard", dashboardRouter)


//    http://localhost:8000/api/users/register


//export default app;
export { app }


