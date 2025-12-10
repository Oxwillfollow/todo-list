import { addNewProject } from "./interface";

const uiStateManager = (function(){
    const cacheDOM = (function(){
        const projectsContainer = document.getElementById("projects-container");
        const newProjectBtn = document.getElementById("new-project-btn");
        const projectDialog = document.getElementById("project-dialog");
        const taskDialog = document.getElementById("task-dialog");
        const projectNameInput = document.getElementById("project-name");
        const projectDescriptionInput = document.getElementById("project-description");
        const saveProjectBtn = document.getElementById("save-project-btn");

        return{
            projectsContainer,
            newProjectBtn,
            projectDialog,
            taskDialog,
            projectNameInput,
            projectDescriptionInput,
            saveProjectBtn,
        }
    })();
    
    function bindEvents(){
        cacheDOM.newProjectBtn.addEventListener('click', openProjectDialog);
        cacheDOM.saveProjectBtn.addEventListener('click', saveProject);
        cacheDOM.projectDialog.addEventListener('close', closeProjectDialog);
    }

    function saveProject(e){
        e.preventDefault();
        addNewProject(cacheDOM.projectNameInput.value, cacheDOM.projectDescriptionInput.value);
        clearProjectDialogInput();
        cacheDOM.projectDialog.close();
    }

    function closeProjectDialog(){
        clearProjectDialogInput();
        cacheDOM.projectDialog.close();
    }

    function clearProjectDialogInput(){
        cacheDOM.projectNameInput.value = "";
        cacheDOM.projectDescriptionInput.value = "";
    }
    
    function init(){
        bindEvents();
    }
    
    function openProjectDialog(e){
        if(e.currentTarget === cacheDOM.newProjectBtn){
            // new project
            cacheDOM.projectDialog.showModal();
        }
    }
    
    const updateDOM = function(projects){
        clearProjectsDOM();

        projects.forEach(project => {
            createProjectDOM(project);
        });
    }

    function createProjectDOM(project){
        console.log("creating project DOM");
        const projectContainer = document.createElement("div");
        projectContainer.classList.add("project-container");
        const projectHeader = document.createElement("h2");
        projectHeader.classList.add("project-header");
        projectHeader.textContent = project.name;
        const projectTasksContainer = document.createElement("div");
        projectTasksContainer.classList.add("project-tasks-container");
       
        // display project tasks
        if(project.tasks.length > 0){
            for (let index = 0; index <= 3; index++) {
                const projectTaskHeader = document.createElement("h3");
                projectTaskHeader.classList.add("project-task-header");

                if(!!project.tasks[index]){
                    if(index > 2){
                        projectTaskHeader.textContent = "...";
                        projectTasksContainer.appendChild(projectTaskHeader);
                        break;
                    }
                    else{
                        projectTaskHeader.textContent = `${project.tasks[index].name}`;
                        projectTasksContainer.appendChild(projectTaskHeader);
                    }
                }
                else{
                    break;
                }
            }
        }

        projectContainer.append(projectHeader, projectTasksContainer);
        cacheDOM.projectsContainer.appendChild(projectContainer);
    }

    function clearProjectsDOM(){
        while(cacheDOM.projectsContainer.firstChild){
            cacheDOM.projectsContainer.removeChild(cacheDOM.projectsContainer.firstChild);
        }
    }
    
    init();
    
    return{
        updateDOM,
    }
})();

export default uiStateManager;