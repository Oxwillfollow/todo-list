import { Project, projectsManager, Task } from "./projects";
import uiState from "./uiState";

const interfaceManager = (function(){
    function addNewProject(name, description){
        const newProject = new Project(name, description);
        projectsManager.add(newProject);
        setActiveProject(newProject);
    }

    function addNewTask(name, dueDate, priority, notes){
        if(projectsManager.activeProject){
            const newTask = new Task(name, dueDate, priority, notes);
            projectsManager.activeProject.addTask(newTask);
            uiState.updateDOM(projectsManager);
        }
        else{
            throw new Error("TRYING TO ADD TASK WITH NO ACTIVE PROJECT");
        }
    }

    function setActiveProject(project){
        projectsManager.setActive(project);
        uiState.updateDOM(projectsManager);
    }

    function toggleTaskStatus(e, task){
        task.completed = !task.completed;

        console.log("trying to toggle task status, currentTarget=");
        console.log(e.currentTarget);
        e.currentTarget.dataset.completed = task.completed;
    }

    return{
        addNewProject,
        addNewTask,
        setActiveProject,
        toggleTaskStatus,
    }
})();

uiState.init(projectsManager, interfaceManager);

export default interfaceManager;