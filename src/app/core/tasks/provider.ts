import { Tasks, tasks as prodTasks } from '.';
import { Task } from './task';

let _tasks: Tasks;

export function getTask(name: string): Task {
    checkIfTaskExists(name);
    const tasks = getTasks();

    return tasks[name];
}

export function checkIfTaskExists(name: string) {
    const tasks = getTasks();
    const task = tasks[name];
    if (!task) {
        throw new TaskNotFoundError(name);
    }
}

export function registerTasks(newTasks: Array<Task>) {
    const tasks = getTasks();
    for (const task of newTasks) {
        if (tasks[task.name]) {
            throw new Error(
                `Task (${task.name}) name collides with an existing task.
                Cannot guarantee the correct operation of the system, aborting`
            );
        }
        tasks[task.name] = task;
    }
}

export function setTasks(t: Tasks) {
    _tasks = t;
}

export class TaskNotFoundError extends Error {
    constructor(name: string) {
        super(`Task not found: ${name}`);
    }
}

function getTasks() {
    if (!_tasks) {
        _tasks = prodTasks;
    }

    return _tasks;
}
