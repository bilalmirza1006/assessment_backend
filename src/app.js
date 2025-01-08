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
const Conversation = require('./model/Conversation');
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
let users = [];  // Ensure this is defined outside the event listener so it's accessible globally

// io.on('connection', (socket) => {
//     console.log(`Socket connected: ${socket.id}`);


//     socket.on("adduser", (usersId) => {
//         console.log("adduser", usersId);

//         // Check if the user is already in the list
//         const isUserExist = users.find(user => user.usersId === usersId);
//         console.log("isUserExist", isUserExist);

//         if (!isUserExist) {
//             // If the user doesn't exist, add the user to the list
//             const user = { usersId, socketId: socket.id };
//             users.push(user);
//             console.log("users", users);

//             // Emit the updated list of users to all clients
//             io.emit("getUsers", users);
//         } else {
//             // If the user already exists, log that information
//             console.log("User already exists");
//         }

//         socket.on("message", ({ content, senderId, receiverId }) => {
//             // Emit the message to the recipient
//             const recipientSocket = users.find(user => user.usersId === receiverId)?.socketId;
//             console.log("recipientSocket", recipientSocket);
//             if (recipientSocket) {
//                 io.to(recipientSocket).emit("reciveMessage", { content, senderId, receiverId });
//             }
//         })

//         socket.on('message', async ({ content, senderId, receiverId }) => {
//             try {
//                 console.log("Received message event", { content, senderId, receiverId });

//                 // Create and save the message to the database
//                 const message = new Message({
//                     content,
//                     sender: senderId,
//                     receiver: receiverId,
//                     timestamp: new Date(),
//                 });

//                 console.log("Saving message to database:", message);
//                 await message.save();
//                 console.log(`Message saved: ${message}`);


//                 const recipientSocket = users.find(user => user.usersId === receiverId)?.socketId;
//                 console.log("recipientSocket", recipientSocket);
//                 if (recipientSocket) {
//                     io.to(recipientSocket).emit("reciveMessage", { content, senderId, receiverId });
//                 }
//                 // Emit the message to both the sender and receiver
//                 await updateChatList(senderId, receiverId, message);

//                 //         // Update ChatList for the receiver
//                 await updateChatList(receiverId, senderId, message);
//                 console.log(`Emitting message to sender: ${senderId}`);
//                 io.to(recipientSocket).emit('reciveMessage', {
//                     content: message.content,
//                     senderId: message.sender,
//                     receiverId: message.receiver,
//                     timestamp: message.timestamp,
//                     status: message.status, // e.g., delivered, read
//                 });

//                 console.log(`Emitting message to receiver: ${receiverId}`);
//                 io.to(recipientSocket).emit('reciveMessage', {
//                     content: message.content,
//                     senderId: message.sender,
//                     receiverId: message.receiver,
//                     timestamp: message.timestamp,
//                     status: message.status,
//                 });
//             } catch (err) {
//                 console.error(`Error handling message: ${err.message}`);
//                 socket.emit('error', { message: 'Failed to send message.' });
//             }
//         });

//         socket.on("disconnect", () => {
//             users = users.filter(user => user.socketId !== socket.id)
//             io.emit("getUsers", users);
//         })
//     });

//     console.log("allllllll users", users);


//     socket.on("joinRoom", ({ roomId }) => {
//         socket.join(roomId);
//         console.log(`User joined room: ${roomId}`);
//     });



//     socket.on("joinRoom", ({ userId, authorId }) => {
//         console.log(`is joining room with ${userId}  ${authorId}`);
//         const sortedIds = [userId, authorId].sort(); // Ensure consistent room ID
//         const roomId = `${sortedIds[0]}-${sortedIds[1]}`;
//         socket.join(roomId);

//         console.log(`${userId} joined room ${roomId}`);

//         // Track user rooms
//         if (!userRooms.has(userId)) {
//             userRooms.set(userId, new Set());
//         }
//         userRooms.get(userId).add(roomId);

//         if (!userRooms.has(authorId)) {
//             userRooms.set(authorId, new Set());
//         }
//         userRooms.get(authorId).add(roomId);

//         // console.log("Rooms:", userRooms);
//         // Notify the user they've joined
//         socket.emit("joinedRoom", roomId);
//     });

//     // Fetch all rooms for a user
//     socket.on("getRooms", (userId, callback) => {
//         const rooms = Array.from(userRooms.get(userId) || []);
//         callback(rooms);
//     });



//     // Helper function to update the chat list for both users
//     async function updateChatList(userId1, userId2, message) {
//         const participants = [userId1, userId2].sort();
//         const chatList = await ChatList.findOne({ participants });

//         if (chatList) {
//             // Update existing chat list entry
//             chatList.lastMessage = message._id;
//             chatList.lastMessageTimestamp = message.timestamp;
//             await chatList.save();
//         } else {
//             // Create new chat list entry
//             await ChatList.create({
//                 participants,
//                 lastMessage: message._id,
//                 lastMessageTimestamp: message.timestamp,
//             });
//         }
//     }

//     socket.on('disconnect', () => {
//         console.log(`Socket disconnected: ${socket.id}`);
//     });
// });

// // Get chat list for a user
// app.get('/api/getChatList', async (req, res) => {
//     const { userId } = req.query;

//     if (!userId) {
//         return res.status(400).json({ message: 'User ID is required' });
//     }

