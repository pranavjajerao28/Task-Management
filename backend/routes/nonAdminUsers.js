const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    const { user_id, role_id } = req.query;
    // console.log(user_id)
    // console.log("12")
    if (!user_id || !role_id) {
        return res.status(400).json({ message: "User ID and Role ID are required" });
    }

    try {
        const [users] = await db.query(
            `SELECT users.id, users.name, users.email, users_roles.role_name AS role
             FROM users
             JOIN users_roles ON users.role_id = users_roles.id
             WHERE users.id != ? AND users.role_id = 2;`, 
            [user_id]
        );

        res.json(users);
    } catch (err) {
        console.error("Error fetching non-admin users:", err);
        res.status(500).json({ message: "Database error" });
    }
});
module.exports = router;
