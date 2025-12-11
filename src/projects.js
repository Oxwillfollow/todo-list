import { Task, priorities } from './tasks';

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

        // sort tasks upon addition
        this.#tasks.sort((taskA, taskB) => {
            return new Date(taskA.dueDate) - new Date(taskB.dueDate);
        });
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
    }
    
    const remove = function(project){
        projects.splice(projects.indexOf(project), 1);
    }

    const setActive = function(project){
        activeProject = project;
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

export { Project, projectsManager, Task };