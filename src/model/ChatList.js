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


// const mongoose = require("mongoose");

const chatListSchema = new mongoose.Schema({
    chatKey: {
        type: String,
        required: true,
        unique: true, // Ensure only one entry per sender-receiver pair
    },
    participants: {
        type: [String],
        required: true,
    },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    lastMessageTimestamp: { type: Date },
});

// Create an index for faster lookups
chatListSchema.index({ chatKey: 1 });

module.exports = mongoose.model("ChatList", chatListSchema);

