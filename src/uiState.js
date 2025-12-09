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
            closeProjectDialogBtn,
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
        updateDOM();
    }
    
    function openProjectDialog(e){
        if(e.currentTarget === cacheDOM.newProjectBtn){
            // new project
            cacheDOM.projectDialog.showModal();
        }
    }
    
    const updateDOM = function(){
        
    }
    
    init();
    
    return{
        updateDOM,
    }
})();

export default uiStateManager;