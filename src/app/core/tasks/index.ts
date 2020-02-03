import { Task, TaskParams } from './task';
import { SimpleTask } from './simple-task';
import { TaskPlanner } from './planner';
import { RunnableTaskBuilder } from './runnable-task';

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
        false,
        31000
    )
};

export interface Tasks {
    [key: string]: Task;
}

const taskPlanner = new TaskPlanner(null, null, null);

export function run(taskName: string, params: TaskParams = {}) {
    return new RunnableTaskBuilder(taskName, params, taskPlanner);
}
