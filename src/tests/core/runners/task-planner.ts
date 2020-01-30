import {
    TaskPlanner,
    TaskScheduler,
    TaskRunner
} from '~/app/core/runners/task-planner';
import { RunnableTask } from '~/app/core/runners';
import { PlatformEvent } from '~/app/core/events';
import { ScheduledTask } from '~/app/core/schedulers/scheduled-task';

describe('Task planner', () => {
    const taskScheduler = createTaskScheduler();
    const taskRunner = createTaskRunner();
    const taskPlanner = new TaskPlanner(taskScheduler, taskRunner);

    const dummyEvent: PlatformEvent = {
        name: 'dummyEvent',
        id: 'unknown',
        data: {}
    };

    const immediateTask = new RunnableTask('dummyTask').now();
    const recurrentTask = new RunnableTask('dummyTask').every(10);
    const oneShotTask = new RunnableTask('dummyTask').in(10);

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
            params?: PlatformEvent
        ): Promise<ScheduledTask> {
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
            params?: PlatformEvent
        ): Promise<ScheduledTask> {
            return Promise.resolve(null);
        },
        stop(id: string): Promise<void> {
            return Promise.resolve();
        }
    };
}
