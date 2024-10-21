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
        const response = await axios.get(`${wpBaseUrl}/wp/v2/posts`, {
            headers: {
                Authorization: `Bearer ${wpAuthToken}`,
            },
            params: {
                page,
                per_page,
                search,
            },
        });

        const posts = response.data;

        // Extract total count and total pages from headers
        const totalPosts = parseInt(response.headers['x-wp-total'], 10);
        const totalPages = parseInt(response.headers['x-wp-totalpages'], 10);

        // Enrich each post with featured_media_url and tagNames
        const enrichedPosts = await Promise.all(
            posts.map(async (post) => {
                // Fetch featured media URL
                let featured_media_url = "";
                if (post.featured_media) {
                    try {
                        const mediaResponse = await axios.get(`${wpBaseUrl}/wp/v2/media/${post.featured_media}`, {
                            headers: {
                                Authorization: `Bearer ${wpAuthToken}`,
                            },
                        });
                        featured_media_url = mediaResponse.data.source_url;
                    } catch (err) {
                        console.error(`Error fetching media for post ${post.id}:`, err);
                    }
                }

                // Fetch tag names
                let tagNames = [];
                if (post.tags && post.tags.length > 0) {
                    try {
                        const tagsResponse = await axios.get(`${wpBaseUrl}/wp/v2/tags`, {
                            headers: {
                                Authorization: `Bearer ${wpAuthToken}`,
                            },
                            params: {
                                include: post.tags.join(","),
                                per_page: post.tags.length,
                            },
                        });
                        tagNames = tagsResponse.data.map((tag) => tag.name);
                    } catch (err) {
                        console.error(`Error fetching tags for post ${post.id}:`, err);
                    }
                }

                return {
                    id: post.id,
                    title: post.title,
                    status: post.status,
                    date: post.date,
                    featured_media_url,
                    tagNames,
                    tags: post.tags, // Include tag IDs for editing purposes
                };
            })
        );

        res.json({ posts: enrichedPosts, totalPosts, totalPages });
    } catch (error) {
        console.error('Error fetching blog posts:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch blog posts' });
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
