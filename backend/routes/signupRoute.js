const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  const roleName = "User"; // Default role

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user exists
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Get role_id
    const [roles] = await db.query("SELECT id FROM users_roles WHERE role_name = ?", [roleName]);
    if (roles.length === 0) {
      return res.status(400).json({ message: "Role not found" });
    }
    const roleId = roles[0].id;

    // Insert user
    await db.query(
      "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, roleId]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});


module.exports = router;
