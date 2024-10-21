const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const authenticate = require('../middleware/authMiddleware'); // Authentication middleware

// Routes for Tags

// Create a new tag (Protected Route)
router.post('/api/tags', authenticate, tagController.createTag);

// Get all tags
router.get('/api/tags', tagController.getAllTags);

// Get a single tag by ID
router.get('/api/tags/:id', tagController.getTagById);

// Update a tag by ID (Protected Route)
router.put('/api/tags/:id', authenticate, tagController.updateTag);

// Delete a tag by ID (Protected Route)
router.delete('/api/tags/:id', authenticate, tagController.deleteTag);

module.exports = router;
