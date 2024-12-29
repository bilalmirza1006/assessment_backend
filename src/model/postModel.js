// const { Schema } = require('mongoose');
// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     author: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//     // blogs :[{type: Schema.Type.ObjectId,ref: 'blogs'}]
// });

// module.exports = mongoose.model('Post', postSchema);


const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference the User model
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
