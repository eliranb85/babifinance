// src/components/EditBlogPost.jsx

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditBlogPost = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [tags, setTags] = useState([]); // Selected tag IDs
  const [allTags, setAllTags] = useState([]); // All available tags

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch the existing post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogposts/${id}`, {
          headers: {
            Authorization: `Bearer YOUR_JWT_TOKEN_HERE`, // Replace with your JWT token
          },
        });

        const post = response.data;

        setTitle(post.title.rendered || post.title);
        setContent(post.content.rendered || post.content);
        setStatus(post.status);
        setTags(post.tags || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Fetch all available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tags", {
          headers: {
            Authorization: `Bearer YOUR_JWT_TOKEN_HERE`, // Replace with your JWT token
          },
        });
        setAllTags(response.data.tags);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };

    fetchTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send
    const updatedPost = {
      title,
      content,
      status,
      tags,
    };

    try {
      await axios.put(`http://localhost:5000/api/blogposts/${id}`, updatedPost, {
        headers: {
          Authorization: `Bearer YOUR_JWT_TOKEN_HERE`, // Replace with your JWT token
        },
      });

      alert("Blog post updated successfully.");
      navigate("/posts"); // Redirect to the posts list
    } catch (err) {
      console.error("Error updating blog post:", err);
      alert("Failed to update blog post.");
    }
  };

  const handleTagChange = (tagId) => {
    if (tags.includes(tagId)) {
      setTags(tags.filter((id) => id !== tagId));
    } else {
      setTags([...tags, tagId]);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
        <Typography variant="h6">Loading blog post...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" style={{ marginTop: "50px" }}>
        Failed to load blog post. Please try again later.
      </Typography>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Edit Blog Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          required
          multiline
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
        <TextField
          label="Status"
          variant="outlined"
          fullWidth
          required
          select
          SelectProps={{
            native: true,
          }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ marginBottom: "20px" }}
        >
          <option value="publish">Publish</option>
          <option value="draft">Draft</option>
        </TextField>
        <Typography variant="h6" gutterBottom>
          Tags
        </Typography>
        <FormGroup row>
          {allTags.map((tag) => (
            <FormControlLabel
              key={tag.id}
              control={
                <Checkbox
                  checked={tags.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                  name={tag.name}
                />
              }
              label={tag.name}
            />
          ))}
        </FormGroup>
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: "20px" }}>
          Update Post
        </Button>
      </form>
    </div>
  );
};

export default EditBlogPost;
