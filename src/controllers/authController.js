const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully!',
            token,
            role: newUser.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful!',
            token,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};