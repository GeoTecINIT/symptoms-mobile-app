import { Tasks } from '~/app/core/tasks';
import { SimpleTask } from '~/app/core/tasks/simple-task';
import { emit } from '~/app/core/events';

export const testTasks: Tasks = {
    dummyTask: new SimpleTask(async () => console.log('Dummy Task executed!')),
    dummyForegroundTask: new SimpleTask(
        async () => console.log('Dummy Foreground Task executed'),
        false
    ),
    failedTask: new SimpleTask(() => {
        throw new Error('BOOOOM!');
    }),
    timeoutTask: new SimpleTask(
        () =>
            new Promise((resolve, reject) => setTimeout(() => resolve(), 1000)),
        true,
        100
    ),
    emitterTask: new SimpleTask(async () =>
        emit({
            name: 'patataCooked',
            id: 'unknown',
            data: { status: 'slightlyBaked' }
        })
    )
};
