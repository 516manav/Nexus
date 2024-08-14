export default function socketSetup(io) {
    const user = {};
    
    io.on("connection", socket => {
        console.log(socket.id);
        socket.on("new-user", userName => {
            user[socket.id] = userName;
            socket.broadcast.emit("user-connected", userName + " joined.");
        });

        socket.on("send-chat-message", message => {
            socket.broadcast.emit("receive-chat-message", user[socket.id] + ": " + message);
        });

        socket.on("disconnect", () => {
            socket.broadcast.emit("user-disconnected", user[socket.id] + " disconnected.");
            delete user[socket.id];
        });
    });
}