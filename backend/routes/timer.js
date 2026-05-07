import express from "express";
import pool from "../db.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

// Start timer
router.post("/:taskId/start", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await pool.query(
      "INSERT INTO time_logs (task_id, start_time) VALUES ($1, NOW()) RETURNING *",
      [taskId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Start timer failed" });
  }
});

// Stop timer
router.post("/:taskId/stop", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { rows } = await pool.query(
      `SELECT * FROM time_logs
       WHERE task_id = $1 AND end_time IS NULL
       ORDER BY start_time DESC
       LIMIT 1`,
      [taskId]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "No active timer" });
    }
    const log = rows[0];
    const updated = await pool.query(
      `UPDATE time_logs
       SET end_time = NOW(),
           duration = EXTRACT(EPOCH FROM (NOW() - start_time))::INTEGER
       WHERE id = $1
       RETURNING *`,
      [log.id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stop timer failed" });
  }
});

export default router;