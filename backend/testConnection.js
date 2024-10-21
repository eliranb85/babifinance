// testConnection.js

const mongoose = require('mongoose');
require('dotenv').config();

const mongoDBURI = process.env.MONGODB_URI;

mongoose.connect(mongoDBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Successfully connected to MongoDB');
    mongoose.connection.close(); // Close the connection after success
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
