import { createScheduledTaskStoreMock } from '.';
import { setTasks } from '~/app/core/tasks/task-provider';
import { testTasks } from '../tasks';
import { TaskRunner } from '~/app/core/schedulers/task-runner';
import {
    TaskToSchedule,
    ScheduledTask
} from '~/app/core/schedulers/scheduled-task';

describe('Task runner', () => {
    const taskStore = createScheduledTaskStoreMock();

    const dummyTask: TaskToSchedule = {
        task: 'dummyTask',
        interval: 60000,
        recurrent: true
    };
    const failedTask: TaskToSchedule = {
        task: 'failedTask',
        interval: 60000,
        recurrent: true
    };
    const timeoutTask: TaskToSchedule = {
        task: 'timeoutTask',
        interval: 60000,
        recurrent: true
    };

    const expectedDummyTask = new ScheduledTask('alarm', dummyTask);
    const expectedFailedTask = new ScheduledTask('alarm', failedTask);
    const expectedTimeoutTask = new ScheduledTask('alarm', timeoutTask);
    const scheduledTasks = [
        expectedDummyTask,
        expectedFailedTask,
        expectedTimeoutTask
    ];

    const taskRunner = new TaskRunner(scheduledTasks, taskStore);
    const expectedTimeout = 15000;
    setTasks(testTasks);

    beforeEach(() => {
        spyOn(taskStore, 'updateLastRun').and.returnValue(Promise.resolve());
        spyOn(taskStore, 'increaseErrorCount').and.returnValue(
            Promise.resolve()
        );
        spyOn(taskStore, 'increaseTimeoutCount').and.returnValue(
            Promise.resolve()
        );

        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('calculates the total timeout of all the tasks to be run.', () => {
        const timeout = taskRunner.getTimeout();
        expect(timeout).toBe(expectedTimeout);
    });

    it('executes all the tasks successfully', async () => {
        const run = taskRunner.run();
        jasmine.clock().tick(expectedTimeout + 5);
        await run;

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
        const run = taskRunner.run();
        jasmine.clock().tick(expectedTimeout + 5);
        await run;

        expect(taskStore.increaseErrorCount).toHaveBeenCalledWith(
            expectedFailedTask.id
        );
    });

    it('increases the timeout count of a task that has failed', async () => {
        const run = taskRunner.run();
        jasmine.clock().tick(expectedTimeout + 5);
        await run;

        expect(taskStore.increaseTimeoutCount).toHaveBeenCalledWith(
            expectedTimeoutTask.id
        );
    });
});
