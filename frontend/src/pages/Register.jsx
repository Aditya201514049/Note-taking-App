import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const PREDEFINED_INTERESTS = ["chess", "reading", "gaming"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password, role, selectedInterests);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: "400px", margin: "80px auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px", color: "#667eea" }}>Create Account</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%" }}
            placeholder="Choose a username"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%" }}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%" }}
            placeholder="Create a password"
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label>Interests (optional):</label>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
            Select your interests:
          </p>
          <div>
            {PREDEFINED_INTERESTS.map((interest) => (
              <label
                key={interest}
                className={`interest-checkbox ${selectedInterests.includes(interest) ? "selected" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selectedInterests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                />
                <span>{interest}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ width: "100%" }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: "20px", textAlign: "center", color: "#666" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
