const storageManager = (function(){
    function addProject(project){
        let storedArr = [];
        if(localStorage.projects !== undefined){
            storedArr = JSON.parse(localStorage.getItem("projects"));
        }
        storedArr.push(project)
        localStorage.setItem("projects", JSON.stringify(storedArr));
    }

    function editProject(editedProject){
        if(localStorage.projects !== undefined){
            let storedArr = JSON.parse(localStorage.getItem("projects"));
            let projectIndex = storedArr.findIndex(project => project.uniqueID === editedProject.uniqueID);

            storedArr[projectIndex] = editedProject; // replace with edited Project
            localStorage.setItem("projects", JSON.stringify(storedArr));
        }
    }

    function removeProject(project){
        if(localStorage.projects !== undefined){
            let storedArr = JSON.parse(localStorage.getItem("projects"));
            storedArr.splice(storedArr.indexOf(project), 1);
            localStorage.setItem("projects", JSON.stringify(storedArr));

            // also remove all tasks of that project
            if(localStorage.tasks !== undefined){
                let storedTasks = JSON.parse(localStorage.getItem("tasks"));

                if(storedTasks.length > 0){
                    let filteredTasks = storedTasks.filter(task => task.project.uniqueID !== project.uniqueID);
                    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
                }
            }
        }
    }

    function addTask(task){
        let storedArr = [];
        if(localStorage.tasks !== undefined){
            storedArr = JSON.parse(localStorage.getItem("tasks"));
        }
        storedArr.push(task)
        localStorage.setItem("tasks", JSON.stringify(storedArr));
    }

    function editTask(editedTask){
        if(localStorage.tasks !== undefined){
            let storedArr = JSON.parse(localStorage.getItem("tasks"));
            let taskIndex = storedArr.findIndex(task => task.uniqueID === editedTask.uniqueID);

            storedArr[taskIndex] = editedTask; // replace with edited Project
            localStorage.setItem("tasks", JSON.stringify(storedArr));
        }
    }

    function removeTask(task){
        if(localStorage.tasks !== undefined){
            let storedArr = JSON.parse(localStorage.getItem("tasks"));
            storedArr.splice(storedArr.indexOf(task), 1);
            localStorage.setItem("tasks", JSON.stringify(storedArr));
        }
    }

    const getDeserializedStorage = (function(){
        return{
            tasks: JSON.parse(localStorage.getItem("tasks")),
            projects: JSON.parse(localStorage.getItem("projects")),
            activeProject: JSON.parse(localStorage.getItem("activeProject")),
        }
    })();

    function saveActiveProject(project){
        localStorage.setItem("activeProject", JSON.stringify(project));
    }

    return{
        addProject,
        editProject,
        removeProject,
        addTask,
        editTask,
        removeTask,
        saveActiveProject,
        getDeserializedStorage,
    }
})();

export default storageManager;