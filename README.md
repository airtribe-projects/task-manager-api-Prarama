# Task Manager API 🚀

A lightweight, scalable, and robust RESTful API built with Node.js and Express to manage tasks. This project implements full CRUD functionality utilizing a persistent local JSON file database alongside standard Model-View-Controller (MVC) architectural design patterns.

---

## 📂 Features & Extensions

* **Full CRUD Lifecycle:** Create, Read, Update, and Delete task records.
* **Object-Wrapped File Persistence:** Data is safely stored and read from an object-wrapped local file structure (`src/data/task.json`) using a translation layer that prevents database corruption.
* **Input Validation & Error Sanitization:** Protects backend states against bad inputs, invalid data types, empty attributes, or malformed parameters.
* **Advanced Query Support:** Built-in filtering by completion state and chronological sorting features.
* **Priority-Based Management:** Segment and filter tasks selectively by priority flags (`low`, `medium`, `high`).

---

## 🛠️ Project Structure

The project is organized into a professional MVC structural format to keep layers isolated and modular:

```text
TASK-MANAGER-API-PRARAMA/
├── src/
│   ├── config/        # File I/O operations & object wrapper mapping (db.js)
│   ├── controllers/   # Request-response routers logic (taskController.js)
│   ├── data/          # Local storage engine (task.json)
│   ├── routes/        # Router orchestration mappings (taskRoutes.js)
│   └── app.js         # Express app initialization entry point
├── test/              # Integration and unit testing suite (server.test.js)
├── .gitignore         # Git ignore files configuration
├── package-lock.json  # NPM auto-generated lock file
└── package.json       # App manifests and script configurations

⚙️ Setup & Installation Instructions
Follow these quick steps to get the server running locally on your computer:
```bash
# Clone the repository
git clone https://github.com/airtribe-projects/task-manager-api-Prarama.git

# Move into the directory
cd task-manager-api-Prarama

# Install dependencies
npm install

#Initialize your local storage file Ensure your src/data/task.json file is formatted as an object containing a tasks array
{
  "tasks": [
    {
      "id": 2,
      "title": "Create a new project",
      "description": "Create a new project using Magic and structured MVC folders",
      "completed": true,
      "priority": "high",
      "createdAt": "2026-06-09T01:00:00.000Z"
    }
  ]
}

#Boot the development server Run the dev script using nodemon so the server watches for file saves and auto-restarts
npm run dev

The server will initialize at: http://localhost:3000
```
# 📖 API Endpoint Documentation

All interaction endpoints are prefixed globally by `/tasks`.

---

### 1. Get All Tasks (with Filtering & Sorting)
Retrieves a list of all tasks from the local storage with optional support for state-based filtering and chronological sorting.

* **Route:** `GET /tasks`
* **Query Parameters (Optional):**
  * `completed` (boolean): Filters tasks by their completion status (`true` / `false`).
  * `sortBy` (string): Set to `createdAt` to sort tasks chronologically by their creation timestamp.
  * `order` (string): Pair with `sortBy` (`asc` for ascending order or `desc` for descending order).
* **Example Request URL:** `http://localhost:3000/tasks?completed=false&sortBy=createdAt&order=desc`
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": 16,
      "title": "Build Postman Collection",
      "description": "Export and test endpoints via JSON configurations",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-06-09T02:10:00.000Z"
    }
  ]
  ```
### 2. Get Tasks by Priority Level

Retrieves a filtered array of tasks that strictly match the specified priority tier.

* **Route:** `GET /tasks/priority/:level`
* **HTTP Method:** `GET`
* **Route Path Parameter:**
  * `:level` (string, required): The priority classification level. Must be exactly one of the following lowercase values: `low`, `medium`, or `high`.
* **Headers:** None required.

#### Example Request
* **URL:** `http://localhost:3000/tasks/priority/high`

#### Success Response (200 OK)
Returns a JSON array of all task objects whose `priority` property matches the query parameter level.

```json
[
  {
    "id": 2,
    "title": "Create a new project",
    "description": "Create a new project using Magic and structured MVC folders",
    "completed": true,
    "priority": "high",
    "createdAt": "2026-06-09T01:00:00.000Z"
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
    "id": 16,
    "title": "Build Postman Collection",
    "description": "Export and test endpoints via JSON configurations",
    "completed": false,
    "priority": "high",
    "createdAt": "2026-06-09T02:10:00.000Z"
  }
]
```
### 3. Get Specific Task by ID

Retrieves the details of a single task item matching the designated unique numeric identifier.

