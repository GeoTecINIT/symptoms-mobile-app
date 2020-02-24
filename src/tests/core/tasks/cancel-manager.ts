import { createPlannedTaskStoreMock } from '../persistence';
import { TaskCancelManager } from '~/app/core/tasks/cancel-manager';
import { TaskScheduler } from '~/app/core/tasks/scheduler';
import { RunnableTask } from '~/app/core/tasks/runnable-task';
import { hasListeners, off, createEvent, emit } from '~/app/core/events';
import {
    PlannedTask,
    PlanningType
} from '~/app/core/tasks/planner/planned-task';

describe('Task cancel manager', () => {
    const taskStore = createPlannedTaskStoreMock();
    const taskScheduler = createTaskSchedulerMock();
    const cancelManager = new TaskCancelManager(taskStore, taskScheduler);

    const cancelScheduledTasks = 'cancelScheduledTasks';
    const cancelImmediateTasks = 'cancelImmediateTasks';

    const firstScheduledTask = new PlannedTask(PlanningType.Alarm, {
        name: 'dummyTask',
        startAt: -1,
        interval: 60000,
        recurrent: true,
        params: {}
    });

    const secondScheduledTask = new PlannedTask(PlanningType.Alarm, {
        name: 'dummyTask',
        startAt: -1,
        interval: 120000,
        recurrent: false,
        params: {}
    });

    const firstImmediateTask = new PlannedTask(PlanningType.Immediate, {
        name: 'dummyTask',
        startAt: -1,
        interval: 0,
        recurrent: false,
        params: {}
    });

    const secondImmediateTask = new PlannedTask(PlanningType.Immediate, {
        name: 'anotherDummyTask',
        startAt: -1,
        interval: 0,
        recurrent: false,
        params: {}
    });

    beforeEach(() => {
        spyOn(taskStore, 'getAllCancelEvents').and.returnValue(
            Promise.resolve([cancelScheduledTasks, cancelImmediateTasks])
        );
    });

    it('obtains and listen to task cancellation events', async () => {
        await cancelManager.init();
        expect(taskStore.getAllCancelEvents).toHaveBeenCalled();
        expect(hasListeners(cancelScheduledTasks)).toBeTruthy();
        expect(hasListeners(cancelImmediateTasks)).toBeTruthy();
    });

    it('cancels scheduled tasks when its cancellation event gets received', async () => {
        const fetchPromise = new Promise((resolve) => {
            spyOn(taskStore, 'getAllFilteredByCancelEvent')
                .withArgs(cancelImmediateTasks)
                .and.returnValue(
                    Promise.resolve([
                        firstScheduledTask,
                        secondScheduledTask
                    ]).then((cancelEvents) => {
                        resolve();

                        return cancelEvents;
                    })
                );
            spyOn(taskScheduler, 'cancel');
        });

        await cancelManager.init();
        emit(createEvent(cancelScheduledTasks));
        await fetchPromise;

        expect(taskStore.getAllFilteredByCancelEvent).toHaveBeenCalledWith(
            cancelScheduledTasks
        );
        expect(taskScheduler.cancel).toHaveBeenCalledWith(
            firstScheduledTask.id
        );
        expect(taskScheduler.cancel).toHaveBeenCalledWith(
            secondScheduledTask.id
        );
    });

    it('removes immediate tasks data when its cancellation event gets received', async () => {
        const fetchPromise = new Promise((resolve) => {
            spyOn(taskStore, 'getAllFilteredByCancelEvent')
                .withArgs(cancelImmediateTasks)
                .and.returnValue(
                    Promise.resolve([
                        firstImmediateTask,
                        secondImmediateTask
                    ]).then((cancelEvents) => {
                        resolve();

                        return cancelEvents;
                    })
                );
            spyOn(taskStore, 'delete');
        });

        await cancelManager.init();
        emit(createEvent(cancelImmediateTasks));
        await fetchPromise;

        expect(taskStore.getAllFilteredByCancelEvent).toHaveBeenCalledWith(
            cancelImmediateTasks
        );
        expect(taskStore.delete).toHaveBeenCalledWith(firstImmediateTask.id);
        expect(taskStore.delete).toHaveBeenCalledWith(secondImmediateTask.id);
    });

    afterEach(() => {
        off(cancelScheduledTasks);
        off(cancelImmediateTasks);
    });
});

function createTaskSchedulerMock(): TaskScheduler {
    return {
        schedule(task: RunnableTask) {
            return Promise.resolve(null);
        },
        cancel(taskId: string) {
            return Promise.resolve();
        }
    };
}
