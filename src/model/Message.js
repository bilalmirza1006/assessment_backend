// // const mongoose = require('mongoose');

// // const messageSchema = new mongoose.Schema({
// //     content: { type: String, required: true },
// //     sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// //     room: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
// //     status: {
// //         type: String,
// //         enum: ['pending', 'delivered', 'read'],
// //         default: 'pending',
// //     },
// //     createdAt: { type: Date, default: Date.now },
// // });

// // module.exports = mongoose.model('Message', messageSchema);


// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//     content: { type: String, required: true },
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     timestamp: { type: Date, default: Date.now },
//     status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
// });

// module.exports = mongoose.model('Message', messageSchema);
// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
});

module.exports = mongoose.model('Message', messageSchema);
