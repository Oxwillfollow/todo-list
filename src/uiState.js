import { format, isSameDay } from "date-fns";
import checkmarkImg from "./checkmark.svg"
import fileEditImg from "./file-edit.svg"

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
        cacheDOM.sidebar.newProjectBtn.addEventListener('click', () => openProjectDialog(null));
        cacheDOM.dialogs.projectDialog.addEventListener('submit', saveProject);
        cacheDOM.dialogs.projectDialog.addEventListener('close', closeProjectDialog);

        cacheDOM.main.newBtn.addEventListener('click', newButtonClicked);
        cacheDOM.dialogs.taskDialog.addEventListener('submit', saveTask);
        cacheDOM.dialogs.taskDialog.addEventListener('close', closeTaskDialog);
    }

    function saveProject(e){
        e.preventDefault();

        if(cacheDOM.dialogs.projectDialog.value){
            // edit project
            interfaceManager.editProject(cacheDOM.dialogs.projectDialog.value,
            cacheDOM.dialogs.projectNameInput.value,
            cacheDOM.dialogs.projectDescriptionInput.value);
            cacheDOM.dialogs.projectDialog.value = "";
        }
        else{
            // new project
            interfaceManager.addNewProject(
            cacheDOM.dialogs.projectNameInput.value,
            cacheDOM.dialogs.projectDescriptionInput.value);
        }
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

    function openProjectDialog(project){
        if(project === null){
            // new project
            cacheDOM.dialogs.projectDialog.showModal();
        }
        else{
            // edit project
            editProject(project);
        }
    }
    function closeProjectDialog(){
        clearProjectDialogInput();
        cacheDOM.dialogs.projectDialog.close();
    }
    function clearProjectDialogInput(){
        cacheDOM.dialogs.projectDialog.value = undefined;
        cacheDOM.dialogs.projectNameInput.value = "";
        cacheDOM.dialogs.projectDescriptionInput.value = "";
    }

    function editProject(project){
        cacheDOM.dialogs.projectNameInput.value = project.name;
        cacheDOM.dialogs.projectDescriptionInput.value = project.description;

        cacheDOM.dialogs.projectDialog.showModal();
        cacheDOM.dialogs.projectDialog.value = project;
    }

    function newButtonClicked(e){
        if(e.currentTarget.dataset.purpose === "project")
            openProjectDialog(null);
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
    
    const updateDOM = function(){
        clearProjectsDOM();
        clearTasksDOM();

        // display projects
        if(interfaceManager.projects.length > 0){
            interfaceManager.projects.forEach(project => {
                createProjectDOM(project);
            });
        }

        // display active project
        updateActiveProjectDOM(interfaceManager.activeProject);
        
        // display tasks by date
        let lastTask;
        let lastTaskDateContainer;

        if(interfaceManager.activeProject){
            interfaceManager.activeProject.tasks.forEach(task => {
                lastTaskDateContainer = createTaskDOM(task, lastTask, lastTaskDateContainer);
                lastTask = task;
            });
        }
    }

    function createProjectDOM(project){
        const projectContainer = document.createElement("div");
        projectContainer.classList.add("project-container");
        const projectHeaderContainer = document.createElement("div");
        projectHeaderContainer.classList.add("project-header-container");
        const projectHeader = document.createElement("h2");
        projectHeader.classList.add("project-header");
        const projectHeaderLink = document.createElement("a");
        projectHeaderLink.href = `#${project.name}`;
        projectHeaderLink.textContent = project.name;

        console.log(interfaceManager.activeProject);

        if(interfaceManager.activeProject === project)
            projectHeaderLink.dataset.active = "true";
        else
            projectHeaderLink.dataset.active = "false";

        projectHeaderLink.addEventListener("click", () => interfaceManager.setActiveProject(project));
        projectHeader.appendChild(projectHeaderLink);
        
        // edit button
        const projectEditBtn = document.createElement("button");
        projectEditBtn.classList.add("project-edit-btn");
        projectEditBtn.addEventListener("click", () => openProjectDialog(project));
        const projectEditImg = document.createElement("img");
        projectEditImg.src = fileEditImg;
        projectEditBtn.appendChild(projectEditImg);
        projectHeaderContainer.append(projectHeader, projectEditBtn);
       
        // display project tasks
        const projectTasksContainer = document.createElement("div");
        projectTasksContainer.classList.add("project-tasks-container");

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

        projectContainer.append(projectHeaderContainer, projectTasksContainer);
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

    function createTaskDOM(task, lastTask, lastTaskDateContainer){
        const taskDateContainer = createTaskDateContainer(task, lastTask, lastTaskDateContainer);

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
        taskDateContainer.appendChild(taskContainer);
        cacheDOM.main.activeProjectTasksContainer.appendChild(taskDateContainer);

        return taskDateContainer;
    }

    function createTaskDateContainer(task, lastTask, lastTaskDateContainer){
        // if last task doesn't exist or if the task isn't the same day as last task, create new container
        // else, use the same container
        if(!lastTask || !isSameDay(task.dueDate, lastTask.dueDate)){
            const taskDateContainer = document.createElement("div");
            taskDateContainer.classList.add("active-project-task-date-container");
            const taskDateHeader = document.createElement("h3");
            taskDateHeader.classList.add("active-project-task-date-header");
            taskDateHeader.textContent = format(task.dueDate, "EEEE, dd-MM-yyyy");
            taskDateContainer.appendChild(taskDateHeader);

            return taskDateContainer;
        }
        else{
            return lastTaskDateContainer;
        }
    }

    const init = function(interfaceMng){
        interfaceManager = interfaceMng;
        bindEvents();
        updateDOM();
    }
    
    return{
        updateDOM,
        init,
    }
})();

export default uiStateManager;