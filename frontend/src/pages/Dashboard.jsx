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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Dashboard</h2>
        <div>
          <span style={{ marginRight: "15px" }}>
            Welcome, {user?.username} ({user?.role})
          </span>
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              style={{ marginRight: "10px", padding: "8px" }}
            >
              Admin Panel
            </button>
          )}
          <button
            onClick={() => navigate("/posts")}
            style={{ marginRight: "10px", padding: "8px" }}
          >
            Posts
          </button>
          <button onClick={handleLogout} style={{ padding: "8px" }}>
            Logout
          </button>
        </div>
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
        {showForm ? "Cancel" : "Create Note"}
      </button>

      {(showForm || editingNote) && (
        <form
          onSubmit={editingNote ? handleUpdate : handleCreate}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "5px",
          }}
        >
          <h3>{editingNote ? "Edit Note" : "Create Note"}</h3>
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
            {editingNote ? "Update" : "Create"}
          </button>
          {editingNote && (
            <button
              type="button"
              onClick={() => {
                setEditingNote(null);
                setFormData({ title: "", content: "" });
              }}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      <div>
        <h3>My Notes</h3>
        {notes.length === 0 ? (
          <p>No notes yet</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <h4>{note.title}</h4>
              <p>{note.content}</p>
              <small>{new Date(note.createdAt).toLocaleString()}</small>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => startEdit(note)}
                  style={{ marginRight: "10px", padding: "5px 10px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer" }}
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
