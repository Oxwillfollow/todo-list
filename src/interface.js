import { Project, projectsManager } from "./projects";
import uiState from "./uiState";

function addNewProject(name, description){
    const newProject = new Project(name, description);
    projectsManager.add(newProject);
    if(!projectsManager.activeProject)
        projectsManager.setActive(newProject);
    
    uiState.updateDOM(projectsManager);
}

export { addNewProject };