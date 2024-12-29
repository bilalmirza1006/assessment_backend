// const User = require('../model/userModel');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// exports.register = async (req, res) => {
//     try {
//         const { username, password, role } = req.body;

//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists.' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({ username, password: hashedPassword, role, image: req.file ? req.file.path : null });
//         await newUser.save();

//         const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.status(201).json({
//             message: 'User registered successfully!',
//             token,
//             role: newUser.role,
//             userId: newUser._id,
//             image: newUser.image
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// exports.login = async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const baseUrl = `${req.protocol}://${req.get('host')}`;
//         const user = await User.findOne({ username });
//         if (!user) return res.status(404).json({ message: 'User not found.' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.status(200).json({
//             message: 'Login successful!',
//             token,
//             role: user.role,
//             image: user.image ? `${baseUrl}/${user.image}` : null,
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 role: user.role
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validate input fields
        if (!username || !password || !role) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;
        const newUser = new User({ username, password: hashedPassword, role, image: imagePath });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully!',
            token,
            role: newUser.role,
            userId: newUser._id,
            image: newUser.image
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input fields
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.status(200).json({
            message: 'Login successful!',
            token,
            role: user.role,
            image: user.image ? `${baseUrl}/${user.image}` : null,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
