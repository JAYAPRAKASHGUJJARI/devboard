import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", { title, description, project_id: id });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
      <h2 style={{ marginTop: "1rem" }}>Project Tasks</h2>

      <form onSubmit={handleCreateTask} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <button type="submit">Add Task</button>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        {["todo", "in_progress", "done"].map((status) => (
          <div key={status} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem" }}>
            <h4>{status === "todo" ? "To Do" : status === "in_progress" ? "In Progress" : "Done"}</h4>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task.id} style={{ background: "#f5f5f5", borderRadius: "6px", padding: "0.5rem", marginBottom: "0.5rem" }}>
                  <p><strong>{task.title}</strong></p>
                  <p style={{ fontSize: "12px" }}>{task.description}</p>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    style={{ fontSize: "12px", marginTop: "0.5rem" }}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
