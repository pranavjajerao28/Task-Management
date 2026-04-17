const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure you have a database connection set up

router.get("/dashboard", async (req, res) => {
    try {
        // Fetch total users
        
        const [users] = await db.query("SELECT COUNT(*) as total_users FROM users");
        // Fetch total managers
        const [managers] = await db.query("SELECT COUNT(*) as total_managers FROM users WHERE role_id = 3");

        // Fetch active tasks
        const [activeTasks] = await db.query("SELECT COUNT(*) as active_tasks FROM tasks WHERE status IN ('pending', 'in-progress')");

        // Fetch high-priority tasks
        const [highPriorityTasks] = await db.query("SELECT COUNT(*) as high_priority_tasks FROM tasks WHERE priority = 'high'");

        // Fetch task counts by status
        const [pendingTasks] = await db.query("SELECT COUNT(*) as pending FROM tasks WHERE status = 'pending'");
        const [inProgressTasks] = await db.query("SELECT COUNT(*) as in_progress FROM tasks WHERE status = 'in-progress'");
        const [completedTasks] = await db.query("SELECT COUNT(*) as completed FROM tasks WHERE status = 'completed'");

        // Fetch recent activities
        // const [recentActivities] = await db.query(`
        //     SELECT activity_type, details, created_at 
        //     FROM activity_log 
        //     ORDER BY created_at DESC 
        //     LIMIT 5
        // `);

        res.status(200).json({
            total_users: users[0].total_users,
            total_managers: managers[0].total_managers,
            active_tasks: activeTasks[0].active_tasks,
            high_priority_tasks: highPriorityTasks[0].high_priority_tasks,
            pending_tasks: pendingTasks[0].pending,
            in_progress_tasks: inProgressTasks[0].in_progress,
            completed_tasks: completedTasks[0].completed,
            // recent_activities: recentActivities
        });

    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        res.status(500).json({ message: "Database error" });
    }
});

module.exports = router;