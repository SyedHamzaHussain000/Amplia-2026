import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors"
import authRouter from "./routes/auth"
import adminRouter from "./routes/admin"
import subAdminRouter from "./routes/subAdmin"
import categoryRouter from "./routes/category"
import serviceRouter from "./routes/service"
import ratingRouter from "./routes/rating"
import boookingRouter from "./routes/booking"
import fileRouter from "./routes/file"
import chatRouter from "./routes/chat"
import userRouter from "./routes/user"

const app: Application = express();

app.use(cors())
app.use(bodyParser.json())

app.use("/uploads", express.static("uploads"));

app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/subAdmin', subAdminRouter)
app.use('/category', categoryRouter)
app.use('/service', serviceRouter)
app.use('/rating', ratingRouter)
app.use('/booking', boookingRouter)
app.use('/file', fileRouter)
app.use('/chat', chatRouter)
app.use('/user', userRouter)

export default app;