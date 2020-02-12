import { RunnableTask } from '../runnable-task';
import { PlatformEvent } from '../../events';
import { PlannedTask } from './planned-task';
import { TaskScheduler, taskScheduler as getTaskScheduler } from '../scheduler';
import {
    PlannedTasksStore,
    plannedTasksDB
} from '../../persistence/planned-tasks-store';
import { checkIfTaskExists } from '../provider';
import { TaskRunner, InstantTaskRunner } from '../runners/instant-task-runner';

export class TaskPlanner {
    constructor(
        private taskScheduler?: TaskScheduler,
        private taskRunner: TaskRunner = new InstantTaskRunner(plannedTasksDB),
        private taskStore: PlannedTasksStore = plannedTasksDB
    ) {}

    async plan(
        runnableTask: RunnableTask,
        platformEvent?: PlatformEvent
    ): Promise<PlannedTask> {
        checkIfTaskExists(runnableTask.name);

        const possibleExisting = await this.taskStore.get(runnableTask);
        if (possibleExisting && runnableTask.interval > 0) {
            return possibleExisting;
        }

        // FIXME: Scheduled tasks break the task chain since they do not report
        // that the task chain has finished. Add an event emitter here
        const plannedTask = await (runnableTask.interval > 0
            ? this.getTaskScheduler().schedule(runnableTask)
            : this.taskRunner.run(runnableTask, platformEvent));

        // TODO: do something with planned task id and cancelEvent

        return plannedTask;
    }

    private getTaskScheduler(): TaskScheduler {
        if (!this.taskScheduler) {
            this.taskScheduler = getTaskScheduler();
        }

        return this.taskScheduler;
    }
}
