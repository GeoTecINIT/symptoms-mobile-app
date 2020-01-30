import { RunnableTask } from '../runnable-task';
import { PlatformEvent } from '../../events';
import { PlannedTask } from './planned-task';

export interface TaskScheduler {
    schedule(task: RunnableTask, params?: PlatformEvent): Promise<PlannedTask>;
    cancel(plannedTaskId: string): Promise<void>;
}

export interface TaskRunner {
    run(task: RunnableTask, params?: PlatformEvent): Promise<PlannedTask>;
    stop(plannedTaskId: string): Promise<void>;
}

export class TaskPlanner {
    constructor(
        private taskScheduler: TaskScheduler,
        private taskRunner: TaskRunner
    ) {}

    async plan(
        task: RunnableTask,
        params?: PlatformEvent
    ): Promise<PlannedTask> {
        const plannedTask = await (task.interval > 0
            ? this.taskScheduler.schedule(task, params)
            : this.taskRunner.run(task, params));

        // TODO: do something with planned task id and stopEvent

        return plannedTask;
    }
}
