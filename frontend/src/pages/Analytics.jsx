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

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
      <h2 style={{ marginTop: "1rem" }}>Analytics</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "2rem" }}>
        <div style={{ background: "#f0f0f0", borderRadius: "8px", padding: "1.5rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "2rem" }}>{projects.length}</h3>
          <p>Total Projects</p>
        </div>
        <div style={{ background: "#fff3cd", borderRadius: "8px", padding: "1.5rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "2rem" }}>{todoCount}</h3>
          <p>Tasks To Do</p>
        </div>
        <div style={{ background: "#d4edda", borderRadius: "8px", padding: "1.5rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "2rem" }}>{doneCount}</h3>
          <p>Tasks Done</p>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>Task Status Breakdown</h3>
        <div style={{ marginTop: "1rem" }}>
          <p>To Do</p>
          <div style={{ background: "#e0e0e0", borderRadius: "4px", height: "20px" }}>
            <div style={{ background: "#ffc107", width: `${tasks.length ? (todoCount / tasks.length) * 100 : 0}%`, height: "100%", borderRadius: "4px" }}></div>
          </div>
          <p>In Progress</p>
          <div style={{ background: "#e0e0e0", borderRadius: "4px", height: "20px" }}>
            <div style={{ background: "#17a2b8", width: `${tasks.length ? (inProgressCount / tasks.length) * 100 : 0}%`, height: "100%", borderRadius: "4px" }}></div>
          </div>
          <p>Done</p>
          <div style={{ background: "#e0e0e0", borderRadius: "4px", height: "20px" }}>
            <div style={{ background: "#28a745", width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%`, height: "100%", borderRadius: "4px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}