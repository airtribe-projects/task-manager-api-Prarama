const { readTasks, writeTasks } = require("../config/db");

// Helper function to validate task input (Updated with Priority validation)
const validateTaskInput = (body) => {
  const { title, description, completed, priority } = body;
  const validPriorities = ["low", "medium", "high"];

  if (
    title === undefined ||
    description === undefined ||
    completed === undefined ||
    priority === undefined
  ) {
    return {
      isValid: false,
      message:
        "Missing required fields. 'title', 'description', 'completed', and 'priority' must be provided.",
    };
  }
  if (typeof title !== "string" || title.trim() === "") {
    return {
      isValid: false,
      message: "Invalid 'title'. It must be a non-empty string.",
    };
  }
  if (typeof description !== "string" || description.trim() === "") {
    return {
      isValid: false,
      message: "Invalid 'description'. It must be a non-empty string.",
    };
  }
  if (typeof completed !== "boolean") {
    return {
      isValid: false,
      message:
        "Invalid 'completed' status. It must be a boolean value (true or false).",
    };
  }
  // Validate Priority Level
  if (
    typeof priority !== "string" ||
    !validPriorities.includes(priority.toLowerCase())
  ) {
    return {
      isValid: false,
      message:
        "Invalid 'priority'. Must be one of: 'low', 'medium', or 'high'.",
    };
  }

  return { isValid: true };
};

// 1. GET /tasks - Retrieve tasks with optional Filtering & Sorting query parameters
// Examples: /tasks?completed=true  |  /tasks?sortBy=createdAt&order=desc
const getAllTasks = (req, res) => {
  try {
    let tasks = readTasks();
    const { completed, sortBy, order } = req.query;

    // A. Filtering by completion status
    if (completed !== undefined) {
      const isCompleted = completed === "true";
      tasks = tasks.filter((t) => t.completed === isCompleted);
    }

    // B. Sorting by creation date
    if (sortBy === "createdAt") {
      tasks.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        // Default to ascending order unless specified as descending
        return order === "desc" ? dateB - dateA : dateA - dateB;
      });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error while retrieving tasks." });
  }
};

// 2. GET /tasks/:id - Retrieve a specific task by ID
const getTaskById = (req, res) => {
  const taskId = parseInt(req.params.id);
  if (isNaN(taskId))
    return res.status(400).json({ error: "Invalid task ID format." });

  const tasks = readTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (!task)
    return res.status(404).json({ error: `Task with ID ${taskId} not found.` });

  res.status(200).json(task);
};

// 3. GET /tasks/priority/:level - Retrieve tasks filtering strictly by structural priority route
const getTasksByPriority = (req, res) => {
  const priorityLevel = req.params.level.toLowerCase();
  const validPriorities = ["low", "medium", "high"];

  if (!validPriorities.includes(priorityLevel)) {
    return res
      .status(400)
      .json({
        error:
          "Invalid priority level parameter. Use 'low', 'medium', or 'high'.",
      });
  }

  const tasks = readTasks();
  const filteredTasks = tasks.filter(
    (t) => t.priority.toLowerCase() === priorityLevel,
  );

  res.status(200).json(filteredTasks);
};

// 4. POST /tasks - Create a new task with priority tracking
const createTask = (req, res) => {
  const validation = validateTaskInput(req.body);
  if (!validation.isValid)
    return res.status(400).json({ error: validation.message });

  const { title, description, completed, priority } = req.body;
  const tasks = readTasks();

  const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

  const newTask = {
    id: nextId,
    title: title.trim(),
    description: description.trim(),
    completed,
    priority: priority.toLowerCase(),
    createdAt: new Date().toISOString(), // Timestamps added for tracking chronological creation
  };

  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
};

// 5. PUT /tasks/:id - Update task elements including priority fields
const updateTask = (req, res) => {
  const taskId = parseInt(req.params.id);
  if (isNaN(taskId))
    return res.status(400).json({ error: "Invalid task ID format." });

  const validation = validateTaskInput(req.body);
  if (!validation.isValid)
    return res.status(400).json({ error: validation.message });

  const tasks = readTasks();
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1)
    return res.status(404).json({ error: `Task with ID ${taskId} not found.` });

  const { title, description, completed, priority } = req.body;

  // Preserve the original initialization date on update
  const originalCreatedAt =
    tasks[taskIndex].createdAt || new Date().toISOString();

  tasks[taskIndex] = {
    id: taskId,
    title: title.trim(),
    description: description.trim(),
    completed,
    priority: priority.toLowerCase(),
    createdAt: originalCreatedAt,
  };

  writeTasks(tasks);
  res.status(200).json(tasks[taskIndex]);
};

// 6. DELETE /tasks/:id - Delete task entries
const deleteTask = (req, res) => {
  const taskId = parseInt(req.params.id);
  if (isNaN(taskId))
    return res.status(400).json({ error: "Invalid task ID format." });

  const tasks = readTasks();
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1)
    return res.status(404).json({ error: `Task with ID ${taskId} not found.` });

  tasks.splice(taskIndex, 1);
  writeTasks(tasks);
  res
    .status(200)
    .json({ message: `Task with ID ${taskId} has been successfully deleted.` });
};

module.exports = {
  getAllTasks,
  getTaskById,
  getTasksByPriority,
  createTask,
  updateTask,
  deleteTask,
};
