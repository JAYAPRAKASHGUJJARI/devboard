import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Analytics() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectRes = await API.get("/projects");
      setProjects(projectRes.data);
      const allTasks = [];
      for (const project of projectRes.data) {
        const taskRes = await API.get(`/tasks/${project.id}`);
        allTasks.push(...taskRes.data);
      }
      setTasks(allTasks);
    } catch (err) {
      console.error(err);
    }
  };

  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const StatCard = ({ value, label, color, emoji }) => (
    <div className="card" style={{ textAlign: "center", borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: "2.5rem", fontWeight: "700", color: color, marginBottom: "4px" }}>
        {value}
      </div>
      <div style={{ fontSize: "13px", color: "var(--text2)", fontWeight: "500" }}>
        {emoji} {label}
      </div>
    </div>
  );

  const ProgressBar = ({ label, count, total, color }) => (
    <div style={{ marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text2)" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)" }}>
          {count} <span style={{ color: "var(--text3)" }}>/ {total}</span>
        </span>
      </div>
      <div style={{ background: "var(--bg4)", borderRadius: "8px", height: "10px", overflow: "hidden" }}>
        <div style={{
          background: color,
          width: `${total ? (count / total) * 100 : 0}%`,
          height: "100%",
          borderRadius: "8px",
          transition: "width 0.6s ease"
        }}></div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Navbar */}
      <div style={{
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <button className="btn-secondary" onClick={() => navigate("/dashboard")}>← Back</button>
        <h3 style={{ margin: 0, color: "var(--accent)", fontSize: "20px" }}>DevBoard</h3>
      </div>

      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>Analytics</h2>
        <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "2rem" }}>
          Overview of your projects and tasks
        </p>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard value={projects.length} label="Projects" color="#0071e3" emoji="📁" />
          <StatCard value={tasks.length} label="Total Tasks" color="#8e44ad" emoji="📋" />
          <StatCard value={inProgressCount} label="In Progress" color="#ff9f0a" emoji="⚡" />
          <StatCard value={doneCount} label="Completed" color="#34c759" emoji="✅" />
        </div>

        {/* Progress bars */}
        <div className="card">
          <h3>Task Status Breakdown</h3>
          {tasks.length === 0 ? (
            <p style={{ color: "var(--text2)", fontSize: "14px" }}>No tasks yet.</p>
          ) : (
            <>
              <ProgressBar
                label="To Do"
                count={todoCount}
                total={tasks.length}
                color="#ff9f0a"
              />
              <ProgressBar
                label="In Progress"
                count={inProgressCount}
                total={tasks.length}
                color="#0071e3"
              />
              <ProgressBar
                label="Done"
                count={doneCount}
                total={tasks.length}
                color="#34c759"
              />
            </>
          )}
        </div>

        {/* Projects breakdown */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3>Projects Overview</h3>
          {projects.length === 0 ? (
            <p style={{ color: "var(--text2)", fontSize: "14px" }}>No projects yet.</p>
          ) : (
            projects.map((project) => (
              <div key={project.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 0",
                borderBottom: "1px solid var(--border)",
              }}>
                <div>
                  <p style={{ fontWeight: "600", fontSize: "14px" }}>{project.title}</p>
                  <p style={{ fontSize: "12px", color: "var(--text2)" }}>{project.description || "No description"}</p>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => navigate(`/projects/${project.id}`)}
                  style={{ fontSize: "13px" }}
                >
                  View →
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}