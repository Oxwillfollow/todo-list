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
        const activeProjectHeader = document.getElementById("active-project-header");
        const activeProjectDescription = document.getElementById("active-project-description");
        const newTaskBtn = document.getElementById("new-task-btn");

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
                activeProjectHeader,
                activeProjectDescription,
                newTaskBtn,
            },
        }
    })();

    let interfaceManager;
    
    function bindEvents(){
        cacheDOM.sidebar.newProjectBtn.addEventListener('click', openProjectDialog);
        cacheDOM.dialogs.projectDialog.addEventListener('submit', saveProject);
        cacheDOM.dialogs.projectDialog.addEventListener('close', closeProjectDialog);
    }

    function saveProject(e){
        e.preventDefault();
        interfaceManager.addNewProject(cacheDOM.dialogs.projectNameInput.value, cacheDOM.dialogs.projectDescriptionInput.value);
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
    
    function openProjectDialog(e){
        if(e.currentTarget === cacheDOM.sidebar.newProjectBtn){
            // new project
            cacheDOM.dialogs.projectDialog.showModal();
        }
    }
    
    const updateDOM = function(projectsManager){
        clearProjectsDOM();

        if(projectsManager.projects.length > 0){
            projectsManager.projects.forEach(project => {
                createProjectDOM(project);
            });
        }

        updateActiveProjectDOM(projectsManager.activeProject);
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

    function clearTasksDOM(){
        //
    }

    function updateActiveProjectDOM(project){
        if(!project){
            cacheDOM.main.activeProjectHeader.textContent = "No Active Project";
            cacheDOM.main.activeProjectDescription.textContent = "";
            cacheDOM.main.newTaskBtn.textContent = "New Project";
        }
        else{
            cacheDOM.main.activeProjectHeader.textContent = project.name;
            cacheDOM.main.activeProjectDescription.textContent = project.description;
            cacheDOM.main.newTaskBtn.textContent = "New Task";
        }  
    }

    function createTaskDOM(task){

    }

    const init = function(projectsManager, interfaceMng){
        bindEvents();
        updateDOM(projectsManager);
        interfaceManager = interfaceMng;
    }
    
    return{
        updateDOM,
        init,
    }
})();

export default uiStateManager;