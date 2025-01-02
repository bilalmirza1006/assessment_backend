const Conversation = require('../model/Conversation');
const Post = require('../model/postModel');
const User = require('../model/userModel');
const mongoose = require("mongoose");


exports.createConversation = async (req, res) => {
    try {
        // app.post('/api/conversations', async (req, res) => {
        try {
            console.log("Request Body:", req.body); // Debugging
            const { senderId, receiverId } = req.body;

            if (!senderId || !receiverId) {
                return res.status(400).send("SenderId and ReceiverId are required.");
            }

            const newConversation = new Conversation({ members: [senderId, receiverId] });
            await newConversation.save();
            res.status(200).send("Conversation created successfully");
        } catch (err) {
            console.error(err, "Error in creating conversation");
            res.status(500).send("Server error");
        }
        // }
    } catch (error) {

    }
}

// exports.getConversationById = async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         console.log("User ID:", userId);
//         const conversations = await Conversation.find({members:{$in:[userId]}});
//         res.status(200).json(conversations);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

exports.getConversationById = async (req, res) => {
    try {
        console.log("Full Request Object:", req); // Log the full request object
        // console.log("Request Params:", req.params); // For route parameters
        // console.log("Request Query:", req.query); // For query parameters

        const userId = req.params.userId || req.query.userId;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        // console.log("Extracted User ID:", userId);

        const conversations = await Conversation.find({ members: { $in: [userId] } });
        const conversationUsersData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user= await User.findById(receiverId);
            return {user:{email: user.email, name: user.username},conversationId: conversation._id};
            // console.log("Receiver Data:", receiverData)
        }))
        console.log("Conversation Users Data:", await conversationUsersData);
        res.status(200).json(await conversationUsersData);
    } catch (error) {
        console.error("Error in getConversationById:", error);
        res.status(500).json({ message: error.message });
    }
};
