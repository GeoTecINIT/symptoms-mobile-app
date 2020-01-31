import {
    TaskPlanner,
    TaskScheduler,
    TaskRunner
} from '~/app/core/runners/task-planner';
import {
    RunnableTask,
    RunnableTaskBuilder
} from '~/app/core/runners/runnable-task';
import { PlatformEvent } from '~/app/core/events';
import { PlannedTask } from '~/app/core/runners/task-planner/planned-task';
import { createPlannedTaskStoreMock } from '../schedulers';

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

    const immediatePlannedTask = new PlannedTask('alarm', immediateTask);

    beforeEach(() => {
        spyOn(taskScheduler, 'schedule').and.callThrough();
        // spyOn(taskScheduler, 'cancel').and.callThrough();
        spyOn(taskRunner, 'run').and.callThrough();
        // spyOn(taskRunner, 'stop').and.callThrough();
    });

    it('runs a task immediately', async () => {
        await taskPlanner.plan(immediateTask, dummyEvent);
        expect(taskRunner.run).toHaveBeenCalledWith(immediateTask, dummyEvent);
    });

    it('schedules a recurrent task in time', async () => {
        await taskPlanner.plan(recurrentTask, dummyEvent);
        expect(taskScheduler.schedule).toHaveBeenCalledWith(
            recurrentTask,
            dummyEvent
        );
    });

    it('schedules a one-shot task in time', async () => {
        await taskPlanner.plan(oneShotTask, dummyEvent);
        expect(taskScheduler.schedule).toHaveBeenCalledWith(
            oneShotTask,
            dummyEvent
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
        schedule(
            task: RunnableTask,
            platformEvent?: PlatformEvent
        ): Promise<PlannedTask> {
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
            platformEvent?: PlatformEvent
        ): Promise<PlannedTask> {
            return Promise.resolve(null);
        },
        stop(id: string): Promise<void> {
            return Promise.resolve();
        }
    };
}
