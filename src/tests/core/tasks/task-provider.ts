import {
    getTask,
    TaskNotFoundError,
    setTasks
} from '~/app/core/tasks/task-provider';
import { testTasks } from '.';

describe('Task provider', () => {
    setTasks(testTasks);

    it('throws an error when task os unknown', () => {
        const name = 'patata';
        expect(() => getTask(name)).toThrow(new TaskNotFoundError(name));
    });

    it('returns a dummy task', () => {
        const name = 'dummyTask';
        const expectedTask = testTasks[name];
        expect(getTask(name)).toBe(expectedTask);
    });
});
