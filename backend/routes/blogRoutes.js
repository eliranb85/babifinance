const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController'); // Ensure correct path
const authenticate = require('../middleware/authMiddleware'); // Authentication middleware

// Route to check token validity
router.get('/api/check-token', blogController.checkToken);

// Route to create a blog post (Protected Route)
router.post('/api/blogposts', authenticate, blogController.createBlogPost);

// Route to fetch tags from WordPress
router.get('/api/tags', blogController.getTags);

// Route to fetch blog posts with enrichment
router.get('/api/blogposts', blogController.getBlogPosts);

module.exports = router;
