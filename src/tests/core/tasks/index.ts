import { Tasks } from '~/app/core/tasks';
import { SimpleTask } from '~/app/core/tasks/base/simple-task';

export const testTasks: Tasks = {
    dummyTask: new SimpleTask('dummyTask', async () =>
        console.log('Dummy Task executed!')
    ),
    dummyForegroundTask: new SimpleTask(
        'dummyForegroundTask',
        async () => console.log('Dummy Foreground Task executed!'),
        { foreground: true }
    ),
    failedTask: new SimpleTask('failedTask', () => {
        throw new Error('BOOOOM!');
    }),
    timeoutTask: new SimpleTask(
        'timeoutTask',
        (done, params, evt, onCancel) =>
            new Promise((resolve) => {
                const timeoutId = setTimeout(() => {
                    console.log('Timeout task run!');
                    resolve();
                }, 2000);
                onCancel(() => {
                    clearTimeout(timeoutId);
                    resolve();
                });
            })
    ),
    emitterTask: new SimpleTask('emitterTask', async (done) =>
        done('patataCooked', { status: 'slightlyBaked' })
    )
};
