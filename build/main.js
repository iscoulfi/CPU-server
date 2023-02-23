import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import authRoute from './routes/auth.js';
import collectRoute from './routes/collections.js';
import itemRoute from './routes/items.js';
import commentRoute from './routes/comments.js';
const app = express();
dotenv.config();
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/collections', collectRoute);
app.use('/api/items', itemRoute);
app.use('/api/comments', commentRoute);
const startApp = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(DB_URL);
    }
    catch (error) {
        console.log(error);
    }
};
startApp();
const server = app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
const io = new Server(server, {
    cors: {
        origin: process.env.SERV_ORIGIN,
        credentials: true,
    },
});
global.onlineUsers = new Map();
let users = [];
io.on('connection', (socket) => {
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on('logout-user', (userId) => {
        const sendUserSocket = onlineUsers.get(userId);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('logout');
        }
    });
    socket.on('change-role', (userId) => {
        const sendUserSocket = onlineUsers.get(userId);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('refresh-role');
        }
    });
    socket.on('joinRoom', (itemId) => {
        const user = { userId: socket.id, room: itemId };
        const check = users.every((user) => user.userId !== socket.id);
        if (check) {
            users.push(user);
            socket.join(user.room);
        }
        else {
            users.map((user) => {
                if (user.userId === socket.id) {
                    if (user.room !== itemId) {
                        socket.leave(user.room);
                        socket.join(itemId);
                        user.room = itemId;
                    }
                }
            });
        }
    });
    socket.on('refresh', (itemId) => {
        socket.to(itemId).emit('refresh-comments', itemId);
    });
});
//# sourceMappingURL=main.js.map