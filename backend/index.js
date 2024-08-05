import express from "express";
import { Server } from "socket.io"

const app = express();
const port = 8080;

const server = app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const user = {};

io.on("connection", socket => {
    console.log(socket.id);
    socket.on("new-user", userName => {
        user[socket.id]=userName;
        socket.broadcast.emit("user-connected", userName+" joined.");
    });

    socket.on("send-chat-message", (message) => {
        socket.broadcast.emit("receive-chat-message", user[socket.id]+": "+message);
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnected", user[socket.id]+" disconnected.");
        delete user[socket.id];
    })
});

app.get('/', (req, res) => {
    res.send("<h1>Hello World!</h1>");
});

