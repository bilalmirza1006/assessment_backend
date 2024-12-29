const Message = require('../model/Message');
const User = require('../model/userModel');

module.exports = (io, socket) => {
    socket.on('joinRoom', async ({ roomId, userId }) => {
        socket.join(roomId);
        await User.findByIdAndUpdate(userId, { online: true });
        console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on('sendMessage', async ({ roomId, userId, content }) => {
        const message = new Message({ content, sender: userId, room: roomId });
        await message.save();

        io.to(roomId).emit('newMessage', {
            content: message.content,
            sender: userId,
            status: message.status,
            createdAt: message.createdAt,
        });
    });

    socket.on('messageDelivered', async ({ messageId }) => {
        const message = await Message.findByIdAndUpdate(
            messageId,
            { status: 'delivered' },
            { new: true }
        );

        if (message) {
            io.to(message.room).emit('messageStatusUpdate', {
                messageId: message._id,
                status: message.status,
            });
        }
    });

    socket.on('messageRead', async ({ messageId }) => {
        const message = await Message.findByIdAndUpdate(
            messageId,
            { status: 'read' },
            { new: true }
        );

        if (message) {
            io.to(message.room).emit('messageStatusUpdate', {
                messageId: message._id,
                status: message.status,
            });
        }
    });
};
