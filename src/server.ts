import app from "./app";
import { Request, Response } from "express"
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db";
import { port } from "./config/env";
import { initializeDefaultSettings } from "./controllers/settings";

const httpServer = createServer(app)

// Connect to DB and initialize default settings
connectDB().then(() => {
    initializeDefaultSettings();
});

// const io = new Server(httpServer, {
//     cors: {
//         origin: '*'
//     }
// })

const io = new Server(server, {
    path: "/socket.io",
    cors: {
        origin: ["https://apiforapp.link"],
        methods: ["GET", "POST"]
    },
    transports: ["websocket", "polling"]
});


app.set("socketio", io);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Amplia server!')
})

io.on("connection", (socket) => {
    console.log("🟢 Client connected", socket.id);

    // JOIN ROOM
    socket.on("join_room", (roomId) => {
        console.log("Client joined room:", roomId);
        socket.join(roomId);
    });

    // LEAVE ROOM
    socket.on("leave_room", (chatId) => {
        socket.leave(chatId);
        console.log("Client left room:", chatId);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected");
    })
})

httpServer.listen(port, () => {
    console.log(`Server started on port:${port}`);
})
