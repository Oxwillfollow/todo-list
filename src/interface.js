import { compareAsc } from "date-fns";
import { Project, projectsManager, Task } from "./projects";
import uiState from "./uiState";
import storage from "./storage";

const interfaceManager = (function(){
    function addNewProject(name, description){
        const newProject = new Project(name, description);
        projectsManager.add(newProject);
        setActiveProject(newProject);
        storage.addProject(newProject);
    }

    function editProject(project, name, description){
        project.name = name;
        project.description = description;
        setActiveProject(project);
        storage.editProject(project);
    }

    function removeProject(project){ 
        projectsManager.remove(project);
        if(project === projectsManager.activeProject){
            if(projectsManager.projects.length > 0){
                projectsManager.setActive(projectsManager.projects.at(-1));
            }
            else
                projectsManager.setActive(null);
        }
        uiState.updateDOM();
        storage.removeProject(project);
    }

    function removeTask(task){
        task.project.removeTask(task);
        uiState.updateDOM();
        storage.removeTask(task);
    }

    function addNewTask(name, dueDate, dueTime, priority, notes){
        if(projectsManager.activeProject){
            const newTask = new Task(name, dueDate, dueTime, priority, notes);
            projectsManager.activeProject.addTask(newTask);
            storage.addTask(newTask);
            uiState.updateDOM();
        }
        else{
            throw new Error("TRYING TO ADD TASK WITH NO ACTIVE PROJECT");
        }
    }

    function editTask(task, name, dueDate, dueTime, priority, notes){
        task.name = name;
        task.dueDate = dueDate;
        task.dueTime = dueTime;
        task.priority = priority;
        task.notes = notes;
        task.project.sortTasks();
        storage.editTask(task);
        uiState.updateDOM();
    }

    function setActiveProject(project){
        projectsManager.setActive(project);
        storage.saveActiveProject(project);
        uiState.updateDOM();
    }

    function toggleTaskStatus(e, task){
        task.completed = !task.completed;
        e.currentTarget.dataset.completed = task.completed;
        storage.editTask(task);
    }

    function loadStorage(){
        if(storage.getDeserializedStorage.projects === null)
            return;

        if(storage.getDeserializedStorage.projects.length <= 0)
            return;

        storage.getDeserializedStorage.projects.forEach(project => {
            if(projectsManager.projects.find(p => p.uniqueID === project.uniqueID) === undefined){
                // create a new project so it inherits all the fields of the Project class (such as tasks)
                const newProject = new Project(project.name, project.description);
                newProject.uniqueID = project.uniqueID;
                projectsManager.add(newProject);

                // check if the project is saved as the active project
                if(storage.getDeserializedStorage.activeProject.uniqueID === project.uniqueID)
                    projectsManager.setActive(newProject);

                // add tasks to that project
                if(storage.getDeserializedStorage.tasks !== null){
                    if(storage.getDeserializedStorage.tasks.length > 0){
                        storage.getDeserializedStorage.tasks.forEach(task => {
                            // check if the tasks project is the same and check if its not already added
                            if(task.project.uniqueID === project.uniqueID)
                                newProject.addTask(task);
                        });
                    }
                }
            }
        });

        uiState.updateDOM();
    }

    return{
        addNewProject,
        addNewTask,
        setActiveProject,
        toggleTaskStatus,
        editProject,
        editTask,
        removeProject,
        removeTask,
        loadStorage,
        get activeProject(){return projectsManager.activeProject;},
        get projects(){return projectsManager.projects;},
    }
})();

uiState.init(interfaceManager);

export default interfaceManager;