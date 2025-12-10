import { Task, priorities } from './tasks';

class Project {
    constructor(name, description){
        this.name = name;
        this.description = description;
    }
    
    #tasks = [];
    
    get tasks(){
        console.log("tasks:");
        console.log(this.#tasks);
        return [...this.#tasks]; // return a copy of the array so the original can't be mutated
    }
    
    addTask(task){
        this.#tasks.push(task)
    }
    
    removeTask(task){
        this.#tasks.splice(this.#tasks.indexOf(task), 1);
    }
}

const projectsManager = (function(){
    const projects = [];

    let activeProject;
    
    const add = function(project){
        projects.push(project);
        console.log("Added new project!");
        console.log(projects);
    }
    
    const remove = function(project){
        projects.splice(projects.indexOf(project), 1);
    }

    const setActive = function(project){
        activeProject = project;
        console.log("active project set");
        console.log(activeProject);
    }
    
    return {
        get projects(){
            return [...projects] // return a copy of the array so the original can't be mutated
        },
        get activeProject(){return activeProject},
        add,
        remove,
        setActive,
    }
    
})();

export { Project, projectsManager };