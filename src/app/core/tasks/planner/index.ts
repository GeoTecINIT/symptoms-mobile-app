import { RunnableTask } from '../runnable-task';
import { PlatformEvent } from '../../events';
import { PlannedTask } from './planned-task';
import { PlannedTasksStore } from '../../persistence/planned-tasks-store';

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
        private taskRunner: TaskRunner,
        private taskStore: PlannedTasksStore
    ) {}

    async plan(
        runnableTask: RunnableTask,
        params?: PlatformEvent
    ): Promise<PlannedTask> {
        const possibleExisting = await this.taskStore.get(runnableTask);
        if (possibleExisting) {
            return possibleExisting;
        }

        const plannedTask = await (runnableTask.interval > 0
            ? this.taskScheduler.schedule(runnableTask, params)
            : this.taskRunner.run(runnableTask, params));

        // TODO: do something with planned task id and cancelEvent

        return plannedTask;
    }
}
