const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all users with roles (excluding passwords)
router.get("/", async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT users.id, users.name, users.email, users_roles.role_name AS role
      FROM users
      JOIN users_roles ON users.role_id = users_roles.id
      WHERE users.role_id != 1;
      ;`
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});


// Update user (excluding password)
router.put("/:id", async (req, res) => {
  const { name, email, role } = req.body;
  const { id } = req.params;

  if (!name || !email || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [roleData] = await db.query(
      "SELECT id FROM users_roles WHERE role_name = ?",
      [role]
    );
    if (roleData.length === 0) {
      return res.status(400).json({ message: "Role not found" });
    }

    const roleId = roleData[0].id;

    await db.query(
      "UPDATE users SET name = ?, email = ?, role_id = ? WHERE id = ?",
      [name, email, roleId, id]
    );

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

module.exports = router;
