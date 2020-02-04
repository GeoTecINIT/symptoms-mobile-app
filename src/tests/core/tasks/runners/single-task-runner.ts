import { setTasks } from '~/app/core/tasks/provider';
import { testTasks } from '..';
import { createPlannedTaskStoreMock } from '../../persistence';
import {
    PlannedTask,
    PlanningType
} from '~/app/core/tasks/planner/planned-task';
import { SingleTaskRunner } from '~/app/core/tasks/runners/single-task-runner';
import { CoreEvent, emit, createEvent } from '~/app/core/events';

describe('Single task runner', () => {
    setTasks(testTasks);
    const taskStore = createPlannedTaskStoreMock();

    const dummyTask = new PlannedTask(PlanningType.Alarm, {
        name: 'dummyTask',
        interval: 60000,
        recurrent: true,
        params: {}
    });
    const failedTask = new PlannedTask(PlanningType.Alarm, {
        name: 'failedTask',
        interval: 60000,
        recurrent: true,
        params: {}
    });
    const timeoutTask = new PlannedTask(PlanningType.Alarm, {
        name: 'timeoutTask',
        interval: 60000,
        recurrent: true,
        params: {}
    });

    const startEvent = createEvent(CoreEvent.TaskExecutionStarted);
    const timeoutEvent = createEvent(CoreEvent.TaskExecutionTimedOut, {
        id: startEvent.id
    });

    const taskRunner = new SingleTaskRunner(taskStore);

    beforeEach(() => {
        spyOn(taskStore, 'updateLastRun').and.returnValue(Promise.resolve());
        spyOn(taskStore, 'increaseErrorCount').and.returnValue(
            Promise.resolve()
        );
        spyOn(taskStore, 'increaseTimeoutCount').and.returnValue(
            Promise.resolve()
        );
    });

    it('executes a task successfully', async () => {
        await taskRunner.run(dummyTask, startEvent);

        expect(taskStore.updateLastRun).toHaveBeenCalledWith(
            dummyTask.id,
            jasmine.any(Number)
        );
    });

    it('increases the error count of a task that has failed', async () => {
        await taskRunner.run(failedTask, startEvent);

        expect(taskStore.increaseErrorCount).toHaveBeenCalledWith(
            failedTask.id
        );
    });

    it('increases the timeout count of a task that has failed', async () => {
        setTimeout(() => emit(timeoutEvent), 100);
        await taskRunner.run(timeoutTask, startEvent);

        expect(taskStore.increaseTimeoutCount).toHaveBeenCalledWith(
            timeoutTask.id
        );
    });
});
