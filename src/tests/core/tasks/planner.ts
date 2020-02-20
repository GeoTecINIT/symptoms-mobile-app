import { TaskPlanner } from '~/app/core/tasks/planner';
import { TaskScheduler } from '~/app/core/tasks/scheduler';
import {
    RunnableTask,
    RunnableTaskBuilder
} from '~/app/core/tasks/runnable-task';
import {
    PlatformEvent,
    CoreEvent,
    EventCallback,
    on,
    createEvent,
    off
} from '~/app/core/events';
import {
    PlannedTask,
    PlanningType
} from '~/app/core/tasks/planner/planned-task';
import { createPlannedTaskStoreMock } from '../persistence';
import { TaskNotFoundError } from '~/app/core/tasks/provider';
import { TaskRunner } from '~/app/core/tasks/runners/instant-task-runner';

describe('Task planner', () => {
    const taskScheduler = createTaskScheduler();
    const taskRunner = createTaskRunner();
    const taskStore = createPlannedTaskStoreMock();
    const taskPlanner = new TaskPlanner(taskScheduler, taskRunner, taskStore);

    const dummyEvent: PlatformEvent = {
        name: 'dummyEvent',
        id: 'unknown',
        data: {}
    };

    const immediateTask = new RunnableTaskBuilder('dummyTask', {})
        .now()
        .build();
    const recurrentTask = new RunnableTaskBuilder('dummyTask', {})
        .every(10)
        .build();
    const oneShotTask = new RunnableTaskBuilder('dummyTask', {}).in(10).build();

    const immediatePlannedTask = new PlannedTask(
        PlanningType.Alarm,
        immediateTask
    );

    const recurrentPlannedTask = new PlannedTask(
        PlanningType.Alarm,
        recurrentTask
    );

    let dummyCallback: EventCallback;

    beforeEach(() => {
        spyOn(taskScheduler, 'schedule').and.callThrough();
        spyOn(taskRunner, 'run').and.returnValue(
            Promise.resolve(immediatePlannedTask)
        );
        dummyCallback = jasmine.createSpy();
    });

    it('runs a task immediately', async () => {
        await taskPlanner.plan(immediateTask, dummyEvent);
        expect(taskRunner.run).toHaveBeenCalledWith(immediateTask, dummyEvent);
    });

    it('schedules a recurrent task in time', async () => {
        on(CoreEvent.TaskChainFinished, dummyCallback);
        await taskPlanner.plan(recurrentTask, dummyEvent);
        expect(taskScheduler.schedule).toHaveBeenCalledWith(recurrentTask);
        expect(dummyCallback).toHaveBeenCalled();
    });

    it('schedules a one-shot task in time', async () => {
        on(CoreEvent.TaskChainFinished, dummyCallback);
        await taskPlanner.plan(oneShotTask, dummyEvent);
        expect(taskScheduler.schedule).toHaveBeenCalledWith(oneShotTask);
        expect(dummyCallback).toHaveBeenCalled();
    });

    it('raises an error when task is unknown', async () => {
        const unknownTask: RunnableTask = {
            name: 'patata',
            startAt: -1,
            interval: 60,
            recurrent: false,
            params: {}
        };
        const errorEvent = createEvent(CoreEvent.TaskChainFinished, {
            id: dummyEvent.id,
            data: {
                result: {
                    status: 'error',
                    reason: new TaskNotFoundError(unknownTask.name)
                }
            }
        });
        on(CoreEvent.TaskChainFinished, dummyCallback);
        await expectAsync(
            taskPlanner.plan(unknownTask, dummyEvent)
        ).toBeRejectedWith(new TaskNotFoundError(unknownTask.name));
        expect(dummyCallback).toHaveBeenCalledWith(errorEvent);
    });

    it('runs an immediate task already run', async () => {
        spyOn(taskStore, 'get')
            .withArgs(immediateTask)
            .and.returnValue(Promise.resolve(immediatePlannedTask));
        const plannedTask = await taskPlanner.plan(immediateTask, dummyEvent);
        expect(plannedTask).toBe(immediatePlannedTask);
        expect(taskScheduler.schedule).not.toHaveBeenCalled();
        expect(taskRunner.run).toHaveBeenCalled();
    });

    it('does nothing when a task has already been scheduled and its recurrent', async () => {
        spyOn(taskStore, 'get')
            .withArgs(recurrentTask)
            .and.returnValue(Promise.resolve(recurrentPlannedTask));
        const plannedTask = await taskPlanner.plan(recurrentTask, dummyEvent);
        expect(plannedTask).toBe(recurrentPlannedTask);
        expect(taskScheduler.schedule).not.toHaveBeenCalled();
        expect(taskRunner.run).not.toHaveBeenCalled();
    });

    afterEach(() => {
        off(CoreEvent.TaskChainFinished);
    });
});

function createTaskScheduler(): TaskScheduler {
    return {
        schedule(task: RunnableTask): Promise<PlannedTask> {
            return Promise.resolve(null);
        },
        cancel(id: string): Promise<void> {
            return Promise.resolve();
        }
    };
}

function createTaskRunner(): TaskRunner {
    return {
        run(
            task: RunnableTask,
            platformEvent: PlatformEvent
        ): Promise<PlannedTask> {
            return Promise.resolve(null);
        }
    };
}
