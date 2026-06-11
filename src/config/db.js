const fs = require("fs");
const path = require("path");

const TASKS_FILE = path.join(__dirname, "../data/task.json");

const readTasks = () => {
  try {
    const fileData = fs.readFileSync(TASKS_FILE, "utf8");

    if (!fileData.trim()) {
      return [];
    }

    const dataObj = JSON.parse(fileData);

    // Target the "tasks" array inside your object wrapper.
    // If it doesn't exist for some reason, default to an empty array.
    return Array.isArray(dataObj.tasks) ? dataObj.tasks : [];
  } catch (error) {
    return [];
  }
};

const writeTasks = (tasksArray) => {
  // Re-wrap the tasks array into the object format before saving to file
  const dataToSave = {
    tasks: tasksArray,
  };

  fs.writeFileSync(TASKS_FILE, JSON.stringify(dataToSave, null, 2), "utf8");
};

module.exports = { readTasks, writeTasks };
