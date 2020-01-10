import { Tasks, Task, tasks as prodTasks } from '.';

let tasks: Tasks = prodTasks;

export function getTask(name: string): Task {
    const task = tasks[name];
    if (!task) {
        throw new TaskNotFoundError(name);
    }

    return task;
}

export function setTasks(t: Tasks) {
    tasks = t;
}

export class TaskNotFoundError extends Error {
    constructor(name: string) {
        super(`Task not found: ${name}`);
    }
}
