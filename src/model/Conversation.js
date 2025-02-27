const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members:{
        type: [String],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('conversation', conversationSchema);
