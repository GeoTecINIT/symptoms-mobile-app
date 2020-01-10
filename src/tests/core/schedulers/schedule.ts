import { schedule } from '~/app/core/schedulers';
import { TaskNotFoundError, setTasks } from '~/app/core/tasks/task-provider';
import { testTasks } from '../tasks';

describe('Schedule', () => {
    setTasks(testTasks);

    it('schedules a job in time', () => {
        const taskToSchedule = 'dummyTask';
        const task = schedule(60, taskToSchedule);
        expect(task.scheduled).toBe(true);
    });

    it('raises an error when task is unknown', () => {
        const taskToSchedule = 'patata';
        expect(() => schedule(60, taskToSchedule)).toThrow(
            new TaskNotFoundError(taskToSchedule)
        );
    });
});
