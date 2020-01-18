import { Tasks } from '~/app/core/tasks';
import { SimpleTask } from '~/app/core/tasks/simple-task';

export const testTasks: Tasks = {
    dummyTask: new SimpleTask(() => console.log('Dummy Task executed!')),
    dummyForegroundTask: new SimpleTask(
        () => console.log('Dummy Foreground Task executed'),
        false
    )
};
