import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
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
          <h2 style={{ marginBottom: "4px" }}>Welcome back</h2>
          <p style={{ color: "var(--text2)", fontSize: "14px" }}>
            Sign in to your DevBoard account
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
          <form onSubmit={handleLogin}>
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
              Sign In
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "14px", color: "var(--text2)" }}>
          Don't have an account?{" "}
          <a href="/register" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "500" }}>
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}