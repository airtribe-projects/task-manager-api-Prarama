const fs = require("fs");
const path = require("path");

const TASKS_FILE = path.join(__dirname, "../data/task.json");

const readTasks = () => {
  let fileData;

  try {
    fileData = fs.readFileSync(TASKS_FILE, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  if (!fileData.trim()) {
    return [];
  }

  let dataObj;
  try {
    dataObj = JSON.parse(fileData);
  } catch (error) {
    throw new Error(`Invalid task data file: ${error.message}`);
  }

  // Target the "tasks" array inside your object wrapper.
  // If it doesn't exist for some reason, default to an empty array.
  return Array.isArray(dataObj.tasks) ? dataObj.tasks : [];
};

const writeTasks = (tasksArray) => {
  // Re-wrap the tasks array into the object format before saving to file
  const dataToSave = {
    tasks: tasksArray,
  };

  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(dataToSave, null, 2), "utf8");
  } catch (error) {
    throw new Error(`Failed to write task data: ${error.message}`);
  }
};

module.exports = { readTasks, writeTasks };
