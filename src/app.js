const express = require('express');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

// Direct all /tasks traffic to our routes file
app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Task Manager API running at http://localhost:${PORT}`);
});