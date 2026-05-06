import express from "express";
import pool from "../db.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

// Create a task
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, project_id } = req.body;
    const result = await pool.query(
      "INSERT INTO tasks (title, description, project_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description, project_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tasks of a project
router.get("/:projectId", authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await pool.query(
      "SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC",
      [projectId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;