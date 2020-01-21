import { Task } from './task';
import { SimpleTask } from './simple-task';

export const tasks: Tasks = {
    fastTask: new SimpleTask(async () => console.log('Fast task run!')),
    mediumTask: new SimpleTask(
        () =>
            new Promise((resolve) => setTimeout(() => resolve(), 2000)).then(() =>
                console.log('Medium task run!')
            ),
        true,
        3000
    ),
    slowTask: new SimpleTask(
        () =>
            new Promise((resolve) =>
                setTimeout(() => resolve(), 30000)
            ).then(() => console.log('Slow task run!')),
        true,
        31000
    )
};

export interface Tasks {
    [key: string]: Task;
}
