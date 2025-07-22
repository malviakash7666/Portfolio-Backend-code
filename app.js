import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import ConnectToDB from "./dbConnection/dbConnection.js";
import { errorMiddleware } from "./middleware/errors.js";
import messageRouter from "./routes/messageRoute.js"
import userRouter from "./routes/userRouter.js"
import timelineRouter from "./routes/timelineRoute.js"
import applicationRouter from "./routes/softwareApplicationRoute.js"
import skillRouter from "./routes/skillRoute.js"
import projectRouter from "./routes/projectRoute.js"
const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

app.use("/user/api/message",messageRouter)
app.use("/user/api/user",userRouter)
app.use("/user/api/timeline",timelineRouter)
app.use("/user/api/application",applicationRouter)
app.use("/user/api/skill",skillRouter)
app.use("/user/api/project",projectRouter)

app.use(errorMiddleware)
ConnectToDB()
export default app;
