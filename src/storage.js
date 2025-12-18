const storageManager = (function () {
  const getDeserialized = (function () {
    return {
      get tasks() {
        return localStorage.tasks
          ? JSON.parse(localStorage.getItem("tasks"))
          : [];
      },
      get projects() {
        return localStorage.projects
          ? JSON.parse(localStorage.getItem("projects"))
          : [];
      },
      get activeProjectID() {
        return localStorage.activeProjectID
          ? JSON.parse(localStorage.getItem("activeProjectID"))
          : null;
      },
    };
  })();

  function addProject(project) {
    let storedArr = getDeserialized.projects;
    storedArr.push(project);
    localStorage.setItem("projects", JSON.stringify(storedArr));
  }

  function editProject(editedProject) {
    let storedArr = getDeserialized.projects;
    let projectIndex = storedArr.findIndex(
      (project) => project.uniqueID === editedProject.uniqueID
    );

    storedArr[projectIndex] = editedProject; // replace with edited Project
    localStorage.setItem("projects", JSON.stringify(storedArr));
  }

  function removeProject(project) {
    let storedArr = getDeserialized.projects;
    storedArr.splice(
      storedArr.findIndex((p) => p.uniqueID === project.uniqueID),
      1
    );
    localStorage.setItem("projects", JSON.stringify(storedArr));

    // also remove all tasks of that project
    if (localStorage.tasks !== undefined) {
      let storedTasks = getDeserialized.tasks;

      if (storedTasks.length > 0) {
        let filteredTasks = storedTasks.filter(
          (task) => task.project.uniqueID !== project.uniqueID
        );
        localStorage.setItem("tasks", JSON.stringify(filteredTasks));
      }
    }

    // if project was active and remove it from active
    if (getDeserialized.activeProjectID === project.uniqueID)
      localStorage.removeItem("activeProjectID");
  }

  function addTask(task) {
    let storedArr = getDeserialized.tasks;
    storedArr.push(task);
    localStorage.setItem("tasks", JSON.stringify(storedArr));
  }

  function editTask(editedTask) {
    let storedArr = getDeserialized.tasks;
    let taskIndex = storedArr.findIndex(
      (task) => task.uniqueID === editedTask.uniqueID
    );

    storedArr[taskIndex] = editedTask; // replace with edited Project
    localStorage.setItem("tasks", JSON.stringify(storedArr));
  }

  function removeTask(task) {
    let storedArr = getDeserialized.tasks;
    storedArr.splice(storedArr.indexOf(task), 1);
    localStorage.setItem("tasks", JSON.stringify(storedArr));
  }

  function saveActiveProjectID(project) {
    localStorage.setItem("activeProjectID", JSON.stringify(project.uniqueID));
  }

  return {
    addProject,
    editProject,
    removeProject,
    addTask,
    editTask,
    removeTask,
    saveActiveProjectID,
    getDeserialized,
  };
})();

export default storageManager;
