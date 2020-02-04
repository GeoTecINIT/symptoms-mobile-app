import { RunnableTask } from '../runnable-task';
import { PlatformEvent } from '../../events';
import { PlannedTask } from './planned-task';
import { TaskScheduler } from '../scheduler';
import { PlannedTasksStore } from '../../persistence/planned-tasks-store';
import { checkIfTaskExists } from '../provider';
import { TaskRunner } from '../runners/instant-task-runner';

export class TaskPlanner {
    constructor(
        private taskScheduler: TaskScheduler,
        private taskRunner: TaskRunner,
        private taskStore: PlannedTasksStore
    ) {}

    async plan(
        runnableTask: RunnableTask,
        platformEvent?: PlatformEvent
    ): Promise<PlannedTask> {
        checkIfTaskExists(runnableTask.name);

        const possibleExisting = await this.taskStore.get(runnableTask);
        if (possibleExisting) {
            return possibleExisting;
        }

        const plannedTask = await (runnableTask.interval > 0
            ? this.taskScheduler.schedule(runnableTask)
            : this.taskRunner.run(runnableTask, platformEvent));

        // TODO: do something with planned task id and cancelEvent

        return plannedTask;
    }
}
