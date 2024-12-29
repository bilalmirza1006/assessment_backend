// // const mongoose = require('mongoose');

// // const userSchema = new mongoose.Schema({
// //     username: { type: String, required: true, unique: true },
// //     password: { type: String, required: true },
// //     role: { type: String, required: true, enum: ['admin', 'user'] },
// //     online: { type: Boolean, default: false },
// //     image: { type: String }

// // }, { timestamps: true });

// // module.exports = mongoose.model('User', userSchema);



// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, required: true, enum: ['admin', 'user'] },
//   online: { type: Boolean, default: false },
//   image: { type: String },
// }, { timestamps: true });

// // Virtual field to populate user's posts
// userSchema.virtual('posts', {
//   ref: 'Post', // Reference the Post model
//   localField: '_id', // Match User's _id with Post's author field
//   foreignField: 'author',
// });

// module.exports = mongoose.model('User', userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "user"] },
    online: { type: Boolean, default: false },
    image: { type: String },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Reference to the Post model
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
