const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let activeRooms = {};

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("joinRoom", ({ name, password }) => {
        let roomKey = name + "_" + password;
        if (!activeRooms[roomKey]) activeRooms[roomKey] = [];
        activeRooms[roomKey].push(socket.id);

        socket.join(roomKey);
        socket.emit("joined", "✅ Connected to private room!");
    });

    socket.on("chatMessage", ({ roomKey, msg }) => {
        io.to(roomKey).emit("chatMessage", msg);
    });

    socket.on("sendFile", ({ roomKey, fileData, fileType }) => {
        io.to(roomKey).emit("receiveFile", { fileData, fileType });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

http.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});