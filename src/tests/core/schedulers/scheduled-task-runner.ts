import { createPlannedTaskStoreMock } from '.';
import { setTasks } from '~/app/core/tasks/provider';
import { testTasks } from '../tasks';
import { ScheduledTaskRunner } from '~/app/core/schedulers/scheduled-task-runner';
import { PlannedTask } from '~/app/core/tasks/planner/planned-task';
import { RunnableTask } from '~/app/core/tasks/runnable-task';

describe('Scheduled Task runner', () => {
    const taskStore = createPlannedTaskStoreMock();

    const dummyTask: RunnableTask = {
        name: 'dummyTask',
        interval: 60000,
        recurrent: true,
        params: {}
    };
    const failedTask: RunnableTask = {
        name: 'failedTask',
        interval: 60000,
        recurrent: true,
        params: {}
    };
    const timeoutTask: RunnableTask = {
        name: 'timeoutTask',
        interval: 60000,
        recurrent: true,
        params: {}
    };

    const expectedDummyTask = new PlannedTask('alarm', dummyTask);
    const expectedFailedTask = new PlannedTask('alarm', failedTask);
    const expectedTimeoutTask = new PlannedTask('alarm', timeoutTask);
    const plannedTasks = [
        expectedDummyTask,
        expectedFailedTask,
        expectedTimeoutTask
    ];

    const taskRunner = new ScheduledTaskRunner(plannedTasks, taskStore);
    const expectedTimeout = 1000;
    setTasks(testTasks);

    beforeEach(() => {
        spyOn(taskStore, 'updateLastRun').and.returnValue(Promise.resolve());
        spyOn(taskStore, 'increaseErrorCount').and.returnValue(
            Promise.resolve()
        );
        spyOn(taskStore, 'increaseTimeoutCount').and.returnValue(
            Promise.resolve()
        );
    });

    it('calculates the total timeout of all the tasks to be run.', () => {
        const timeout = taskRunner.getTimeout();
        expect(timeout).toBe(expectedTimeout);
    });

    it('executes all the tasks successfully', async () => {
        await taskRunner.run();

        expect(taskStore.updateLastRun).toHaveBeenCalledWith(
            expectedDummyTask.id,
            jasmine.any(Number)
        );
        expect(taskStore.updateLastRun).toHaveBeenCalledWith(
            expectedFailedTask.id,
            jasmine.any(Number)
        );
        expect(taskStore.updateLastRun).toHaveBeenCalledWith(
            expectedTimeoutTask.id,
            jasmine.any(Number)
        );
    });

    it('increases the error count of a task that has failed', async () => {
        await taskRunner.run();

        expect(taskStore.increaseErrorCount).not.toHaveBeenCalledWith(
            expectedDummyTask.id
        );
        expect(taskStore.increaseErrorCount).toHaveBeenCalledWith(
            expectedFailedTask.id
        );
        expect(taskStore.increaseErrorCount).not.toHaveBeenCalledWith(
            expectedTimeoutTask.id
        );
    });

    it('increases the timeout count of a task that has failed', async () => {
        await taskRunner.run();

        expect(taskStore.increaseTimeoutCount).not.toHaveBeenCalledWith(
            expectedDummyTask.id
        );
        expect(taskStore.increaseTimeoutCount).not.toHaveBeenCalledWith(
            expectedFailedTask.id
        );
        expect(taskStore.increaseTimeoutCount).toHaveBeenCalledWith(
            expectedTimeoutTask.id
        );
    });
});
