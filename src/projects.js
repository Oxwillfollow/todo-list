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
        this.sortTasks();
        task.project = this;
    }

    sortTasks(){
        this.#tasks.sort((taskA, taskB) => {
            // add date + time, then sort
            let dateAndTimeA = `${taskA.dueDate}T${taskA.dueTime}`;
            let dateAndTimeB = `${taskB.dueDate}T${taskB.dueTime}`;

            // if no time selected, move it to the last slot of the day
            if(!taskA.dueTime)
                dateAndTimeA += "23:59:59";
            if(!taskB.dueTime)
                dateAndTimeB += "23:59:59";
            
            return new Date(dateAndTimeA) - new Date(dateAndTimeB);
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