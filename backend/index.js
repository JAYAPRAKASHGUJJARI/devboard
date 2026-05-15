import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";
import timerRoutes from "./routes/timer.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: ["https://devboard-azure.vercel.app", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/timer", timerRoutes);

app.get("/", (req, res) => {
  res.json({ message: "DevBoard API is running" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));