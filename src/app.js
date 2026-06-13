const express = require("express");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());

// Direct all /tasks traffic to our routes file
app.use("/tasks", taskRoutes);

module.exports = app;
