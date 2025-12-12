class Task {
    constructor(name, dueDate, dueTime, priority, notes){
        this.name = name;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.priority = priority;
        this.notes = notes;
        this.completed = false;
    }

    project;
}

const priorities = {
    low: 0,
    medium: 1,
    high: 2,
}

export { Task, priorities };