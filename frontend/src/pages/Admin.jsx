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
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/users?page=${page}&limit=10`);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchAllNotes = async () => {
    try {
      const response = await api.get(`/notes/all?page=${page}&limit=10`);
      setAllNotes(response.data.notes);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  };

  const fetchInterestsGroup = async () => {
    try {
      const response = await api.get(`/users/by-interests?page=${page}&limit=10`);
      setInterestsGroup(response.data.data);
      setPagination(response.data.pagination);
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
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      await api.put(`/users/${id}`, userData);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    try {
      await api.post("/users", newUser);
      setNewUser({ username: "", email: "", password: "", role: "user" });
      setShowAddUser(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
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
          onClick={() => {
            setPage(1);
            setActiveTab("users");
          }}
        >
          Users
        </button>
        <button
          className={`tab-button ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => {
            setPage(1);
            setActiveTab("notes");
          }}
        >
          All Notes
        </button>
        <button
          className={`tab-button ${activeTab === "interests" ? "active" : ""}`}
          onClick={() => {
            setPage(1);
            setActiveTab("interests");
          }}
        >
          Users by Interests
        </button>
      </div>

      {activeTab === "users" && (
        <div>
          <div className="navbar">
            <h3 style={{ marginBottom: "20px", color: "#1a1a2e" }}>All Users</h3>
            <button
              className="btn-primary"
              onClick={() => setShowAddUser((visible) => !visible)}
            >
              {showAddUser ? "Cancel" : "Add User"}
            </button>
          </div>
          {showAddUser && (
            <form className="card" onSubmit={handleCreateUser}>
              <div className="form-group">
                <label htmlFor="new-username">Username:</label>
                <input
                  id="new-username"
                  value={newUser.username}
                  onChange={(event) =>
                    setNewUser({ ...newUser, username: event.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-email">Email:</label>
                <input
                  id="new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(event) =>
                    setNewUser({ ...newUser, email: event.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-password">Password:</label>
                <input
                  id="new-password"
                  type="password"
                  minLength="6"
                  value={newUser.password}
                  onChange={(event) =>
                    setNewUser({ ...newUser, password: event.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-role">Role:</label>
                <select
                  id="new-role"
                  value={newUser.role}
                  onChange={(event) =>
                    setNewUser({ ...newUser, role: event.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">
                Create User
              </button>
            </form>
          )}
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
          <div className="pagination-controls">
            <button
              className="btn-secondary"
              onClick={() => setPage((current) => current - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>Page {page} of {pagination.pages}</span>
            <button
              className="btn-secondary"
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= pagination.pages}
            >
              Next
            </button>
          </div>
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
                  By: {note.userId?.username || note.userId} ({note.userId?.email || ""}) | Created:{" "}
                  {new Date(note.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
          <div className="pagination-controls">
            <button
              className="btn-secondary"
              onClick={() => setPage((current) => current - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>Page {page} of {pagination.pages}</span>
            <button
              className="btn-secondary"
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= pagination.pages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === "interests" && (
        <div>
          <h3 style={{ marginBottom: "20px", color: "#1a1a2e" }}>
            Users Grouped by Interests (Aggregation)
          </h3>
          {interestsGroup.length === 0 ? (
            <div className="empty-state">
              <p>No interests data found. Users need to add interests first!</p>
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
          <div className="pagination-controls">
            <button
              className="btn-secondary"
              onClick={() => setPage((current) => current - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>Page {page} of {pagination.pages}</span>
            <button
              className="btn-secondary"
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= pagination.pages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
