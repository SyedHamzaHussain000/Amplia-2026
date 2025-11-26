import app from "./app";
import { Request, Response } from "express"
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db";
import { port } from "./config/env";

const httpServer = createServer(app)
connectDB()

const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
})

app.set("socketio", io);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Louisiana server!')
})

io.on("connection", (socket) => {
    console.log("🟢 Client connected");

    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected");
    })
})

httpServer.listen(port, () => {
    console.log(`Server started on port:${port}`);
})
