import { Tasks } from '~/app/core/tasks';
import { SimpleTask } from '~/app/core/tasks/simple-task';

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
            new Promise((resolve, reject) => setTimeout(() => resolve(), 15001))
    )
};
