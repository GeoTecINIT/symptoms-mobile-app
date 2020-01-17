import { Tasks, tasks as prodTasks } from '.';
import { Task } from './task';

let tasks: Tasks = prodTasks;

export function getTask(name: string): Task {
    checkIfTaskExists(name);

    return tasks[name];
}

export function checkIfTaskExists(name: string) {
    const task = tasks[name];
    if (!task) {
        throw new TaskNotFoundError(name);
    }
}

export function setTasks(t: Tasks) {
    tasks = t;
}

export class TaskNotFoundError extends Error {
    constructor(name: string) {
        super(`Task not found: ${name}`);
    }
}
