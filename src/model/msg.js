const mongoose = require('mongoose');

const msg = new mongoose.Schema({
    conversationId: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Conversation',
        type: String,
    },
    senderId: {
        type: String,
    },
    msg: {
        type: String,
    }
});

module.exports = mongoose.model('msg', msg);