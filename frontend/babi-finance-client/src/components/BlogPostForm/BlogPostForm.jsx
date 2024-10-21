import { useState, useEffect } from "react";

const BlogPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("publish");
  const [image, setImage] = useState(null);
  const [mediaId, setMediaId] = useState(null);
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Fetch available tags when the component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tags");
        if (!response.ok) {
          throw new Error(`Error fetching tags: ${response.statusText}`);
        }
        const data = await response.json();
        setAvailableTags(data);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        alert("Failed to load tags.");
      }
    };
    fetchTags();
  }, []);

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Image upload failed");
      }

      const data = await response.json();
      setMediaId(data.mediaId); // Save the uploaded image media ID
    } catch (error) {
      console.error("Image upload error:", error);
      alert(`Image upload failed: ${error.message}`);
    }
  };

  const handleTagChange = (e) => {
    const tagId = e.target.value;
    if (e.target.checked) {
      setTags((prevTags) => [...prevTags, tagId]);
    } else {
      setTags((prevTags) => prevTags.filter((id) => id !== tagId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image first if selected
    if (image) {
      await handleImageUpload();
      if (!mediaId) {
        alert("Image upload failed. Cannot proceed.");
        return;
      }
    }

    const postData = {
      title,
      content,
      status,
      featuredMediaId: mediaId, // Add uploaded media ID
      tags, // Array of selected tag IDs
    };

    try {
      const response = await fetch("http://localhost:5000/api/blogposts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create blog post");
      }

      const responseData = await response.json();
      alert("Blog post created successfully");
      // Reset form fields
      setTitle("");
      setContent("");
      setStatus("publish");
      setImage(null);
      setMediaId(null);
      setTags([]);
    } catch (error) {
      console.error("Blog post creation error:", error);
      alert(`Failed to create blog post: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label><br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>
      <div>
        <label>Content</label><br />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="10"
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>
      <div>
        <label>Upload Image</label><br />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          style={{ marginBottom: "10px" }}
        />
      </div>
      <div>
        <label>Status</label><br />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="publish">Publish</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <div>
        <label>Tags</label><br />
        {availableTags.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {availableTags.map((tag) => (
              <label key={tag.id} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={tags.includes(String(tag.id))}
                  onChange={handleTagChange}
                />
                {` ${tag.name}`}
              </label>
            ))}
          </div>
        ) : (
          <p>No tags available.</p>
        )}
      </div>
      <button type="submit" style={{ padding: "10px 20px", marginTop: "20px" }}>
        Submit Post
      </button>
    </form>
  );
};

export default BlogPostForm;
