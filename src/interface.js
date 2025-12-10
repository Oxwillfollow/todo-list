import { Project, projectsManager, Task } from "./projects";
import uiState from "./uiState";

const interfaceManager = (function(){
    function addNewProject(name, description){
        const newProject = new Project(name, description);
        projectsManager.add(newProject);
        if(!projectsManager.activeProject)
            projectsManager.setActive(newProject);

        uiState.updateDOM(projectsManager);
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

    return{
        addNewProject,
        addNewTask,
    }
})();

uiState.init(projectsManager, interfaceManager);

export default interfaceManager;