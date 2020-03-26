import { SimpleTask } from '../core/tasks/base/simple-task';
import { toSeconds } from '../core/utils/time-converter';

import { LogTaskExecutionStart } from '../experiment/log-execution-start-task';
import { logExecutionEndTask } from '../experiment/log-execution-end-task';
import { ExperimentTask } from '../experiment/experiment-tasks';

export const appTasks = [
    new LogTaskExecutionStart(ExperimentTask.Dummy, { foreground: true }),
    new LogTaskExecutionStart(ExperimentTask.GPS, { foreground: true }),
    logExecutionEndTask,
    new SimpleTask('fastTask', async ({ log }) => log('Fast task run!')),
    new SimpleTask(
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
    new SimpleTask(
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
    new SimpleTask('printGeolocation', async ({ log, evt }) => {
        log(`Last location: ${JSON.stringify(evt.data.record)}`);
    }),
    new SimpleTask('incrementalTask', async ({ params, log, runAgainIn }) => {
        const execCount = params.execCount ? params.execCount : 1;
        const execTime = toSeconds(execCount, 'minutes');
        log(`Incremental task: Task run after ${execTime} seconds`);
        runAgainIn(toSeconds(execCount + 1, 'minutes'), {
            execCount: execCount + 1
        });
    })
];
