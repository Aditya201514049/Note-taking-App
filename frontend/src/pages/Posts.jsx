import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Posts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [page, setPage] = useState(1);

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/posts?page=${page}&limit=10`);
      setPosts(response.data.posts);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/posts", formData);
      setFormData({ title: "", content: "" });
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      alert("Failed to create post");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Posts</h2>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "8px" }}>
          Back to Dashboard
        </button>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        {showForm ? "Cancel" : "Create Post"}
      </button>

      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "5px",
          }}
        >
          <h3>Create Post</h3>
          <div style={{ marginBottom: "15px" }}>
            <label>Title:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Content:</label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              rows="4"
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create
          </button>
        </form>
      )}

      <div>
        <h3>All Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <small>
                User ID: {post.userId} | Created:{" "}
                {new Date(post.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
