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

describe('Task planner', () => {
    const taskScheduler = createTaskScheduler();
    const taskRunner = createTaskRunner();
    const taskPlanner = new TaskPlanner(taskScheduler, taskRunner);

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
