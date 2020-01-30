import { RunnableTask } from './runnable-task';
import { PlatformEvent } from '../events';
import { ScheduledTask } from '../schedulers/scheduled-task';

export interface TaskScheduler {
    schedule(
        task: RunnableTask,
        params?: PlatformEvent
    ): Promise<ScheduledTask>;
    cancel(scheduledTaskId: string): Promise<void>;
}

export interface TaskRunner {
    run(task: RunnableTask, params?: PlatformEvent): Promise<ScheduledTask>;
    stop(scheduledTaskId: string): Promise<void>;
}

export class TaskPlanner {
    constructor(
        private taskScheduler: TaskScheduler,
        private taskRunner: TaskRunner
    ) {}

    async plan(
        task: RunnableTask,
        params?: PlatformEvent
    ): Promise<ScheduledTask> {
        const scheduledTask = await (task.interval > 0
            ? this.taskScheduler.schedule(task, params)
            : this.taskRunner.run(task, params));

        // TODO: do something with scheduled task id and stopEvent

        return scheduledTask;
    }
}
