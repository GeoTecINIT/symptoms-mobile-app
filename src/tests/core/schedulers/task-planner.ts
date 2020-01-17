import {
    SchedulerType,
    ScheduledTask,
    TaskToSchedule
} from '~/app/core/schedulers/scheduled-task';
import { TaskPlanner } from '~/app/core/schedulers/task-planner';
import { ScheduledTasksStore } from '~/app/core/schedulers/scheduled-tasks-store';
import { uuid } from '~/app/core/utils/uuid';

describe('Task Planner', () => {
    const schedulerType: SchedulerType = 'alarm';
    const offset = 30000; // The half of alarm scheduler's fastest triggering frequency
    const scheduledTasksStore = createScheduledTaskStoreMock();
    const taskPlanner = new TaskPlanner(
        schedulerType,
        scheduledTasksStore,
        offset
    );

    const stdInterval = 60000;
    const currentTime = new Date().getTime();
    const ephemeralTaskToBeRun = new ScheduledTask(
        schedulerType,
        { task: 'dummyTask', interval: stdInterval, recurrent: false },
        uuid(),
        currentTime - stdInterval + offset
    );
    const ephemeralTaskNotToBeRun = new ScheduledTask(
        schedulerType,
        { task: 'dummyTask', interval: 2 * stdInterval, recurrent: false },
        uuid(),
        currentTime - stdInterval + offset
    );
    const recurrentTaskToBeRun = new ScheduledTask(
        schedulerType,
        { task: 'dummyTask', interval: stdInterval + offset, recurrent: true },
        uuid(),
        currentTime - 2 * stdInterval + offset,
        currentTime - stdInterval
    );
    const recurrentTaskNotToBeRun = new ScheduledTask(
        schedulerType,
        { task: 'dummyTask', interval: 2 * stdInterval, recurrent: true },
        uuid(),
        currentTime - 4 * stdInterval,
        currentTime - stdInterval
    );
    const sortedTasks = [
        ephemeralTaskToBeRun,
        ephemeralTaskNotToBeRun,
        recurrentTaskToBeRun,
        recurrentTaskNotToBeRun
    ];

    it('lists the tasks to be run for a given type', async () => {
        spyOn(scheduledTasksStore, 'getAllSortedByInterval')
            .withArgs(schedulerType)
            .and.returnValue(Promise.resolve(sortedTasks));
        const tasks = await taskPlanner.tasksToRun();
        expect(tasks).toEqual([ephemeralTaskToBeRun, recurrentTaskToBeRun]);
    });

    it('returns an empty list when no tasks need to be run', async () => {
        spyOn(scheduledTasksStore, 'getAllSortedByInterval')
            .withArgs(schedulerType)
            .and.returnValue(
                Promise.resolve([
                    ephemeralTaskNotToBeRun,
                    recurrentTaskNotToBeRun
                ])
            );
        const tasks = await taskPlanner.tasksToRun();
        expect(tasks.length).toBe(0);
    });

    it('checks if at least a task to be run requires foreground execution', () => {
        throw new Error('Not implemented');
    });

    it('returns false when no tasks need to be run in the foreground', () => {
        throw new Error('Not implemented');
    });

    it('determines if there are tasks that will require another run', async () => {
        spyOn(scheduledTasksStore, 'getAllSortedByInterval')
            .withArgs(schedulerType)
            .and.returnValue(Promise.resolve(sortedTasks));
        const willContinue = await taskPlanner.willContinue();
        expect(willContinue).toBeTruthy();
    });

    it('returns false when no tasks need to be run', async () => {
        spyOn(scheduledTasksStore, 'getAllSortedByInterval')
            .withArgs(schedulerType)
            .and.returnValue(Promise.resolve([]));
        const willContinue = await taskPlanner.willContinue();
        expect(willContinue).toBeFalsy();
    });

    it('returns false when all the tasks are finite and fit in this execution window', async () => {
        spyOn(scheduledTasksStore, 'getAllSortedByInterval')
            .withArgs(schedulerType)
            .and.returnValue(Promise.resolve([ephemeralTaskToBeRun]));
        const willContinue = await taskPlanner.willContinue();
        expect(willContinue).toBeFalsy();
    });

    it('returns true when all the tasks are finite but do not fit in this execution window', async () => {
        spyOn(scheduledTasksStore, 'getAllSortedByInterval')
            .withArgs(schedulerType)
            .and.returnValue(Promise.resolve([ephemeralTaskNotToBeRun]));
        const willContinue = await taskPlanner.willContinue();
        expect(willContinue).toBeTruthy();
    });

    it('calculates the time until the next execution of the planner', async () => {
        spyOn(scheduledTasksStore, 'getAllSortedByInterval')
            .withArgs(schedulerType)
            .and.returnValue(Promise.resolve(sortedTasks));
        const nextInterval = await taskPlanner.nextInterval();
        expect(nextInterval).toBe(recurrentTaskToBeRun.interval);
    });

    it('returns -1 when a next execution is not required', async () => {
        spyOn(scheduledTasksStore, 'getAllSortedByInterval')
            .withArgs(schedulerType)
            .and.returnValue(Promise.resolve([ephemeralTaskToBeRun]));
        const nextInterval = await taskPlanner.nextInterval();
        expect(nextInterval).toBe(-1);
    });
});

function createScheduledTaskStoreMock(): ScheduledTasksStore {
    return {
        insert(scheduledTask: ScheduledTask) {
            return Promise.resolve();
        },
        delete(task: string) {
            return Promise.resolve();
        },
        get(task: TaskToSchedule | string) {
            return Promise.resolve(null);
        },
        getAllSortedByInterval() {
            return Promise.resolve([]);
        },
        increaseErrorCount(task: string) {
            return Promise.resolve();
        },
        increaseTimeoutCount(task: string) {
            return Promise.resolve();
        },
        updateLastRun(task: string, timestamp: number) {
            return Promise.resolve();
        }
    };
}
