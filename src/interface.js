import { compareAsc } from "date-fns";
import { Project, projectsManager, Task } from "./projects";
import uiState from "./uiState";

const interfaceManager = (function(){
    function addNewProject(name, description){
        const newProject = new Project(name, description);
        projectsManager.add(newProject);
        setActiveProject(newProject);
    }

    function editProject(project, name, description){
        project.name = name;
        project.description = description;
        setActiveProject(project);
    }

    function addNewTask(name, dueDate, priority, notes){
        if(projectsManager.activeProject){
            const newTask = new Task(name, dueDate, priority, notes);
            projectsManager.activeProject.addTask(newTask);
            uiState.updateDOM();
        }
        else{
            throw new Error("TRYING TO ADD TASK WITH NO ACTIVE PROJECT");
        }
    }

    function editTask(task, name, dueDate, priority, notes){
        task.name = name;
        task.dueDate = dueDate;
        task.priority = priority;
        task.notes = notes;
        task.project.sortTasks();
        uiState.updateDOM();
    }

    function setActiveProject(project){
        projectsManager.setActive(project);
        uiState.updateDOM();
    }

    function toggleTaskStatus(e, task){
        task.completed = !task.completed;
        e.currentTarget.dataset.completed = task.completed;
    }

    return{
        addNewProject,
        addNewTask,
        setActiveProject,
        toggleTaskStatus,
        editProject,
        editTask,
        get activeProject(){return projectsManager.activeProject;},
        get projects(){return projectsManager.projects;},
    }
})();

uiState.init(interfaceManager);

export default interfaceManager;