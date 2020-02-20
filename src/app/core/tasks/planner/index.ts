import { RunnableTask } from '../runnable-task';
import { PlatformEvent, emit, CoreEvent, createEvent } from '../../events';
import { PlannedTask } from './planned-task';
import { TaskScheduler, taskScheduler as getTaskScheduler } from '../scheduler';
import {
    PlannedTasksStore,
    plannedTasksDB
} from '../../persistence/planned-tasks-store';
import { checkIfTaskExists } from '../provider';
import { TaskRunner, InstantTaskRunner } from '../runners/instant-task-runner';
import { TaskResultStatus, TaskChainResult } from '../task';

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
        try {
            checkIfTaskExists(runnableTask.name);

            const plannedTask = await (runnableTask.interval > 0 ||
            runnableTask.startAt !== -1
                ? this.planScheduled(runnableTask, platformEvent)
                : this.planImmediate(runnableTask, platformEvent));
            // TODO: do something with planned task id and cancelEvent

            return plannedTask;
        } catch (err) {
            this.emitTaskChainFinished(platformEvent, err);
            throw err;
        }
    }

    private planImmediate(
        runnableTask: RunnableTask,
        platformEvent: PlatformEvent
    ): Promise<PlannedTask> {
        return this.taskRunner.run(runnableTask, platformEvent);
    }

    private async planScheduled(
        runnableTask: RunnableTask,
        platformEvent: PlatformEvent
    ): Promise<PlannedTask> {
        const possibleExisting = await this.taskStore.get(runnableTask);
        if (possibleExisting) {
            this.emitTaskChainFinished(platformEvent);

            return possibleExisting;
        }

        const plannedTask = await this.getTaskScheduler().schedule(
            runnableTask
        );
        this.emitTaskChainFinished(platformEvent);

        return plannedTask;
    }

    private emitTaskChainFinished(
        platformEvent?: PlatformEvent,
        error?: Error
    ) {
        if (!platformEvent) {
            return;
        }
        let result: TaskChainResult = { status: TaskResultStatus.Ok };
        if (error) {
            result = { status: TaskResultStatus.Error, reason: error };
        }
        emit(
            createEvent(CoreEvent.TaskChainFinished, {
                id: platformEvent.id,
                data: { result }
            })
        );
    }

    private getTaskScheduler(): TaskScheduler {
        if (!this.taskScheduler) {
            this.taskScheduler = getTaskScheduler();
        }

        return this.taskScheduler;
    }
}
