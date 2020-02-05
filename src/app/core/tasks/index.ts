import { Task, TaskParams } from './task';
import { SimpleTask } from './simple-task';
import { TaskPlanner } from './planner';
import { RunnableTaskBuilder } from './runnable-task';

export const tasks: Tasks = {
    fastTask: new SimpleTask('fastTask', async () =>
        console.log('Fast task run!')
    ),
    mediumTask: new SimpleTask('mediumTask', () =>
        new Promise((resolve) => setTimeout(() => resolve(), 2000)).then(() =>
            console.log('Medium task run!')
        )
    ),
    slowTask: new SimpleTask(
        'slowTask',
        () =>
            new Promise((resolve) =>
                setTimeout(() => resolve(), 30000)
            ).then(() => console.log('Slow task run!')),
        { background: false }
    )
};

export interface Tasks {
    [key: string]: Task;
}

let taskPlanner: TaskPlanner;
export function run(taskName: string, params: TaskParams = {}) {
    if (!taskPlanner) {
        taskPlanner = new TaskPlanner();
    }

    return new RunnableTaskBuilder(taskName, params, taskPlanner);
}
