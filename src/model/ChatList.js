// models/ChatList.js
const mongoose = require('mongoose');

// const chatListSchema = new mongoose.Schema({
//     participants: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//     }],
//     lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
//     lastMessageTimestamp: { type: Date, default: Date.now },
// });


const chatListSchema = new mongoose.Schema({
    participants: {
        type: [String],
        required: true,
        unique: true, // Ensure no duplicates
    },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    lastMessageTimestamp: { type: Date },
});

// Ensure proper indexing for participants
chatListSchema.index({ participants: 1 });



module.exports = mongoose.model('ChatList', chatListSchema);
