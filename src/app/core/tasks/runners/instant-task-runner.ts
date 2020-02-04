import { RunnableTask } from '../runnable-task';
import { PlatformEvent } from '../../events';
import { PlannedTask } from '../planner/planned-task';
import { PlannedTasksStore } from '../../persistence/planned-tasks-store';

export class InstantTaskRunner implements TaskRunner {
    constructor(private taskStore: PlannedTasksStore) {}

    run(
        task: RunnableTask,
        platformEvent: PlatformEvent
    ): Promise<PlannedTask> {
        throw new Error('Method not implemented.');
    }
}

export interface TaskRunner {
    run(task: RunnableTask, platformEvent: PlatformEvent): Promise<PlannedTask>;
}
