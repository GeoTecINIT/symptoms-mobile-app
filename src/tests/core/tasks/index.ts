import { Tasks } from '~/app/core/tasks';
import { SimpleTask } from '~/app/core/tasks/base/simple-task';

export const testTasks: Tasks = {
    dummyTask: new SimpleTask('dummyTask', async () =>
        console.log('Dummy Task executed!')
    ),
    dummyForegroundTask: new SimpleTask(
        'dummyForegroundTask',
        async () => console.log('Dummy Foreground Task executed'),
        { foreground: true }
    ),
    failedTask: new SimpleTask('failedTask', () => {
        throw new Error('BOOOOM!');
    }),
    timeoutTask: new SimpleTask(
        'timeoutTask',
        () => new Promise((resolve) => setTimeout(() => resolve(), 2000))
    ),
    emitterTask: new SimpleTask('emitterTask', async (done) =>
        done('patataCooked', { status: 'slightlyBaked' })
    )
};
