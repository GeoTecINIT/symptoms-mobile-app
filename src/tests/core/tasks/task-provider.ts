import {
    getTask,
    TaskNotFoundError,
    setTasks
} from '~/app/core/tasks/task-provider';
import { tasks } from '.';

describe('Task provider', () => {
    setTasks(tasks);

    it('throws an error when task os unknown', () => {
        const name = 'patata';
        expect(() => getTask(name)).toThrow(new TaskNotFoundError(name));
    });

    it('returns a dummy task', () => {
        const name = 'dummyTask';
        const expectedTask = tasks[name];
        expect(getTask(name)).toBe(expectedTask);
    });
});
