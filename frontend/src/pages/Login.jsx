import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api/axios";

export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
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
      <div style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "56px", height: "56px", background: "var(--accent)",
            borderRadius: "16px", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 1rem", fontSize: "24px",
          }}>
            📋
          </div>
          <h2 style={{ marginBottom: "4px" }}>Welcome to DevBoard</h2>
          <p style={{ color: "var(--text2)", fontSize: "14px" }}>
            Sign in with Google to continue
          </p>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          {error && (
            <div style={{
              width: "100%", background: "#ff3b3015", border: "1px solid #ff3b3040",
              borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "var(--accent3)",
            }}>
              {error}
            </div>
          )}
        <GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => setError("Google sign-in failed. Please try again.")}
  theme="outline"
  size="large"
  width="320"
  text="signin_with"
/>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "13px", color: "var(--text3)" }}>
          By continuing you agree to DevBoard's terms and privacy policy.
        </p>
      </div>
    </div>
  );
}