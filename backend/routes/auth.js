import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import pool from "../db.js";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: "Missing Google credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ error: "Google account has no email" });
    }

    let result = await pool.query("SELECT * FROM users WHERE google_id = $1", [googleId]);
    let user = result.rows[0];

    if (!user) {
      result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      user = result.rows[0];

      if (user) {
        result = await pool.query(
          "UPDATE users SET google_id = $1, avatar_url = $2 WHERE id = $3 RETURNING id, name, email, avatar_url",
          [googleId, picture, user.id]
        );
        user = result.rows[0];
      } else {
        result = await pool.query(
          "INSERT INTO users (name, email, google_id, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id, name, email, avatar_url",
          [name || email, email, googleId, picture]
        );
        user = result.rows[0];
      }
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatar_url },
    });
  } catch (err) {
    console.error("Google auth error:", err.message);
    res.status(401).json({ error: "Google authentication failed" });
  }
});

export default router;