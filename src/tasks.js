class Task {
    constructor(name, dueDate, dueTime, priority, notes){
        this.name = name;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.priority = priority;
        this.notes = notes;
        this.completed = false;
        this.uniqueID = crypto.randomUUID(); // unique ID used for storage purposes
    }

    project;
}

export { Task };