const express = require("express");
const db = require("../db");
const router = express.Router();
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Ensure uploads/ exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });
// Create a new task



router.post("/", upload.single("attachment"), async (req, res) => {
    const { title, description, status, user_id, deadline, priority, users } = req.body;
    
    if (!title || !description || !status || !user_id || !deadline || !priority) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO tasks (title, description, status, created_by, deadline, priority) VALUES (?, ?, ?, ?, ?, ?)",
            [title, description, status, user_id, deadline, priority]
        );
        const taskId = result.insertId;
        const parsedUsers = JSON.parse(users);
        

        for (const user of parsedUsers) {
            await db.query("INSERT INTO task_assignments (task_id, user_id, assigned_by) VALUES (?, ?, ?)", 
                [taskId, user, user_id]);
        }
        
        // Store file URL if an attachment was uploaded
        if (req.file) {
            const fileUrl = `/uploads/${req.file.filename}`;
            await db.query("INSERT INTO attachments (task_id, user_id, file_url) VALUES (?, ?, ?)", 
                [taskId, user_id, fileUrl]);
        }

        res.status(200).json({ message: "Task created successfully", taskId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});

router.get("/get_tasks", async (req, res) => {
    const { user_id } = req.query; // Get user_id from query parameters

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const [tasks] = await db.query(
            `SELECT t.id, t.title, t.description, t.status, t.deadline, t.priority, t.created_by
             FROM tasks t
             JOIN task_assignments ta ON t.id = ta.task_id
             WHERE ta.user_id = ?`,
            [user_id]
        );
        if (tasks.length === 0) {
            return res.status(200).json({ message: "No tasks assigned" });
        }
        for (let task of tasks) {
            const [attachments] = await db.query(
               ` SELECT file_url FROM attachments WHERE task_id = ?`,
                [task.id]
            );
            task.attachments = attachments; 
        }
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Database error" });
    }
});

router.get("/alltasks", async (req, res) => {
    try {
        const query = "SELECT id, title, description, status, created_by, deadline, priority FROM tasks";
        const [tasks] = await db.query(query);
         // Fetch attachments for each task
         for (let task of tasks) {
            const [attachments] = await db.query(
               ` SELECT file_url FROM attachments WHERE task_id = ?`,
                [task.id]
            );
            task.attachments = attachments; // Add attachments to task object
        }
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

router.get("/get_comments", async (req, res) => {
    const { task_id } = req.query;

    if (!task_id) {
        return res.status(400).json({ message: "Task ID is required" });
    }

    try {
        const query = `
            SELECT c.id, c.comment, c.created_at, u.name AS user_name
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.task_id = ?;
        `;

        const [results] = await db.query(query, [task_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

router.post("/comments", async (req, res) => {
    const { text, user_id,task_id } = req.body;

    // console.log(text,user_id)
    if (!task_id || !text || !user_id) {
      return res.status(400).json({ error: "Task ID, User ID, and Comment text are required" });
    }
  
    const query = `
      INSERT INTO comments (task_id, user_id, comment) 
      VALUES (?, ?, ?)`;
  
    try {
      const [result] = await db.execute(query, [task_id, user_id, text]);
      res.status(200).json({ message: "Comment added successfully", comment_id: result.insertId });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });




  router.get("/manager_task", async (req, res) => {
    const { user_id } = req.query; // Get user_id from query parameters
    
    
    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const [tasks] = await db.query(
            `SELECT id, title, description, status, deadline, priority, created_by
             FROM tasks 
             WHERE created_by = ?`,
            [user_id]
        );

        if (tasks.length === 0) {
            return res.status(200).json({ message: "No tasks assigned" });
        }

        // Fetch attachments for each task
        for (let task of tasks) {
            const [attachments] = await db.query(
               ` SELECT file_url FROM attachments WHERE task_id = ?`,
                [task.id]
            );
            task.attachments = attachments; // Add attachments to task object
        }

        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});




router.get("/admin_task", async (req, res) => {
        try {
        const [tasks] = await db.query(
            `SELECT id, title, description, status, deadline, priority, created_by
             FROM tasks `
        );
        
        if (tasks.length === 0) {
            return res.status(200).json({ message: "No tasks assigned" });
        }
        for (let task of tasks) {
            const [attachments] = await db.query(
               ` SELECT file_url FROM attachments WHERE task_id = ?`,
                [task.id]
            );
            task.attachments = attachments; // Add attachments to task object
        }
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Database error" });
    }
});
module.exports = router;
