const express = require('express');
const authRoutes = require('../routes/authRoutes');
const postRoutes = require('../routes/postRoutes');
const chatRoomRoute = require('../routes/chatRoomRoutes');
const messageRoutes = require('../routes/messageRoutes');
const userRoutes = require('../routes/userRoutes');

const conversationRoute = require('../routes/conversationRoutes');

const services = express.Router()

services.use('/auth', authRoutes);
services.use('/posts', postRoutes);
services.use('/users', userRoutes);
services.use('/chatrooms', chatRoomRoute);
services.use('/messages', messageRoutes);
services.use('/new', conversationRoute);

module.exports = services;


