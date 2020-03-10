import { Task, TaskParams, setTaskDeferrer } from './task';
import { SimpleTask } from './base/simple-task';

import { ProviderTask } from './base/provider-task';
import { GeolocationProvider } from '../providers/geolocation';
import { toSeconds } from '../utils/time-converter';

import { TaskPlanner } from './planner';
import { RunnableTaskBuilder } from './runnable-task';

export const tasks: Tasks = {
    fastTask: new SimpleTask('fastTask', async ({ log }) =>
        log('Fast task run!')
    ),
    mediumTask: new SimpleTask(
        'mediumTask',
        ({ log, onCancel }) =>
            new Promise((resolve) => {
                const timeoutId = setTimeout(() => {
                    log('Medium task run!');
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
        ({ log, onCancel }) =>
            new Promise((resolve) => {
                const timeoutId = setTimeout(() => {
                    log('Slow task run!');
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
        async ({ log, evt }) => {
            log(`Last location: ${JSON.stringify(evt.data.record)}`);
        }
    ),
    incrementalTask: new SimpleTask(
        'incrementalTask',
        async ({ params, log, runAgainIn }) => {
            const execCount = params.execCount ? params.execCount : 1;
            const execTime = toSeconds(execCount, 'minutes');
            log(`Incremental task: Task run after ${execTime} seconds`);
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

setTaskDeferrer((taskName, seconds, params) =>
    run(taskName, params)
        .in(seconds)
        .plan()
);
