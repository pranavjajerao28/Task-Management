const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); 

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // const [dbTest] = await db.query("SELECT 1");
    // console.log("Database connected successfully!");

    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role_id, user_id: user.id });
  } catch (error) {
    console.error("Database or Server Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
