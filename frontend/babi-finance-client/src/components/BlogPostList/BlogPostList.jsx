// src/components/BlogPostList.jsx

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Pagination,
  TextField,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const BlogPostList = () => {
  const [posts, setPosts] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch all blog posts from the backend with pagination and search
  useEffect(() => {
    
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/blogposts", {
          params: { page, per_page: 10, search: searchQuery },
        });
        console.log("Fetched blog posts:", response.data); // Debugging
        // If the backend returns an array directly
        if (Array.isArray(response.data)) {
          setPosts(response.data);
          // Calculate totalPages if possible
          setTotalPages(Math.ceil(response.data.length / 10));
        } else {
          console.error("Unexpected response structure:", response.data);
          setPosts([]); // Prevents .map() error
          setTotalPages(1);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError(true);
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, [page, searchQuery]);

  // Handle deletion of a blog post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/blogposts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      alert("Blog post deleted successfully.");
    } catch (err) {
      console.error("Error deleting blog post:", err);
      alert("Failed to delete blog post.");
    }
  };

  // Optional: Handle editing of a blog post
  const handleEdit = (id) => {
    navigate(`/edit-post/${id}`);
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
        <Typography variant="h6">Loading blog posts...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" style={{ marginTop: "50px" }}>
        Failed to load blog posts. Please try again later.
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        All Blog Posts
      </Typography>

      <Grid container spacing={2} style={{ marginBottom: "20px" }}>
        <Grid item xs={12} sm={10}>
          <TextField
            label="Search by Title or Content"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table aria-label="blog posts table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Featured Image</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Tags</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    {post.featured_media_url ? (
                      <img
                        src={post.featured_media_url}
                        alt={post.title.rendered || post.title}
                        style={{ width: "100px", height: "auto" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>
                  <TableCell>{post.title.rendered || post.title}</TableCell>
                  <TableCell style={{ textTransform: "capitalize" }}>{post.status}</TableCell>
                  <TableCell>
  {post.tagNames && post.tagNames.length > 0
    ? post.tagNames.join(", ")
    : "No Tags"}
</TableCell>

                  <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(post.id)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No blog posts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
      </div>
    </div>
  );
};

export default BlogPostList;
