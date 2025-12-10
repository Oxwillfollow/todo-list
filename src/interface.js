import { Project, projectsManager } from "./projects";
import uiState from "./uiState";

function addNewProject(name, description){
    projectsManager.add(new Project(name, description));
    uiState.updateDOM(projectsManager.projects);
}

export { addNewProject };