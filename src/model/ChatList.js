// models/ChatList.js
const mongoose = require('mongoose');

const chatListSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    lastMessageTimestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatList', chatListSchema);
