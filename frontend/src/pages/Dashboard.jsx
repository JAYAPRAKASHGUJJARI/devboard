import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Welcome, {user?.name}! 👋</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <p>Your projects will appear here.</p>
    </div>
  );
}