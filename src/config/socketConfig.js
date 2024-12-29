// const socketHandler = require('../sockets/chatHandlers');

// module.exports = (io) => {
//     io.on('connection', (socket) => {
//         console.log('A user connected:', socket.id);
//         socketHandler(io, socket);

//         socket.on('disconnect', () => {
//             console.log('A user disconnected:', socket.id);
//         });
//     });
// };

module.exports = (io) => {
    // Track connected users
    const connectedUsers = new Map();

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Listen for a custom "userConnected" event to log user details
        socket.on('userConnected', (userId) => {
            connectedUsers.set(socket.id, userId);
            console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);
        });

        // Check if the socket is connected
        socket.on('checkConnection', () => {
            console.log(`Socket ${socket.id} is active and connected.`);
            socket.emit('connectionStatus', { connected: true });
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            connectedUsers.delete(socket.id);
        });
    });
};
