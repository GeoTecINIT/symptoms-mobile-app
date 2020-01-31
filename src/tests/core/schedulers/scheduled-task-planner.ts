import {
    PlanningType,
    PlannedTask
} from '~/app/core/runners/task-planner/planned-task';
import { ScheduledTaskPlanner } from '~/app/core/schedulers/scheduled-task-planner';
import { uuid } from '~/app/core/utils/uuid';
import { setTasks } from '~/app/core/tasks/task-provider';
import { testTasks } from '../tasks';
import { createPlannedTaskStoreMock } from '.';

describe('Scheduled Task Planner', () => {
    setTasks(testTasks);

    const planningType: PlanningType = 'alarm';
    const offset = 30000; // The half of alarm scheduler's fastest triggering frequency
    const plannedTasksStore = createPlannedTaskStoreMock();
    let taskPlanner: ScheduledTaskPlanner;

    const stdInterval = 60000;
    const currentTime = new Date().getTime();

    const ephemeralTaskToBeRun = new PlannedTask(
        planningType,
        {
            name: 'dummyTask',
            interval: stdInterval,
            recurrent: false,
            params: {}
        },
        uuid(),
        currentTime - stdInterval + offset
    );
    const ephemeralTaskNotToBeRun = new PlannedTask(
        planningType,
        {
            name: 'dummyTask',
            interval: 2 * stdInterval,
            recurrent: false,
            params: {}
        },
        uuid(),
        currentTime - stdInterval + offset
    );
    const recurrentTaskToBeRun = new PlannedTask(
        planningType,
        {
            name: 'dummyForegroundTask',
            interval: stdInterval + offset,
            recurrent: true,
            params: {}
        },
        uuid(),
        currentTime - 2 * stdInterval + offset,
        currentTime - stdInterval
    );
    const recurrentTaskNotToBeRun = new PlannedTask(
        planningType,
        {
            name: 'dummyTask',
            interval: 2 * stdInterval,
            recurrent: true,
            params: {}
        },
        uuid(),
        currentTime - 4 * stdInterval,
        currentTime - stdInterval
    );

    const sortedTasks = [
        ephemeralTaskToBeRun,
        recurrentTaskToBeRun,
        ephemeralTaskNotToBeRun,
        recurrentTaskNotToBeRun
    ];

    beforeEach(() => {
        taskPlanner = new ScheduledTaskPlanner(
            planningType,
            plannedTasksStore,
            offset,
            currentTime
        );
    });

    it('lists the tasks to be run for a given type', async () => {
        spyOn(plannedTasksStore, 'getAllSortedByInterval')
            .withArgs(planningType)
            .and.returnValue(Promise.resolve(sortedTasks));
        const tasks = await taskPlanner.tasksToRun();
        expect(tasks).toEqual([ephemeralTaskToBeRun, recurrentTaskToBeRun]);
    });

    it('returns an empty list when no tasks need to be run', async () => {
        spyOn(plannedTasksStore, 'getAllSortedByInterval')
            .withArgs(planningType)
            .and.returnValue(
                Promise.resolve([
                    ephemeralTaskNotToBeRun,
                    recurrentTaskNotToBeRun
                ])
            );
        const tasks = await taskPlanner.tasksToRun();
        expect(tasks.length).toBe(0);
    });

    it('checks if at least a task to be run requires foreground execution', async () => {
        spyOn(plannedTasksStore, 'getAllSortedByInterval')
            .withArgs(planningType)
            .and.returnValue(Promise.resolve(sortedTasks));
        const requiresForeground = await taskPlanner.requiresForeground();
        expect(requiresForeground).toBeTruthy();
    });

    it('returns false when no tasks need to be run in the foreground', async () => {
        spyOn(plannedTasksStore, 'getAllSortedByInterval')
            .withArgs(planningType)
            .and.returnValue(
                Promise.resolve([
                    ephemeralTaskToBeRun,
                    ephemeralTaskNotToBeRun,
                    recurrentTaskNotToBeRun
                ])
            );
        const requiresForeground = await taskPlanner.requiresForeground();
        expect(requiresForeground).toBeFalsy();
    });

    it('determines if there are tasks that will require another run', async () => {
        spyOn(plannedTasksStore, 'getAllSortedByInterval')
            .withArgs(planningType)
            .and.returnValue(Promise.resolve(sortedTasks));
        const willContinue = await taskPlanner.willContinue();
        expect(willContinue).toBeTruthy();
    });

    it('returns false when no tasks need to be run', async () => {
        spyOn(plannedTasksStore, 'getAllSortedByInterval')
            .withArgs(planningType)
            .and.returnValue(Promise.resolve([]));
        const willContinue = await taskPlanner.willContinue();
        expect(willContinue).toBeFalsy();
    });

    it('returns false when all the tasks are finite and fit in this execution window', async () => {
        spyOn(plannedTasksStore, 'getAllSortedByInterval')
            .withArgs(planningType)
            .and.returnValue(Promise.resolve([ephemeralTaskToBeRun]));
        const willContinue = await taskPlanner.willContinue();
        expect(willContinue).toBeFalsy();
    });

    it('returns true when all the tasks are finite but do not fit in this execution window', async () => {
        spyOn(plannedTasksStore, 'getAllSortedByInterval')
            .withArgs(planningType)
            .and.returnValue(
                Promise.resolve([ephemeralTaskToBeRun, ephemeralTaskNotToBeRun])
            );
        const willContinue = await taskPlanner.willContinue();
        expect(willContinue).toBeTruthy();
    });

    it('calculates the time until the next execution of the planner', async () => {
        spyOn(plannedTasksStore, 'getAllSortedByInterval')
            .withArgs(planningType)
            .and.returnValue(Promise.resolve(sortedTasks));
        const nextInterval = await taskPlanner.nextInterval();
        expect(nextInterval).toBe(recurrentTaskToBeRun.interval);
    });

    it('returns -1 when a next execution is not required', async () => {
        spyOn(plannedTasksStore, 'getAllSortedByInterval')
            .withArgs(planningType)
            .and.returnValue(Promise.resolve([ephemeralTaskToBeRun]));
        const nextInterval = await taskPlanner.nextInterval();
        expect(nextInterval).toBe(-1);
    });
});
