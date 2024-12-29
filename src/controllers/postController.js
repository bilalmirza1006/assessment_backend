const Post = require('../model/postModel');
const User = require('../model/userModel');
const mongoose = require("mongoose");

exports.getPosts = async (req, res) => {
    console.log('fofoffo')
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found.' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// exports.createPost = async (req, res) => {
//     try {
//         const { title, content, author } = req.body;
//         const newPost = new Post({ title, content, author });
//         await newPost.save();
//         res.status(201).json({ message: 'Post created successfully!', post: newPost });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// const Post = require('../models/postModel');

// exports.createPost = async (req, res) => {
//   try {
//     // Ensure only admin can create posts
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: "Forbidden: Only admins can create posts" });
//     }

//     const { title, content, author } = req.body;

//     // Check if the author exists in the database
//     const authorExists = await User.findOne({ username: author });
//     if (!authorExists) {
//       return res.status(404).json({ message: "User not found: Cannot create a post for a non-existent user" });
//     }

//     // Create the new post
//     const newPost = new Post({ title, content, author });
//     await newPost.save();

//     res.status(201).json({ message: 'Post created successfully!', post: newPost });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// exports.createPost = async (req, res) => {
//     try {
//         const { title, content, author } = req.body;

//         // Check if the requesting user is an admin
//         if (req.user.role !== "admin") {
//             return res.status(403).json({
//                 message: "Forbidden: Only admins can create posts for other users",
//             });
//         }

//         // Validate that the author is a valid ObjectId
//         if (!mongoose.isValidObjectId(author)) {
//             return res.status(400).json({ message: "Invalid author ID" });
//         }

//         // Check if the target author exists
//         const targetUser = await User.findById(author);
//         if (!targetUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Create the post
//         const newPost = new Post({ title, content, author });
//         await newPost.save();

//         res.status(201).json({
//             message: "Post created successfully!",
//             post: newPost,
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };




exports.createPost = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        // Validate `author` as a valid MongoDB ObjectId
        if (!mongoose.isValidObjectId(author)) {
            return res.status(400).json({ message: "Invalid author ID" });
        }

        const targetUser = await User.findById(author);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create the post
        const newPost = new Post({ title, content, author });
        await newPost.save();

        // Add the post ID to the user's posts array
        targetUser.posts.push(newPost._id);
        await targetUser.save();

        res.status(201).json({ message: "Post created successfully!", post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: error.message });
    }
};



exports.updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPost) return res.status(404).json({ message: 'Post not found.' });
        res.status(200).json({ message: 'Post updated successfully!', post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: 'Post not found.' });
        res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
