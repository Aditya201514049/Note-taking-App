import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [interestsGroup, setInterestsGroup] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/users?page=${page}&limit=10`);
      setUsers(response.data.users);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchAllNotes = async () => {
    try {
      const response = await api.get(`/notes/all?page=${page}&limit=10`);
      setAllNotes(response.data.notes);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  };

  const fetchInterestsGroup = async () => {
    try {
      const response = await api.get("/users/by-interests");
      setInterestsGroup(response.data.data);
    } catch (err) {
      console.error("Failed to fetch interests", err);
    }
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "notes") fetchAllNotes();
    if (activeTab === "interests") fetchInterestsGroup();
  }, [activeTab, page]);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      await api.put(`/users/${id}`, userData);
      fetchUsers();
    } catch (err) {
      alert("Failed to update user");
    }
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div className="navbar">
        <h1 style={{ color: "#1a1a2e" }}>Admin Panel</h1>
        <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`tab-button ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          All Notes
        </button>
        <button
          className={`tab-button ${activeTab === "interests" ? "active" : ""}`}
          onClick={() => setActiveTab("interests")}
        >
          Users by Interests
        </button>
      </div>

      {activeTab === "users" && (
        <div>
          <h3 style={{ marginBottom: "20px", color: "#1a1a2e" }}>All Users</h3>
          {users.length === 0 ? (
            <div className="empty-state">
              <p>No users found</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`user-badge ${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      <button
                        className="btn-primary btn-small"
                        onClick={() =>
                          handleUpdateUser(u._id, { role: u.role === "user" ? "admin" : "user" })
                        }
                      >
                        Toggle Role
                      </button>
                      <button
                        className="btn-danger btn-small"
                        onClick={() => handleDeleteUser(u._id)}
                        style={{ marginLeft: "8px" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "notes" && (
        <div>
          <h3 style={{ marginBottom: "20px", color: "#1a1a2e" }}>All Notes (All Users)</h3>
          {allNotes.length === 0 ? (
            <div className="empty-state">
              <p>No notes found</p>
            </div>
          ) : (
            allNotes.map((note) => (
              <div key={note._id} className="note-card">
                <h4>{note.title}</h4>
                <p>{note.content}</p>
                <small>
                  User ID: {note.userId} | Created:{" "}
                  {new Date(note.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "interests" && (
        <div>
          <h3 style={{ marginBottom: "20px", color: "#1a1a2e" }}>
            Users Grouped by Interests (Aggregation)
          </h3>
          {interestsGroup.length === 0 ? (
            <div className="empty-state">
              <p>No interests data found</p>
            </div>
          ) : (
            interestsGroup.map((group) => (
              <div key={group._id} className="interest-group">
                <h4>{group._id} ({group.count} users)</h4>
                <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
                  {group.users.map((u) => (
                    <li key={u.id} style={{ marginBottom: "8px" }}>
                      {u.username} ({u.email})
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
