const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Login
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username and password were provided in the request
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        // Find the user by username
        const user = await User.findOne({ username });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials. User not found.' });
        }

        // Ensure the user has a password (check if it's defined)
        if (!user.password) {
            return res.status(500).json({ error: 'User does not have a valid password set.' });
        }

        // Compare the password provided in the request with the hashed password in the database
        const isMatch = bcrypt.compareSync(password, user.password);

        if (isMatch) {
            // If the password matches, generate a token
            const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            res.json({ token });
        } else {
            // If the password does not match
            res.status(401).json({ error: 'Invalid credentials. Password mismatch.' });
        }
    } catch (error) {
        console.error('Error checking user login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Create New User
exports.registerUser  = async (req, res) => {
    const { name, username, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const user = new User({ name, username, email, password, role });
        await user.save();
        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
