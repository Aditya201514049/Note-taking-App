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
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
      <div className="navbar">
        <h1 style={{ color: "#1a1a2e" }}>Posts</h1>
        <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className={showForm ? "btn-secondary" : "btn-success"}
      >
        {showForm ? "Cancel" : "Create Post"}
      </button>

      {showForm && (
        <div className="card" style={{ marginTop: "20px" }}>
          <h3 style={{ marginBottom: "20px", color: "#1a1a2e" }}>Create Post</h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="Enter post title"
              />
            </div>
            <div className="form-group">
              <label>Content:</label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                rows="5"
                placeholder="Enter post content"
              />
            </div>
            <button type="submit" className="btn-primary">
              Create
            </button>
          </form>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h3 style={{ marginBottom: "20px", color: "#1a1a2e" }}>All Posts</h3>
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet. Create your first post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <small>
                By: {post.userId?.username || post.userId} ({post.userId?.email || ""}) | Created:{" "}
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
