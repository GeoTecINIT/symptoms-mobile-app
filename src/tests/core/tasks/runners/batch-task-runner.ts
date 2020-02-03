import { setTasks } from '~/app/core/tasks/provider';
import { testTasks } from '..';
import { createPlannedTaskStoreMock } from '../../persistence';
import { PlannedTask } from '~/app/core/tasks/planner/planned-task';
import { BatchTaskRunner } from '~/app/core/tasks/runners/batch-task-runner';
import { CoreEvent, emit, createEvent } from '~/app/core/events';

describe('Batch task runner', () => {
    setTasks(testTasks);
    const taskStore = createPlannedTaskStoreMock();

    const expectedDummyTask = new PlannedTask('alarm', {
        name: 'dummyTask',
        interval: 60000,
        recurrent: true,
        params: {}
    });
    const expectedFailedTask = new PlannedTask('alarm', {
        name: 'failedTask',
        interval: 60000,
        recurrent: true,
        params: {}
    });
    const expectedTimeoutTask = new PlannedTask('alarm', {
        name: 'timeoutTask',
        interval: 60000,
        recurrent: true,
        params: {}
    });
    const plannedTasks = [
        expectedDummyTask,
        expectedFailedTask,
        expectedTimeoutTask
    ];

    const timeoutEvent = createEvent(CoreEvent.TaskExecutionTimedOut);
    const timeoutEventId = timeoutEvent.id;

    const taskRunner = new BatchTaskRunner(taskStore);

    beforeEach(() => {
        spyOn(taskStore, 'updateLastRun').and.returnValue(Promise.resolve());
        spyOn(taskStore, 'increaseErrorCount').and.returnValue(
            Promise.resolve()
        );
        spyOn(taskStore, 'increaseTimeoutCount').and.returnValue(
            Promise.resolve()
        );
    });

    it('executes all the tasks successfully', async () => {
        await taskRunner.run(plannedTasks, timeoutEventId);

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
        await taskRunner.run(plannedTasks, timeoutEventId);

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
        setTimeout(() => emit(timeoutEvent), 100);
        await taskRunner.run(plannedTasks, timeoutEventId);

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
