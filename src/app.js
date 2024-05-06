import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan";
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
app.use(morgan("dev"));

//routes import
import userRoutes from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import likeRouter from "./routes/like.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import commentRouter from "./routes/comment.routes.js"

//routes declaration
//routes declaration

app.use("/api/users", userRoutes)

app.use("/api/video", videoRouter)
app.use("/api/tweet", tweetRouter)
app.use("/api/subscriptions", subscriptionRouter)
app.use("/api/comment", commentRouter)
app.use("/api/likes", likeRouter)
 app.use("/api/playlist", playlistRouter)
 app.use("/api/dashboard", dashboardRouter)


//    http://localhost:8000/api/users/register


//export default app;
export { app }


