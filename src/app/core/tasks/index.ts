import { Task, TaskParams } from './task';
import { SimpleTask } from './base/simple-task';
import { TaskPlanner } from './planner';
import { RunnableTaskBuilder } from './runnable-task';
import { ProviderTask } from './base/provider-task';
import { GeolocationProvider } from '../providers/geolocation';
import { toSeconds } from '../utils/time-converter';

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
    ),
    incrementalTask: new SimpleTask(
        'incrementalTask',
        async (done, params, evt, onCancel, runAgainIn) => {
            const execCount = params.execCount ? params.execCount : 1;
            const execTime = toSeconds(execCount, 'minutes');
            console.log(`Incremental task: Task run after ${execTime} seconds`);
            runAgainIn(toSeconds(execCount + 1, 'minutes'), {
                execCount: execCount + 1
            });
        }
    )
};

export interface Tasks {
    [key: string]: Task;
}

const taskPlanner = new TaskPlanner();
export function run(taskName: string, params: TaskParams = {}) {
    return new RunnableTaskBuilder(taskName, params, taskPlanner);
}
