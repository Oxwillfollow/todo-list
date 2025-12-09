import './styles.css';

class Project {
    constructor(name, description){
        this.name = name;
        this.description = description;
    }

    #tasks = [];

    get tasks(){
        return [...this.#tasks]; // return a copy of the array so the original can't be mutated
    }

    addTask(task){
        this.#tasks.push(task)
    }

    removeTask(task){
        this.#tasks.splice(this.#tasks.indexOf(task), 1);
    }
}

const priorities = {
    low: 0,
    mid: 1,
    high: 2,
}

class Task {
    constructor(name, dueDate, priority, notes){
        this.name = name;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
    }
}

const projectsManager = (function(){
    const projects = [];

    const add = function(project){
        projects.push(project);
    }

    const remove = function(project){
        projects.splice(projects.indexOf(project), 1);
    }

    console.log("I'm from projectsManager!!!");

    return {
        get projects(){
            return [...projects] // return a copy of the array so the original can't be mutated
        },
        add,
        remove,
    }

})();

const uiStateManager = (function(){
    function cacheDOM(){

    }

    function init(){
        cacheDOM();
        updateDOM();
    }

    const updateDOM = function(){

    }

    init();

    return {
        updateDOM,
    }
})();

// window.projectsManager = projectsManager;
// window.Project = Project;
// window.Task = Task;
