import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError("Project title is required."); return; }
    setError("");
    try {
      await API.post("/projects", { title, description });
      setTitle("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project? All tasks will be deleted too.")) return;
    try {
      await API.delete(`/projects/${projectId}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Navbar */}
      <div style={{
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <h3 style={{ margin: 0, color: "var(--accent)", fontSize: "20px" }}>
          DevBoard
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "14px", color: "var(--text2)" }}>
            👋 {user?.name}
          </span>
          <button
            className="btn-secondary"
            onClick={() => navigate("/analytics")}
          >
            Analytics
          </button>
          <button className="btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>

        {/* Create project card */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3>Create New Project</h3>
          {error && (
            <p style={{ color: "var(--accent3)", marginBottom: "0.5rem", fontSize: "13px" }}>
              {error}
            </p>
          )}
          <form onSubmit={handleCreateProject}>
            <input
              type="text"
              placeholder="Project title *"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">+ Create Project</button>
          </form>
        </div>

        {/* Projects list */}
        <h3>Your Projects</h3>
        {projects.length === 0 && (
          <p style={{ color: "var(--text2)", textAlign: "center", marginTop: "2rem" }}>
            No projects yet. Create your first one above!
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                borderLeft: "3px solid var(--accent)",
              }}
            >
              <div>
                <h4 style={{ fontSize: "16px", marginBottom: "4px" }}>
                  {project.title}
                </h4>
                <p style={{ fontSize: "13px", color: "var(--text2)" }}>
                  {project.description || "No description"}
                </p>
              </div>
              <button
                className="btn-danger"
                onClick={(e) => handleDeleteProject(e, project.id)}
                style={{ flexShrink: 0, marginLeft: "1rem" }}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}