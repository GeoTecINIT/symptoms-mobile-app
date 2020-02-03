import { PlannedTasksStore } from '../../persistence/planned-tasks-store';
import { PlannedTask } from '../planner/planned-task';
import { PlatformEvent } from '../../events';
import { SingleTaskRunner } from './single-task-runner';

export class BatchTaskRunner {
    private taskRunner: SingleTaskRunner;

    constructor(taskStore: PlannedTasksStore) {
        this.taskRunner = new SingleTaskRunner(taskStore);
    }

    async run(
        plannedTasks: Array<PlannedTask>,
        platformEvent: PlatformEvent
    ): Promise<void> {
        await Promise.all(
            plannedTasks.map((plannedTask) =>
                this.taskRunner.run(plannedTask, platformEvent)
            )
        );
    }
}
