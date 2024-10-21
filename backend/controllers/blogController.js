// controllers/blogController.js

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
// Ensure that BlogPost model exists if needed
// const BlogPost = require('../models/BlogPost'); 

const wpBaseUrl = process.env.WP_BASE_URL;
const wpAuthToken = process.env.WP_AUTH_TOKEN;

// Check Token Validity
const checkToken = async (req, res) => {
    try {
        const response = await axios.post(
            `${wpBaseUrl}/jwt-auth/v1/token/validate`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${wpAuthToken}`,
                }
            }
        );
        res.json({ message: 'Token is valid', data: response.data });
    } catch (error) {
        console.error('Token validation error:', error.response ? error.response.data : error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Create a Blog Post
const createBlogPost = async (req, res) => {
    const { title, content, status = 'publish', featuredMediaId, tags } = req.body;
  
    try {
      const response = await axios.post(
        `${wpBaseUrl}/wp/v2/posts`,
        {
          title,
          content,
          status,
          featured_media: featuredMediaId,
          tags,
        },
        {
          headers: {
            Authorization: `Bearer ${wpAuthToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      res.status(201).json({ message: 'Blog post created successfully', data: response.data });
    } catch (error) {
      console.error('Error creating blog post:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to create blog post' });
    }
};

// Fetch Tags from WordPress
const getTags = async (req, res) => {
    try {
        const response = await axios.get(`${wpBaseUrl}/wp/v2/tags`, {
            headers: {
                Authorization: `Bearer ${wpAuthToken}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching tags:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
};

// Fetch Blog Posts from WordPress
const getBlogPosts = async (req, res) => {
    const { page = 1, per_page = 10, search = "" } = req.query;

    try {
        let token = wpAuthToken; // Start with current token

        // Make the API call with the current token
        let response = await axios.get(`${wpBaseUrl}/wp/v2/posts`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page,
                per_page,
                search,
            },
        });

        const posts = response.data;
        const totalPosts = parseInt(response.headers['x-wp-total'], 10);
        const totalPages = parseInt(response.headers['x-wp-totalpages'], 10);

        // Enrich posts with media and tags (as in your original code)...

        res.json({ posts: enrichedPosts, totalPosts, totalPages });
    } catch (error) {
        if (error.response && error.response.data.code === 'jwt_auth_invalid_token') {
            console.log('Token expired, refreshing...');

            try {
                // Refresh the token
                const newToken = await refreshToken();
                
                // Retry the request with the new token
                const response = await axios.get(`${wpBaseUrl}/wp/v2/posts`, {
                    headers: {
                        Authorization: `Bearer ${newToken}`,
                    },
                    params: {
                        page,
                        per_page,
                        search,
                    },
                });

                const posts = response.data;
                const totalPosts = parseInt(response.headers['x-wp-total'], 10);
                const totalPages = parseInt(response.headers['x-wp-totalpages'], 10);

                res.json({ posts: enrichedPosts, totalPosts, totalPages });
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError.message);
                return res.status(500).json({ error: 'Token expired and failed to refresh' });
            }
        } else {
            console.error('Error fetching blog posts:', error.response ? error.response.data : error.message);
            res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
    }
};

const refreshToken = async () => {
    try {
        const response = await axios.post(`${wpBaseUrl}/jwt-auth/v1/token`, {
            username: process.env.WP_USERNAME, // Ensure WP_USERNAME is set in your environment variables
            password: process.env.WP_PASSWORD, // Ensure WP_PASSWORD is set in your environment variables
        });
console.log('user name: ',response)
        // Save the new token in your environment or a secure place
        process.env.WP_AUTH_TOKEN = response.data.token;

        // Return the new token
        return response.data.token;
    } catch (error) {
        console.error('Error refreshing token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to refresh token');
    }
};

// Export all functions
module.exports = {
    checkToken,
    createBlogPost,
    getTags,
    getBlogPosts,
    // Add other functions as needed...
};
