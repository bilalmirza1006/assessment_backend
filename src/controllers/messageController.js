const Message = require('../model/Message');

exports.getMessagesByRoom = async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.roomId })
            .populate('sender', 'username')
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
