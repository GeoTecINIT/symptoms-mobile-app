import { Tasks } from '~/app/core/tasks';
import { SimpleTask } from '~/app/core/tasks/simple-task';

export const tasks: Tasks = {
    dummyTask: new SimpleTask(() => console.log('Dummy Task executed!'))
};