//     try {
//         // Fetch chat list entries for the user
//         const chatLists = await ChatList.find({ participants: userId })
//             .populate('participants', 'name email')  // Populate the user details
//             .populate('lastMessage', 'content timestamp')  // Populate last message details
//             .sort({ 'lastMessageTimestamp': -1 }); // Sort by latest message

//         res.json(chatLists);
//     } catch (err) {
//         console.error('Error fetching chat list:', err);
//         res.status(500).json({ message: 'Failed to fetch chat list' });
//     }
// });
// app.use(express.urlencoded({ extended: true }));


// app.get("/messages", async (req, res) => {
//     const { senderId, receiverId } = req.query;
//     const messages = await Message.find({
//         $or: [
//             { sender: senderId, receiver: receiverId },
//             { sender: receiverId, receiver: senderId },
//         ],
//     }).sort({ timestamp: 1 });
//     res.json(messages);
// });



io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Add user to online list
    socket.on("adduser", (usersId) => {
        if (!users.some(user => user.usersId === usersId)) {
            users.push({ usersId, socketId: socket.id });
            io.emit("getUsers", users);
        }
    });

    // Handle messages and update chat list
    socket.on("message", async ({ content, senderId, receiverId }) => {
        console.log(" receiver message ", { content, senderId, receiverId });
        try {
            console.log("Received message event", { content, senderId, receiverId });

            // Save message to the database
            const message = new Message({
                content,
                sender: senderId,
                receiver: receiverId,
                timestamp: new Date(),
            });
            await message.save();

            // Update chat list
            await updateChatList(senderId, receiverId, message);


            const recipientSocket = users.find(user => user.usersId === receiverId)?.socketId;
            console.log("recipientSocket", recipientSocket);
            if (recipientSocket) {
                io.to(recipientSocket).emit("reciveMessage", { content, senderId, receiverId });
            }

            // Emit message to recipient
            // const recipientSocket = users.find(user => user.usersId === receiverId)?.socketId;

            if (recipientSocket) {
                io.to(recipientSocket).emit("reciveMessage", {
                    content: message.content,
                    senderId: message.sender,
                    receiverId: message.receiver,
                    timestamp: message.timestamp,
                });
            }

            console.log(`Message sent to ${receiverId} and saved.`);
        } catch (err) {
            console.error(`Error handling message: ${err.message}`);
            socket.emit("error", { message: "Failed to send message." });
        }
    });

    // Join a chat room
    socket.on("joinRoom", ({ userId, authorId }) => {
        const sortedIds = [userId, authorId].sort();
        const roomId = `${sortedIds[0]}-${sortedIds[1]}`;
        socket.join(roomId);

        userRooms.set(userId, (userRooms.get(userId) || new Set()).add(roomId));
        userRooms.set(authorId, (userRooms.get(authorId) || new Set()).add(roomId));

        socket.emit("joinedRoom", roomId);
    });

    // Fetch user rooms
    socket.on("getRooms", (userId, callback) => {
        callback(Array.from(userRooms.get(userId) || []));
    });

    // Remove user from online list on disconnect
    socket.on("disconnect", () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit("getUsers", users);
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// Function to update or create chat list entry
// async function updateChatList(senderId, receiverId, message) {
//     // Create a unique key by sorting user IDs
//     const chatKey = [senderId, receiverId].sort().join('-');
//     console.log("chatKey", chatKey);
//     let chatList = await ChatList.findOne({ chatKey });
//     console.log("chatList", chatList);
//     if (chatList) {
//         // Update existing chat list entry
//         chatList.lastMessage = message._id;
//         chatList.lastMessageTimestamp = message.timestamp;
//     } else {
//         // Create new chat list entry
//         chatList = new ChatList({
//             chatKey,
//             participants: [senderId, receiverId].sort(),
//             lastMessage: message._id,
//             lastMessageTimestamp: message.timestamp,
//         });
//     }

//     await chatList.save();
// }
async function updateChatList(senderId, receiverId, message) {
    try {
        // Create a unique key by sorting user IDs
        const chatKey = [senderId, receiverId].sort().join("-");
        console.log("chatKey:", chatKey);

        let chatList = await ChatList.findOne({ chatKey });

        if (chatList) {
            // Update existing chat list entry
            chatList.lastMessage = message._id;
            chatList.lastMessageTimestamp = message.timestamp;
            console.log("ChatList updated:", chatList);
        } else {
            // Create a new chat list entry
            chatList = new ChatList({
                chatKey,
                participants: [senderId, receiverId].sort(),
                lastMessage: message._id,
                lastMessageTimestamp: message.timestamp,
            });
            console.log("New ChatList created:", chatList);
        }

        await chatList.save();
    } catch (error) {
        console.error("Error updating ChatList:", error);
    }
}


// Get chat list for a user
app.get("/api/getChatList", async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    try {
        const chatLists = await ChatList.find({ participants: userId })
            .populate("participants", "name email")
            .populate("lastMessage", "content timestamp")
            .sort({ lastMessageTimestamp: -1 });

        res.json(chatLists);
    } catch (err) {
        console.error("Error fetching chat list:", err);
        res.status(500).json({ message: "Failed to fetch chat list" });
    }
});

// Fetch messages between two users
app.get("/messages", async (req, res) => {
    const { senderId, receiverId } = req.query;

    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
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
