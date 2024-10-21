const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Import the Admin model
require('dotenv').config(); // Ensure environment variables are loaded

const app = express();
app.use(express.json());

const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_key'; // Use environment variable

// Admin login route
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    let admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).send('Invalid username or password.');

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).send('Invalid username or password.');

    // Generate JWT token
    const token = jwt.sign({ _id: admin._id, username: admin.username, role: admin.role }, jwtSecret, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).send('Error logging in: ' + error.message);
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
