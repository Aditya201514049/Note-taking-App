import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState(null);
  const [page, setPage] = useState(1);

  const fetchNotes = async () => {
    try {
      const response = await api.get(`/notes/my-notes?page=${page}&limit=10`);
      setNotes(response.data.notes);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/notes", formData);
      setFormData({ title: "", content: "" });
      setShowForm(false);
      fetchNotes();
    } catch (err) {
      alert("Failed to create note");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/notes/${editingNote._id}`, formData);
      setFormData({ title: "", content: "" });
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      alert("Failed to update note");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/notes/${id}`);
        fetchNotes();
      } catch (err) {
        alert("Failed to delete note");
      }
    }
  };

  const startEdit = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
      <div className="navbar">
        <h1 style={{ color: "#1a1a2e" }}>My Notes</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}</span>
          <span className={`user-badge ${user?.role}`}>{user?.role}</span>
          {user?.role === "admin" && (
            <button className="btn-primary btn-small" onClick={() => navigate("/admin")}>
              Admin Panel
            </button>
          )}
          <button className="btn-secondary btn-small" onClick={() => navigate("/posts")}>
            Posts
          </button>
          <button className="btn-danger btn-small" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className={showForm ? "btn-secondary" : "btn-success"}
      >
        {showForm ? "Cancel" : "Create Note"}
      </button>

      {(showForm || editingNote) && (
        <div className="card" style={{ marginTop: "20px" }}>
          <h3 style={{ marginBottom: "20px", color: "#1a1a2e" }}>
            {editingNote ? "Edit Note" : "Create Note"}
          </h3>
          <form onSubmit={editingNote ? handleUpdate : handleCreate}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="Enter note title"
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
                placeholder="Enter note content"
              />
            </div>
            <button type="submit" className="btn-primary">
              {editingNote ? "Update" : "Create"}
            </button>
            {editingNote && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditingNote(null);
                  setFormData({ title: "", content: "" });
                }}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h3 style={{ marginBottom: "20px", color: "#1a1a2e" }}>My Notes</h3>
        {notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="note-card">
              <h4>{note.title}</h4>
              <p>{note.content}</p>
              <small>{new Date(note.createdAt).toLocaleString()}</small>
              <div style={{ marginTop: "12px" }}>
                <button
                  className="btn-primary btn-small"
                  onClick={() => startEdit(note)}
                >
                  Edit
                </button>
                <button
                  className="btn-danger btn-small"
                  onClick={() => handleDelete(note._id)}
                  style={{ marginLeft: "8px" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
