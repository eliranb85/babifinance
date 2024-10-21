const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Login
// User Login
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    console.log('Username received:', username);
    console.log('Password received from user:', password);

    try {
        const user = await User.findOne({ username });
        console.log('User found in DB:', user);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials. User not found.' });
        }

        // Since bcrypt was removed, do a plain-text password comparison
        if (password === user.password) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials. Password mismatch.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};







// Create New User
// Register User Function
exports.registerUser = async (req, res) => {
    console.log('Entering registerUser function');

    // Destructure all required fields, including password
    const { name, username, email, password, role } = req.body;
    console.log('Received data:', { name, username, email, role, password });

    // Basic input validation
    if (!name || !username || !email || !password || !role) {
        console.log('Validation failed: Missing fields');
        return res.status(400).json({ error: 'All fields (name, username, email, password, role) are required.' });
    }

    try {
        // Check if the user already exists by username or email
        const userExists = await User.findOne({ 
            $or: [{ username }, { email }]
        });

        if (userExists) {
            console.log('User exists:', userExists);
            return res.status(400).json({ error: 'Username or email already in use.' });
        }

        // Create a new user with plain-text password (Not Recommended)
        const newUser = new User({
            name,
            username,
            email,
            password, // Storing plain-text password (Security Risk)
            role
        });

        // Save the user to the database
        await newUser.save();
        console.log('User created successfully:', newUser);

        // Respond with a success message
        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error('Error creating user:', error);
        
        // Avoid sending the actual error message in production
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};
