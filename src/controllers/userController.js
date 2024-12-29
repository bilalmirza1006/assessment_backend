const Post = require('../model/postModel');
const User = require('../model/userModel');

// exports.getUsers = async (req, res) => {
//     try {
//         const users = await User.find();
//         const baseUrl = `${req.protocol}://${req.get('host')}`;
//         const usersWithImageUrl = users.map(user => ({
//             id: user._id,
//             username: user.username,
//             role: user.role,
//             image: user.image ? `${baseUrl}/${user.image}` : null
//         }));
//         // res.status(200).json({
//         //     image: user.image ? `${baseUrl}/${user.image}` : null,
//         //     users
//         // });
//         res.status(200).json({
//             message: 'Users fetched successfully!',
//             users: usersWithImageUrl
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

exports.getUsers = async (req, res) => {
    try {
      const users = await User.find().populate("posts"); // Populates the posts array with Post details
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users with posts:", error);
      res.status(500).json({ message: error.message });
    }
  };