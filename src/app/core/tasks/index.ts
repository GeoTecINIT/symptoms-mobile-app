import { Task } from './task';
import { SimpleTask } from './simple-task';

export const tasks: Tasks = {
    simpleTask: new SimpleTask(() => 'Simple task run!')
};

export interface Tasks {
    [key: string]: Task;
}
