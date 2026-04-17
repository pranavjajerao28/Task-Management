require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const signupRoute = require("./routes/signupRoute");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/tasks");
const nonAdminUsersRoutes = require("./routes/nonAdminUsers");
const userProfile = require('./routes/userprofile')
const login = require('./routes/login')
const app = express();
const PORT = process.env.PORT || 5001;
const admindashboard = require('./routes/admindashboard')
const path = require('path')


app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth/signup", signupRoute);
app.use("/api/users", userRoutes);
app.use("/api/users/non-admins", nonAdminUsersRoutes);
app.use("/api/tasks", taskRoutes);
app.use('/api/auth/handle_login',login)
app.use('/api/admin',admindashboard)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userProfile);


app.get("/uploads/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    res.download(filePath, req.params.filename, (err) => {
        if (err) {
            console.error("File download error:", err);
            res.status(500).send("Error downloading file");
        }
    });
});


app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