* **Route:** `/tasks/:id`
* **HTTP Method:** `GET`
* **Route Path Parameter:**
  * `:id` (integer, required): The unique numeric identifier assigned to the task.
* **Headers:** None required.

#### Example Request
* **URL:** `http://localhost:3000/tasks/2`

#### Success Response (200 OK)
Returns a single JSON object containing all details of the requested task.

```json
{
  "id": 2,
  "title": "Create a new project",
  "description": "Create a new project using Magic and structured MVC folders",
  "completed": true,
  "priority": "high",
  "createdAt": "2026-06-09T01:00:00.000Z"
}
```

### 4. Create New Task (with Validation)

Generates a new task record, automatically appends a unique auto-incremented ID along with a fresh creation timestamp, and writes the updated collection to the persistent JSON database file.

* **Route:** `/tasks`
* **HTTP Method:** `POST`
* **Headers:** * `Content-Type: application/json`

#### Expected Request Body
The incoming payload must be a JSON object containing all required fields.

```json
{
  "title": "Implement Unit Testing",
  "description": "Write integration tests using Jest or Supertest",
  "completed": false,
  "priority": "high"
}
```
### 5. Update Task by ID (with Validation)

Modifies individual properties of an existing task matching the specified unique ID while preserving its initial chronological creation timestamp.

* **Route:** `/tasks/:id`
* **HTTP Method:** `PUT`
* **Headers:**
  * `Content-Type: application/json`
* **Route Path Parameter:**
  * `:id` (integer, required): The unique numeric identifier assigned to the task to be updated.

#### Expected Request Body
The payload must be a full JSON object containing all required fields with your updated information.

```json
{
  "title": "Create a new project",
  "description": "Create a new project using Magic and updated MVC structures",
  "completed": true,
  "priority": "medium"
}
```

### 6. Delete Task by ID

Permanently removes a specific task matching the unique identifier from the local JSON storage file.

* **Route:** `/tasks/:id`
* **HTTP Method:** `DELETE`
* **Route Path Parameter:**
  * `:id` (integer, required): The unique numeric identifier assigned to the task you want to delete.
* **Headers:** None required.

#### Example Request
* **URL:** `http://localhost:3000/tasks/2`

#### Success Response (200 OK)
Returns a clear confirmation message confirming the item was successfully removed from the file.

```json
{
  "message": "Task with ID 2 has been successfully deleted."
}
```

# 🧪 How to Test the API

To verify that the Task Manager API handles CRUD operations, filters data correctly, manages priorities, and triggers validation rules appropriately, you can test it using **Postman** (Graphic User Interface) or **cURL** (Command Line Interface).

---

## Method A: Postman Collection (Recommended)

Postman provides an isolated visual interface to execute HTTP request sequences, store sample payloads, and toggle test query string variables dynamically.

### 1. Import the Collection
1. Copy your generated `TaskManagerAPI.postman_collection.json` content and save it locally on your computer.
2. Open Postman.
3. Click the **Import** button located in the top-left navigation panel.
4. Drag and drop your saved JSON file into the import area, or select it via your file explorer.

### 2. Testing Query Parameters (Filters & Sorting)
For the **"Get All Tasks"** route, Postman lists all configuration variables under the **Params** tab directly underneath the address bar. 
* To filter for only uncompleted items, check the box next to `completed` and verify that the value matches `false`.
* To test chronological sorting, ensure that `sortBy` is checked with the value `createdAt` and `order` is configured as `desc` (descending) or `asc` (ascending).

### 3. Testing Validation & Error States
To confirm that your controller handles unexpected data safely, navigate to the **"Create New Task"** or **"Update Task By ID"** requests and open the **Body** tab (set to `raw` and `JSON`):
* **Empty Field Test:** Clear out the `title` text string completely (`"title": ""`) and click **Send**. The server will intercept it and return a `400 Bad Request` status along with a validation error message.
* **Type Validation Test:** Replace the boolean variable under `completed` with a text string (`"completed": "not-a-boolean"`) and fire the request. The application will safely block the write request, return a `400 Bad Request`, and keep your local JSON database uncorrupted.

---

## Method B: cURL Commands via Terminal

If you prefer testing endpoints directly from your command line terminal, execute the following shell snippets against your active development server instance (`http://localhost:3000`).

### 1. Test Creating a Task (POST)
This command fires a structured JSON request body to instantiate a new record:
```bash
curl -X POST http://localhost:3000/tasks \
     -H "Content-Type: application/json" \
     -d '{"title": "Implement Unit Testing", "description": "Write integration tests using Jest or Supertest", "completed": false, "priority": "high"}'
