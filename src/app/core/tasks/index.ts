import { Task, TaskParams } from './task';
import { SimpleTask } from './base/simple-task';
import { TaskPlanner } from './planner';
import { RunnableTaskBuilder } from './runnable-task';
import { ProviderTask } from './base/provider-task';
import { GeolocationProvider } from '../providers/geolocation';

export const tasks: Tasks = {
    fastTask: new SimpleTask('fastTask', async () =>
        console.log('Fast task run!')
    ),
    mediumTask: new SimpleTask(
        'mediumTask',
        (done, params, evt, onCancel) =>
            new Promise((resolve) => {
                const timeoutId = setTimeout(() => {
                    console.log('Medium task run!');
                    resolve();
                }, 2000);
                onCancel(() => {
                    clearTimeout(timeoutId);
                    resolve();
                });
            })
    ),
    slowTask: new SimpleTask(
        'slowTask',
        (done, params, evt, onCancel) =>
            new Promise((resolve) => {
                const timeoutId = setTimeout(() => {
                    console.log('Slow task run!');
                    resolve();
                }, 30000);
                onCancel(() => {
                    clearTimeout(timeoutId);
                    resolve();
                });
            }),
        { foreground: true }
    ),
    acquireGeolocation: new ProviderTask(
        'acquireGeolocation',
        new GeolocationProvider(),
        { foreground: true }
    ),
    printGeolocation: new SimpleTask(
        'printGeolocation',
        async (done, params, evt) => {
            console.log(
                `Last location acquire: ${JSON.stringify(evt.data.record)}`
            );
        }
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
