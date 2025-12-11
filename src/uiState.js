import { compareAsc, format } from "date-fns";
import checkmarkImg from "./checkmark.svg"

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
        const taskNameInput = document.getElementById("task-name");
        const taskDueDateInput = document.getElementById("task-dueDate");
        const taskNotesInput = document.getElementById("task-notes");
        const taskPriorityInput = document.getElementById("task-priority");
        const saveTaskBtn = document.getElementById("save-task-btn");
        // main
        const activeProjectContainer = document.getElementById("active-project-container");
        const activeProjectTasksContainer = document.getElementById("active-project-tasks-container");
        const activeProjectHeader = document.getElementById("active-project-header");
        const activeProjectDescription = document.getElementById("active-project-description");
        const newBtn = document.getElementById("new-btn");

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
                taskNameInput,
                taskDueDateInput,
                taskNotesInput,
                taskPriorityInput,
                saveTaskBtn,
            },
            main: {
                activeProjectContainer,
                activeProjectTasksContainer,
                activeProjectHeader,
                activeProjectDescription,
                newBtn,
            },
        }
    })();

    let interfaceManager;
    
    function bindEvents(){
        cacheDOM.sidebar.newProjectBtn.addEventListener('click', openProjectDialog);
        cacheDOM.dialogs.projectDialog.addEventListener('submit', saveProject);
        cacheDOM.dialogs.projectDialog.addEventListener('close', closeProjectDialog);

        cacheDOM.main.newBtn.addEventListener('click', newButtonClicked);
        cacheDOM.dialogs.taskDialog.addEventListener('submit', saveTask);
        cacheDOM.dialogs.taskDialog.addEventListener('close', closeTaskDialog);
    }

    function saveProject(e){
        e.preventDefault();
        interfaceManager.addNewProject(
            cacheDOM.dialogs.projectNameInput.value,
            cacheDOM.dialogs.projectDescriptionInput.value);

        clearProjectDialogInput();
        cacheDOM.dialogs.projectDialog.close();
    }

    function saveTask(e){
        e.preventDefault();
        interfaceManager.addNewTask(cacheDOM.dialogs.taskNameInput.value,
            cacheDOM.dialogs.taskDueDateInput.value,
            cacheDOM.dialogs.taskPriorityInput.value,
            cacheDOM.dialogs.taskNotesInput.value,
        );

        clearProjectDialogInput();
        cacheDOM.dialogs.taskDialog.close();
    }

    function openProjectDialog(e){
        if(e.currentTarget === cacheDOM.sidebar.newProjectBtn || e.currentTarget === cacheDOM.main.newBtn){
            // new project
            cacheDOM.dialogs.projectDialog.showModal();
        }
    }
    function closeProjectDialog(){
        clearProjectDialogInput();
        cacheDOM.dialogs.projectDialog.close();
    }
    function clearProjectDialogInput(){
        cacheDOM.dialogs.projectNameInput.value = "";
        cacheDOM.dialogs.projectDescriptionInput.value = "";
    }

    function newButtonClicked(e){
        if(e.currentTarget.dataset.purpose === "project")
            openProjectDialog(e);
        else
            openTaskDialog(e);
    }
    
    function openTaskDialog(e){
        if(e.currentTarget === cacheDOM.main.newBtn){
            // new task
            cacheDOM.dialogs.taskDialog.showModal();
        }
    }
    function closeTaskDialog(){
        clearTaskDialogInput();
        cacheDOM.dialogs.taskDialog.close();
    }
    function clearTaskDialogInput(){
        cacheDOM.dialogs.taskNameInput.value = "";
        cacheDOM.dialogs.taskDueDateInput.value = "";
        cacheDOM.dialogs.taskNotesInput.value = "";
        cacheDOM.dialogs.taskPriorityInput.value = "";
    }
    
    const updateDOM = function(projectsManager){
        clearProjectsDOM();
        clearTasksDOM();

        // display projects
        if(projectsManager.projects.length > 0){
            projectsManager.projects.forEach(project => {
                createProjectDOM(project);
            });
        }

        // display active project + tasks
        updateActiveProjectDOM(projectsManager.activeProject);

        if(projectsManager.activeProject){
            projectsManager.activeProject.tasks.forEach(task => {
                createTaskDOM(task);
            });
        }
    }

    function createProjectDOM(project){
        const projectContainer = document.createElement("div");
        projectContainer.classList.add("project-container");
        const projectHeader = document.createElement("h2");
        projectHeader.classList.add("project-header");
        const projectHeaderLink = document.createElement("a");
        projectHeaderLink.href = `#${project.name}`;
        projectHeaderLink.textContent = project.name;
        projectHeaderLink.addEventListener("click", () => interfaceManager.setActiveProject(project));
        projectHeader.appendChild(projectHeaderLink);
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
                        projectTaskHeader.textContent = `#${project.tasks[index].name}`;
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
        while(cacheDOM.main.activeProjectTasksContainer.firstChild){
            cacheDOM.main.activeProjectTasksContainer.removeChild(cacheDOM.main.activeProjectTasksContainer.firstChild);
        }
    }

    function updateActiveProjectDOM(project){
        if(!project){
            cacheDOM.main.activeProjectHeader.textContent = "No Active Project";
            cacheDOM.main.activeProjectDescription.textContent = "";
            cacheDOM.main.newBtn.textContent = "New Project";
            cacheDOM.main.newBtn.dataset.purpose = "project";
        }
        else{
            cacheDOM.main.activeProjectHeader.textContent = project.name;
            cacheDOM.main.activeProjectDescription.textContent = project.description;
            cacheDOM.main.newBtn.textContent = "New Task";
            cacheDOM.main.newBtn.dataset.purpose = "task";
        }  
    }

    function createTaskDOM(task){
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("active-project-task-container")
        const taskCheckbox = document.createElement("div");
        taskCheckbox.classList.add("active-project-task-checkbox");
        taskCheckbox.dataset.priority = task.priority.toString();
        taskCheckbox.dataset.completed = task.completed.toString();
        taskCheckbox.addEventListener("click", (e) => interfaceManager.toggleTaskStatus(e, task));
        const taskCheckmark = document.createElement("img")
        taskCheckmark.src = checkmarkImg;
        taskCheckmark.alt = "checkmark";
        taskCheckmark.classList.add("active-project-task-checkmark");
        const taskHeader = document.createElement("h3");
        taskHeader.classList.add("active-project-task-header");
        taskHeader.textContent = task.name;
        const taskDueDatePara = document.createElement("p");
        taskDueDatePara.classList.add("active-project-task-dueDate");
        taskDueDatePara.textContent = format(task.dueDate, "hh:mm aa");

        taskCheckbox.appendChild(taskCheckmark);
        taskContainer.append(taskCheckbox, taskHeader, taskDueDatePara);
        cacheDOM.main.activeProjectTasksContainer.appendChild(taskContainer);
    }

    const init = function(projectsManager, interfaceMng){
        interfaceManager = interfaceMng;
        bindEvents();
        updateDOM(projectsManager);
    }
    
    return{
        updateDOM,
        init,
    }
})();

export default uiStateManager;