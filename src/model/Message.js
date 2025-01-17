const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
});

module.exports = mongoose.model('Message', messageSchema);
