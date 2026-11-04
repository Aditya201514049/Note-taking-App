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
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Admin Panel</h2>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "8px" }}>
          Back to Dashboard
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("users")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: activeTab === "users" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: activeTab === "notes" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          All Notes
        </button>
        <button
          onClick={() => setActiveTab("interests")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "interests" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Users by Interests
        </button>
      </div>

      {activeTab === "users" && (
        <div>
          <h3>All Users</h3>
          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: "10px", textAlign: "left" }}>Username</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Role</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "10px" }}>{u.username}</td>
                    <td style={{ padding: "10px" }}>{u.email}</td>
                    <td style={{ padding: "10px" }}>{u.role}</td>
                    <td style={{ padding: "10px" }}>
                      <button
                        onClick={() =>
                          handleUpdateUser(u._id, { role: u.role === "user" ? "admin" : "user" })
                        }
                        style={{ marginRight: "5px", padding: "5px 10px" }}
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer" }}
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
          <h3>All Notes (All Users)</h3>
          {allNotes.length === 0 ? (
            <p>No notes found</p>
          ) : (
            allNotes.map((note) => (
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
          <h3>Users Grouped by Interests (Aggregation)</h3>
          {interestsGroup.length === 0 ? (
            <p>No interests data found</p>
          ) : (
            interestsGroup.map((group) => (
              <div
                key={group._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                <h4>{group._id} ({group.count} users)</h4>
                <ul>
                  {group.users.map((u) => (
                    <li key={u.id}>
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
