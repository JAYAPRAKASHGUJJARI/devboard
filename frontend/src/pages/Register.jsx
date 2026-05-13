import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        padding: "2rem",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "var(--accent)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            fontSize: "24px",
          }}>
            📋
          </div>
          <h2 style={{ marginBottom: "4px" }}>Create account</h2>
          <p style={{ color: "var(--text2)", fontSize: "14px" }}>
            Start tracking your projects today
          </p>
        </div>

        {/* Card */}
        <div className="card">
          {error && (
            <div style={{
              background: "#ff3b3015",
              border: "1px solid #ff3b3040",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "1rem",
              fontSize: "13px",
              color: "var(--accent3)",
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleRegister}>
            <label style={{ fontSize: "13px", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "4px" }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Jayaprakash"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label style={{ fontSize: "13px", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "4px" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label style={{ fontSize: "13px", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "4px" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
              Create Account
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "14px", color: "var(--text2)" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "500" }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}