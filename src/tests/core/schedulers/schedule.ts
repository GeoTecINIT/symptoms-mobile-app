import { schedule } from '~/app/core/schedulers';
import { TaskNotFoundError, setTasks } from '~/app/core/tasks/task-provider';
import { testTasks } from '../tasks';

describe('Schedule', () => {
    setTasks(testTasks);

    it('schedules a job in time', async () => {
        const taskToSchedule = 'dummyTask';
        const task = await schedule(60, taskToSchedule);
        expect(task).not.toBeNull();
    });

    it('raises an error when task is unknown', async () => {
        const taskToSchedule = 'patata';
        await expectAsync(schedule(60, taskToSchedule)).toBeRejectedWith(
            new TaskNotFoundError(taskToSchedule)
        );
    });
});
