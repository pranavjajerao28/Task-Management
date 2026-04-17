const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db"); // Ensure this connects to MySQL
const router = express.Router();

// Get user by ID
router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const [rows] = await db.execute("SELECT name, email FROM users WHERE id = ?", [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update user profile
router.put("/update/:id", async (req, res) => { 
    try {
        const userId = req.params.id;
        const { name, password } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        let query = "UPDATE users SET name = ? WHERE id = ?";
        let values = [name, userId];

        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = "UPDATE users SET name = ?, password = ? WHERE id = ?";
            values = [name, hashedPassword, userId];
        }

        const [result] = await db.execute(query, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
