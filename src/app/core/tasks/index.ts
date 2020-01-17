import { Task } from './task';
import { SimpleTask } from './simple-task';

export interface Tasks {
    [key: string]: Task;
}

export const tasks: Tasks = {
    simpleTask: new SimpleTask(() => console.log('It works!'))
};
