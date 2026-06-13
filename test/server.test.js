const tap = require("tap");
const supertest = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../src/app");
const server = supertest(app);
const TASKS_FILE = path.join(__dirname, "../src/data/task.json");

const FIXED_TASKS_DATA = `{
  "tasks": [
    {
      "id": 1,
      "title": "Set up environment",
      "description": "Install Node.js, npm, and git",
      "completed": true,
      "priority": "high",
      "createdAt": "2026-06-09T00:55:00.000Z"
    },
    {
      "id": 2,
      "title": "Create a new project",
      "description": "Create a new project using Magic and structured MVC folders",
      "completed": true,
      "priority": "high",
      "createdAt": "2026-06-09T01:00:00.000Z"
    },
    {
      "id": 3,
      "title": "Install nodemon",
      "description": "Install nodemon as a development dependency",
      "completed": true,
      "priority": "medium",
      "createdAt": "2026-06-09T01:05:00.000Z"
    },
    {
      "id": 4,
      "title": "Install Express",
      "description": "Install Express",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-06-09T01:10:00.000Z"
    },
    {
      "id": 5,
      "title": "Install Mongoose",
      "description": "Install Mongoose",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-06-09T01:15:00.000Z"
    },
    {
      "id": 6,
      "title": "Install Morgan",
      "description": "Install Morgan",
      "completed": false,
      "priority": "low",
      "createdAt": "2026-06-09T01:20:00.000Z"
    },
    {
      "id": 7,
      "title": "Install body-parser",
      "description": "Install body-parser",
      "completed": false,
      "priority": "low",
      "createdAt": "2026-06-09T01:25:00.000Z"
    },
    {
      "id": 8,
      "title": "Install cors",
      "description": "Install cors",
      "completed": false,
      "priority": "medium",
      "createdAt": "2026-06-09T01:30:00.000Z"
    },
    {
      "id": 9,
      "title": "Install passport",
      "description": "Install passport",
      "completed": false,
      "priority": "medium",
      "createdAt": "2026-06-09T01:35:00.000Z"
    },
    {
      "id": 10,
      "title": "Install passport-local",
      "description": "Install passport-local",
      "completed": false,
      "priority": "medium",
      "createdAt": "2026-06-09T01:40:00.000Z"
    },
    {
      "id": 11,
      "title": "Install passport-local-mongoose",
      "description": "Install passport-local-mongoose",
      "completed": false,
      "priority": "medium",
      "createdAt": "2026-06-09T01:45:00.000Z"
    },
    {
      "id": 12,
      "title": "Install express-session",
      "description": "Install express-session",
      "completed": false,
      "priority": "medium",
      "createdAt": "2026-06-09T01:50:00.000Z"
    },
    {
      "id": 13,
      "title": "Install connect-mongo",
      "description": "Install connect-mongo",
      "completed": false,
      "priority": "medium",
      "createdAt": "2026-06-09T01:55:00.000Z"
    },
    {
      "id": 14,
      "title": "Install dotenv",
      "description": "Install dotenv",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-06-09T02:00:00.000Z"
    },
    {
      "id": 15,
      "title": "Install jsonwebtoken",
      "description": "Install jsonwebtoken",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-06-09T02:05:00.000Z"
    },
    {
      "id": 16,
      "title": "Build Postman Collection",
      "description": "Export and test endpoints via JSON configurations",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-06-09T02:10:00.000Z"
    }
  ]
}`;

const restoreTasksFile = () => {
  fs.writeFileSync(TASKS_FILE, FIXED_TASKS_DATA, "utf8");
};

tap.beforeEach(() => {
  restoreTasksFile();
});

restoreTasksFile();

tap.test("POST /tasks", async (t) => {
  const newTask = {
    title: "New Task",
    description: "New Task Description",
    completed: false,
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 201);
  t.end();
});

tap.test("POST /tasks with invalid data", async (t) => {
  const newTask = {
    title: "New Task",
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.end();
});

tap.test("GET /tasks", async (t) => {
  const response = await server.get("/tasks");
  t.equal(response.status, 200);
  t.hasOwnProp(response.body[0], "id");
  t.hasOwnProp(response.body[0], "title");
  t.hasOwnProp(response.body[0], "description");
  t.hasOwnProp(response.body[0], "completed");
  t.type(response.body[0].id, "number");
  t.type(response.body[0].title, "string");
  t.type(response.body[0].description, "string");
  t.type(response.body[0].completed, "boolean");
  t.end();
});

tap.test("GET /tasks with invalid JSON returns 500", async (t) => {
  const existing = fs.readFileSync(TASKS_FILE, "utf8");
  try {
    fs.writeFileSync(TASKS_FILE, "{ invalid json", "utf8");
    const response = await server.get("/tasks");
    t.equal(response.status, 500);
  } finally {
    fs.writeFileSync(TASKS_FILE, existing, "utf8");
  }
  t.end();
});

tap.test("GET /tasks?completed=maybe returns 400", async (t) => {
  const response = await server.get("/tasks").query({ completed: "maybe" });
  t.equal(response.status, 400);
  t.end();
});

tap.test(
  "GET /tasks/priority/:level handles tasks missing priority",
  async (t) => {
    const existing = fs.readFileSync(TASKS_FILE, "utf8");
    try {
      const data = JSON.parse(existing);
      data.tasks.push({
        id: 999,
        title: "No priority task",
        description: "No priority",
        completed: false,
        createdAt: new Date().toISOString(),
      });
      fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2), "utf8");

      const response = await server.get("/tasks/priority/high");
      t.equal(response.status, 200);
      t.type(response.body, "array");
    } finally {
      fs.writeFileSync(TASKS_FILE, existing, "utf8");
    }
    t.end();
  },
);

tap.test("GET /tasks/:id", async (t) => {
  const response = await server.get("/tasks/1");
  t.equal(response.status, 200);
  const expectedTask = {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
  };
  t.match(response.body, expectedTask);
  t.end();
});

tap.test("GET /tasks/:id with invalid id", async (t) => {
  const response = await server.get("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

tap.test("PUT /tasks/:id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 200);
  t.end();
});

tap.test("PUT /tasks/:id with invalid id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
  };
  const response = await server.put("/tasks/999").send(updatedTask);
  t.equal(response.status, 404);
  t.end();
});

tap.test("PUT /tasks/:id with invalid data", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: "true",
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 400);
  t.end();
});

tap.test("DELETE /tasks/:id", async (t) => {
  const response = await server.delete("/tasks/1");
  t.equal(response.status, 200);
  t.end();
});

tap.test("DELETE /tasks/:id with invalid id", async (t) => {
  const response = await server.delete("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

tap.teardown(() => {
  restoreTasksFile();
});
