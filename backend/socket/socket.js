import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express'

const app = express()

const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ["GET", "POST"]
    }
})

const userSocketMap = {};

const getResiverSocketId = (resiverId) => {
    return userSocketMap[resiverId]
}

io.on("connection", (socket) => {
    // console.log('Connected user socket ID:', socket.id);

    const { userId } = socket.handshake?.query;

    // Validate userId
    if (!userId) {
        console.log("userId is required from socket side");
        socket.disconnect();
        return; // Prevent further execution for this socket
    }

    // Map the user's ID to the socket ID
    userSocketMap[userId] = socket.id;

    // Emit the updated online users list
    io.emit("onlineUsersList", Object.keys(userSocketMap));

    // Handle socket disconnect
    socket.on("disconnect", () => {
        // Remove the socket ID from the map
        delete userSocketMap[userId];
        io.emit("onlineUsersList", Object.keys(userSocketMap));
    });
});


export { app, io, server, getResiverSocketId }