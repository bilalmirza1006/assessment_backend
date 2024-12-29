const ChatRoom = require('../model/ChatRoom');

exports.createChatRoom = async (req, res) => {
    const { name, participants } = req.body;

    try {
        const chatRoom = new ChatRoom({ name, participants });
        await chatRoom.save();
        res.status(201).json(chatRoom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
