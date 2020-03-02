import { Tasks } from '~/app/core/tasks';
import { SimpleTask } from '~/app/core/tasks/base/simple-task';
import { TaskCancelManager } from '~/app/core/tasks/cancel-manager';
import { PlannedTask } from '~/app/core/tasks/planner/planned-task';

export const testTasks: Tasks = {
    dummyTask: new SimpleTask('dummyTask', async ({ log }) =>
        log('Dummy Task executed!')
    ),
    dummyForegroundTask: new SimpleTask(
        'dummyForegroundTask',
        async ({ log }) => log('Dummy Foreground Task executed!'),
        { foreground: true }
    ),
    failedTask: new SimpleTask('failedTask', () => {
        throw new Error('BOOOOM!');
    }),
    timeoutTask: new SimpleTask(
        'timeoutTask',
        ({ log, onCancel }) =>
            new Promise((resolve) => {
                const timeoutId = setTimeout(() => {
                    log('Timeout task run!');
                    resolve();
                }, 2000);
                onCancel(() => {
                    clearTimeout(timeoutId);
                    resolve();
                });
            })
    ),
    emitterTask: new SimpleTask('emitterTask', async ({ done }) =>
        done('patataCooked', { status: 'slightlyBaked' })
    )
};

export function createTaskCancelManagerMock(): TaskCancelManager {
    const cancelManager = {
        init() {
            return Promise.resolve();
        },
        add(plannedTask: PlannedTask) {
            return null;
        }
    };

    return cancelManager as TaskCancelManager;
}
