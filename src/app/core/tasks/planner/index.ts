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
        platformEvent: PlatformEvent
    ): Promise<PlannedTask> {
        try {
            checkIfTaskExists(runnableTask.name);

            const plannedTask = await (runnableTask.interval > 0
                ? this.planScheduled(runnableTask, platformEvent)
                : this.planImmediate(runnableTask, platformEvent));
            // TODO: do something with planned task id and cancelEvent

            return plannedTask;
        } catch (err) {
            this.emitTaskChainFinised(platformEvent.id, err);
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
            this.emitTaskChainFinised(platformEvent.id);

            return possibleExisting;
        }

        const plannedTask = await this.getTaskScheduler().schedule(
            runnableTask
        );
        this.emitTaskChainFinised(platformEvent.id);

        return plannedTask;
    }

    private emitTaskChainFinised(id: string, error?: Error) {
        let result: TaskChainResult = { status: TaskResultStatus.Ok };
        if (error) {
            result = { status: TaskResultStatus.Error, reason: error };
        }
        emit(
            createEvent(CoreEvent.TaskChainFinished, {
                id,
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
