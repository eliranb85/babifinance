const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Import userController

// Routes for Users
router.post('/api/users/login', userController.loginUser); // Ensure loginUser exists and is imported properly
router.post('/api/users/register', userController.registerUser); // Ensure registerUser exists and is imported properly

module.exports = router;
