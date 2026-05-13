import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskError, setTaskError] = useState("");
  const [activeTimers, setActiveTimers] = useState(() => {
    const saved = localStorage.getItem("activeTimers");
    return saved ? JSON.parse(saved) : {};
  });
  const [taskTimes, setTaskTimes] = useState({});
  const [liveSeconds, setLiveSeconds] = useState({});
  const intervalRefs = useRef({});

  const startLiveTick = useCallback((taskId, startTime) => {
    if (intervalRefs.current[taskId]) clearInterval(intervalRefs.current[taskId]);
    const getElapsed = () => Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
    setLiveSeconds((prev) => ({ ...prev, [taskId]: getElapsed() }));
    const interval = setInterval(() => {
      setLiveSeconds((prev) => ({ ...prev, [taskId]: getElapsed() }));
    }, 1000);
    intervalRefs.current[taskId] = interval;
  }, []);

  useEffect(() => {
    fetchTasks();
    const saved = localStorage.getItem("activeTimers");
    if (saved) {
      const timers = JSON.parse(saved);
      Object.entries(timers).forEach(([taskId, startTime]) => {
        if (startTime) startLiveTick(taskId, startTime);
      });
    }
    return () => Object.values(intervalRefs.current).forEach(clearInterval);
  }, [startLiveTick]);

  useEffect(() => {
    localStorage.setItem("activeTimers", JSON.stringify(activeTimers));
  }, [activeTimers]);

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      setTasks(res.data);
      fetchAllTaskTimes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllTaskTimes = async (taskList) => {
    const times = {};
    for (const task of taskList) {
      try {
        const res = await API.get(`/timer/${task.id}`);
        times[task.id] = res.data;
      } catch (err) {
        times[task.id] = { totalSeconds: 0, minutes: 0, seconds: 0 };
      }
    }
    setTaskTimes(times);
  };

  const fetchTaskTime = async (taskId) => {
    try {
      const res = await API.get(`/timer/${taskId}`);
      setTaskTimes((prev) => ({ ...prev, [taskId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setTaskError("Task title is required."); return; }
    setTaskError("");
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

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartTimer = async (taskId) => {
    try {
      await API.post(`/timer/${taskId}/start`);
      const startTime = new Date().toISOString();
      setActiveTimers((prev) => ({ ...prev, [taskId]: startTime }));
      startLiveTick(taskId, startTime);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStopTimer = async (taskId) => {
    try {
      await API.post(`/timer/${taskId}/stop`);
      if (intervalRefs.current[taskId]) {
        clearInterval(intervalRefs.current[taskId]);
        delete intervalRefs.current[taskId];
      }
      setLiveSeconds((prev) => { const u = { ...prev }; delete u[taskId]; return u; });
      setActiveTimers((prev) => { const u = { ...prev }; delete u[taskId]; return u; });
      await fetchTaskTime(taskId);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (taskId) => {
    const time = taskTimes[taskId];
    if (!time || time.totalSeconds === 0) return null;
    const h = Math.floor(time.totalSeconds / 3600);
    const m = time.minutes % 60;
    const s = time.seconds;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const formatLiveTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <button className="btn-secondary" onClick={() => navigate("/dashboard")}>← Back</button>

      <h2 style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>Project Tasks</h2>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3>Add New Task</h3>
        <form onSubmit={handleCreateTask}>
          {taskError && (
            <p style={{ color: "var(--accent3)", marginBottom: "0.5rem", fontSize: "13px" }}>
              {taskError}
            </p>
          )}
          <input
            type="text"
            placeholder="Task title *"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setTaskError(""); }}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">+ Add Task</button>
        </form>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {["todo", "in_progress", "done"].map((status) => {
          const filteredTasks = tasks.filter((task) => task.status === status);
          if (filteredTasks.length === 0) return null;
          return (
            <div key={status}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "0.75rem"
              }}>
                <div style={{
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: status === "todo" ? "#ff9f0a" : status === "in_progress" ? "#0071e3" : "#34c759"
                }}></div>
                <h4 style={{ color: "var(--text2)", fontSize: "13px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {status === "todo" ? "To Do" : status === "in_progress" ? "In Progress" : "Done"}
                </h4>
                <span style={{
                  background: "var(--bg4)",
                  borderRadius: "12px",
                  padding: "2px 8px",
                  fontSize: "11px",
                  color: "var(--text2)"
                }}>
                  {filteredTasks.length}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {filteredTasks.map((task) => (
                  <div key={task.id} className="card" style={{
                    borderLeft: `3px solid ${status === "todo" ? "#ff9f0a" : status === "in_progress" ? "#0071e3" : "#34c759"}`,
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem"
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: "600", fontSize: "15px", marginBottom: "4px" }}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p style={{ fontSize: "13px", color: "var(--text2)" }}>
                          {task.description}
                        </p>
                      )}
                      {!activeTimers[task.id] && formatTime(task.id) && (
                        <p style={{ fontSize: "12px", color: "var(--accent2)", marginTop: "4px" }}>
                          ⏱ {formatTime(task.id)}
                        </p>
                      )}
                      {activeTimers[task.id] && (
                        <div style={{
                          fontSize: "13px", color: "var(--accent3)",
                          fontWeight: "600", marginTop: "4px",
                          display: "flex", alignItems: "center", gap: "6px"
                        }}>
                          <span style={{
                            width: "8px", height: "8px", borderRadius: "50%",
                            background: "var(--accent3)", display: "inline-block",
                            animation: "pulse-dot 1s infinite"
                          }}></span>
                          {formatLiveTime(liveSeconds[task.id] || 0)}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        style={{ width: "130px", marginBottom: "0", fontSize: "13px" }}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>

                      {activeTimers[task.id] ? (
                        <button className="btn-stop" onClick={() => handleStopTimer(task.id)}
                          style={{ whiteSpace: "nowrap" }}>
                          ⏹ Stop
                        </button>
                      ) : (
                        <button className="btn-success" onClick={() => handleStartTimer(task.id)}
                          style={{ whiteSpace: "nowrap" }}>
                          ▶ Start
                        </button>
                      )}

                      <button className="btn-danger" onClick={() => handleDeleteTask(task.id)}
                        style={{ fontSize: "13px", padding: "6px 10px" }}>
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {tasks.length === 0 && (
          <p style={{ color: "var(--text2)", textAlign: "center", marginTop: "2rem" }}>
            No tasks yet. Add your first task above!
          </p>
        )}
      </div>
    </div>
  );
}