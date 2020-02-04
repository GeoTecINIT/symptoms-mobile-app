import { TaskPlanner } from '~/app/core/tasks/planner';
import { TaskScheduler } from '~/app/core/tasks/scheduler';
import {
    RunnableTask,
    RunnableTaskBuilder
} from '~/app/core/tasks/runnable-task';
import { PlatformEvent } from '~/app/core/events';
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

    beforeEach(() => {
        spyOn(taskScheduler, 'schedule').and.callThrough();
        spyOn(taskRunner, 'run').and.callThrough();
    });

    it('runs a task immediately', async () => {
        await taskPlanner.plan(immediateTask, dummyEvent);
        expect(taskRunner.run).toHaveBeenCalledWith(immediateTask, dummyEvent);
    });

    it('schedules a recurrent task in time', async () => {
        await taskPlanner.plan(recurrentTask, dummyEvent);
        expect(taskScheduler.schedule).toHaveBeenCalledWith(recurrentTask);
    });

    it('schedules a one-shot task in time', async () => {
        await taskPlanner.plan(oneShotTask, dummyEvent);
        expect(taskScheduler.schedule).toHaveBeenCalledWith(oneShotTask);
    });

    it('raises an error when task is unknown', async () => {
        const unknownTask: RunnableTask = {
            name: 'patata',
            interval: 60,
            recurrent: false,
            params: {}
        };
        await expectAsync(taskPlanner.plan(unknownTask)).toBeRejectedWith(
            new TaskNotFoundError(unknownTask.name)
        );
    });

    it('does nothing when a task has already been scheduled', async () => {
        spyOn(taskStore, 'get')
            .withArgs(immediateTask)
            .and.returnValue(Promise.resolve(immediatePlannedTask));
        const plannedTask = await taskPlanner.plan(immediateTask, dummyEvent);
        expect(plannedTask).toBe(immediatePlannedTask);
        expect(taskScheduler.schedule).not.toHaveBeenCalled();
        expect(taskRunner.run).not.toHaveBeenCalled();
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
