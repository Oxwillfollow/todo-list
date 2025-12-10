import { addNewProject } from "./interface";

const uiStateManager = (function(){
    const cacheDOM = (function(){
        // sidebar
        const projectsContainer = document.getElementById("projects-container");
        const newProjectBtn = document.getElementById("new-project-btn");
        // dialogs
        const projectDialog = document.getElementById("project-dialog");
        const projectNameInput = document.getElementById("project-name");
        const projectDescriptionInput = document.getElementById("project-description");
        const saveProjectBtn = document.getElementById("save-project-btn");
        const taskDialog = document.getElementById("task-dialog");
        // main
        const activeProjectContainer = document.getElementById("active-project-container");

        return{
            sidebar: {
                projectsContainer,
                newProjectBtn,
            },
            dialogs: {
                projectDialog,
                projectNameInput,
                projectDescriptionInput,
                saveProjectBtn,
                taskDialog,
            },
            main: {
                activeProjectContainer,
            },
        }
    })();
    
    function bindEvents(){
        cacheDOM.sidebar.newProjectBtn.addEventListener('click', openProjectDialog);
        cacheDOM.dialogs.saveProjectBtn.addEventListener('click', saveProject);
        cacheDOM.dialogs.projectDialog.addEventListener('close', closeProjectDialog);
    }

    function saveProject(e){
        e.preventDefault();
        addNewProject(cacheDOM.dialogs.projectNameInput.value, cacheDOM.dialogs.projectDescriptionInput.value);
        clearProjectDialogInput();
        cacheDOM.dialogs.projectDialog.close();
    }

    function closeProjectDialog(){
        clearProjectDialogInput();
        cacheDOM.dialogs.projectDialog.close();
    }

    function clearProjectDialogInput(){
        cacheDOM.dialogs.projectNameInput.value = "";
        cacheDOM.dialogs.projectDescriptionInput.value = "";
    }
    
    function init(){
        bindEvents();
    }
    
    function openProjectDialog(e){
        if(e.currentTarget === cacheDOM.sidebar.newProjectBtn){
            // new project
            cacheDOM.dialogs.projectDialog.showModal();
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
        cacheDOM.sidebar.projectsContainer.appendChild(projectContainer);
    }

    function clearProjectsDOM(){
        while(cacheDOM.sidebar.projectsContainer.firstChild){
            cacheDOM.sidebar.projectsContainer.removeChild(cacheDOM.sidebar.projectsContainer.firstChild);
        }
    }
    
    init();
    
    return{
        updateDOM,
    }
})();

export default uiStateManager;