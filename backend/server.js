// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import Routes
const jewelryRoutes = require('./routes/jewelryRoutes');
const userRoutes = require('./routes/userRoutes');
const goldPriceRoutes = require('./routes/goldPriceRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // Fixed variable name
const tagRoutes = require('./routes/tagRoutes');

// Environment Variables
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000'; // Default to localhost for development
const mongoDBURI = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: frontendURL, // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.set('strictQuery', false); // Optional: Suppress deprecation warnings

// Establish a connection to MongoDB
// MongoDB Connection
mongoose.connect(mongoDBURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });


// Mount Routes
app.use(jewelryRoutes);
app.use(userRoutes);
app.use(goldPriceRoutes);
app.use(transactionRoutes);
app.use(blogRoutes);
app.use(categoryRoutes); // Fixed the typo
app.use(tagRoutes); // Use tag routes

// Optional: Health check route
app.get('/api/status', (req, res) => {
    res.json({ status: 'Server is running!' });
});

// Global error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred!' });
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
