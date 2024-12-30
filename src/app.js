const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const socketConfig = require('./config/socketConfig');
require('dotenv').config();
const path = require('path');
const services = require('./services');
const Message = require('./model/Message');
const ChatList = require('./model/ChatList');
// const { services } = require('./services');

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

// app.use(express.static(path.resolve("./public")))
// app.get('/', (req, res) => {
//     return res.sendFile("/public/index.html")
// })
const io = new Server(server, {
    // cors: {
    //     origin: '*',
    //     methods:['GET', 'POST'],
    //     // allowedHeaders: ['Content-Type', 'Authorization'],
    //     credentials: true,
    //     // preflightContinue: false,
    // },
    cors: {
        origin: 'http://localhost:3000', // Frontend URL
        methods: ['GET', 'POST'],       // Allowed methods
        allowedHeaders: ['Content-Type'],
        credentials: true               // Include credentials if necessary
    }
});

const userRooms = new Map();
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Check if the socket is connected
    // console.log(`Is socket connected? ${socket.connected}`);
    // socket.on('socket-message', message => {
    //     console.log("new mesage", message);
    // socket.on('message', (message) => {
    //     // io.emit('newMessage',    message);
    //     // console.log("new mesage", message);
    //     // socket.broadcast.emit('newMessage', message);
    //     // io.to(message.room).emit('newMessage', message);
    //     // io.to(message.room).emit('messageStatusUpdate', {
    //     //     messageId: message._id,
    //     //     status: message.status,
    //     // });
    // })
    // socket.on('message', async ({ content, senderId, receiverId }) => {
    //     try {
    //         console.log("Received message event", { content, senderId, receiverId });

    //         // Create and save the message to the database
    //         const message = new Message({
    //             content,
    //             sender: senderId,
    //             receiver: receiverId,
    //             timestamp: new Date(),
    //         });

    //         console.log("Saving message to database:", message);
    //         await message.save();
    //         console.log(`Message saved: ${message}`);

    //         // Emit the message to both the sender and receiver
    //         console.log(`Emitting message to sender: ${senderId}`);
    //         io.to(senderId).emit('newMessage', {
    //             content: message.content,
    //             senderId: message.sender,
    //             receiverId: message.receiver,
    //             timestamp: message.timestamp,
    //             status: message.status, // e.g., delivered, read
    //         });

    //         console.log(`Emitting message to receiver: ${receiverId}`);
    //         io.to(receiverId).emit('newMessage', {
    //             content: message.content,
    //             senderId: message.sender,
    //             receiverId: message.receiver,
    //             timestamp: message.timestamp,
    //             status: message.status,
    //         });
    //     } catch (err) {
    //         console.error(`Error handling message: ${err.message}`);
    //         socket.emit('error', { message: 'Failed to send message.' });
    //     }
    // });
    // socket.on("joinRoom", ({ roomId }) => {
    //     socket.join(roomId);
    //     console.log(`User joined room: ${roomId}`);
    // });

    socket.on("joinRoom", ({ userId, authorId }) => {
        console.log(`is joining room with ${userId}  ${authorId}`);
        const sortedIds = [userId, authorId].sort(); // Ensure consistent room ID
        const roomId = `${sortedIds[0]}-${sortedIds[1]}`;
        socket.join(roomId);

        console.log(`${userId} joined room ${roomId}`);

        // Track user rooms
        if (!userRooms.has(userId)) {
            userRooms.set(userId, new Set());
        }
        userRooms.get(userId).add(roomId);

        if (!userRooms.has(authorId)) {
            userRooms.set(authorId, new Set());
        }
        userRooms.get(authorId).add(roomId);

        console.log("Rooms:", userRooms);
        // Notify the user they've joined
        socket.emit("joinedRoom", roomId);
    });

    // Fetch all rooms for a user
    socket.on("getRooms", (userId, callback) => {
        const rooms = Array.from(userRooms.get(userId) || []);
        callback(rooms);
    });

    // socket logic inside your connection callback
    socket.on('message', async ({ content, senderId, receiverId, roomId }) => {
        try {
            const message = new Message({
                content,
                sender: senderId,
                receiver: receiverId,
                timestamp: new Date(),
            });
            await message.save();

            // Update ChatList for the sender
            await updateChatList(senderId, receiverId, message);

            // Update ChatList for the receiver
            await updateChatList(receiverId, senderId, message);

            io.to(roomId).emit("newMessage", {
                content: message.content,
                senderId: message.sender,
                receiverId: message.receiver,
                timestamp: message.timestamp,
            });
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    // Helper function to update the chat list for both users
    async function updateChatList(userId1, userId2, message) {
        const participants = [userId1, userId2].sort();
        const chatList = await ChatList.findOne({ participants });

        if (chatList) {
            // Update existing chat list entry
            chatList.lastMessage = message._id;
            chatList.lastMessageTimestamp = message.timestamp;
            await chatList.save();
        } else {
            // Create new chat list entry
            await ChatList.create({
                participants,
                lastMessage: message._id,
                lastMessageTimestamp: message.timestamp,
            });
        }
    }


    // socket.on("message", async ({ content, senderId, receiverId, roomId }) => {
    //     try {
    //         const message = new Message({
    //             content,
    //             sender: senderId,
    //             receiver: receiverId,
    //             timestamp: new Date(),
    //         });
    //         await message.save();

    //         io.to(roomId).emit("newMessage", {
    //             content: message.content,
    //             senderId: message.sender,
    //             receiverId: message.receiver,
    //             timestamp: message.timestamp,
    //         });
    //     } catch (err) {
    //         console.error("Error saving message:", err);
    //     }
    // });


    // })
    // socket.broadcast.emit('welcome', `${ socket.id} join to the server1`)
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// Get chat list for a user
app.get('/api/getChatList', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Fetch chat list entries for the user
        const chatLists = await ChatList.find({ participants: userId })
            .populate('participants', 'name email')  // Populate the user details
            .populate('lastMessage', 'content timestamp')  // Populate last message details
            .sort({ 'lastMessageTimestamp': -1 }); // Sort by latest message

        res.json(chatLists);
    } catch (err) {
        console.error('Error fetching chat list:', err);
        res.status(500).json({ message: 'Failed to fetch chat list' });
    }
});


app.get("/messages", async (req, res) => {
    const { senderId, receiverId } = req.query;
    const messages = await Message.find({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
        ],
    }).sort({ timestamp: 1 });
    res.json(messages);
});

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));
socketConfig(io)



app.use(cors());
app.use(bodyParser.json());
app.use('/api', services);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


module.exports = app;
